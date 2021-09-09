// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron'),
  { fork } = require('child_process'),
  ps = fork(`${__dirname}/server.js`),
  tcpPortUsed = require('tcp-port-used'),
  IPFS = require('ipfs'),
  path = require('path'),
  fsE = require('fs-extra'),
  os = require('os'),
  fetch = require('node-fetch'),
  tarball = require('tarball-extract'),
  homepath = path.join(os.homedir(), "SecretMoneroBridge"),
  debug = false,
  masterJson = {
    "masterxml": "https://ipfs.io/ipfs/QmdksBKDiU8LpLiBt4BSyEA1mfSA3jzPdWFL6y25Ww2hKu?filename=testnet_locale.json",
    "masterxmlMainnet": "https://ipfs.io/ipfs/QmeQFJdvtZpoXD3h1zjW5oLeH43gsdGtWPPh2gSg47AbNT",
    "contentHash": "https://yadayada.com",
    "contentHashMainnet": "QmU3vv57heMiuJ7GcNSodxgqdVEWgbEcVKTyUVx7JNmu7e",
    "dapp":"QmUg4CpT22u5TW9ie8tyXYXbifRCWFdMYu4TZpCFDST3UM",
    "relayproviders": [
      { "wallet": "secret1fq6m707fghw6r0kc7cpggzqvev9fthglqj9v90", "endpoint": "https://yadayada.com" },
      { "wallet": "secret1fq6m707fghw6r0kc7cpggzqvev9fthglqj9v90", "endpoint": "https://yadayada2.com" }
    ]
  }

let port, mainWindow, ipfs;

if (process.platform === "linux") {
  app.disableHardwareAcceleration()
}

// const getFreePortIpfs = (startport) => {
//   return new Promise(async (resolve, reject) => {
//     let port = startport;

//     let id = setInterval(() => {
//       port += 1;
//       console.log("checking");
//       tcpPortUsed.check(port, '127.0.0.1')
//         .then(function (inUse) {
//           if (!inUse) {
//             clearInterval(id);
//             resolve(port);
//           } else if (port > (startport + 1000)) {
//             clearInterval(id);
//             reject()
//           }
//         }, function (err) {
//           console.error('Error on check:', err.message);
//         });
//     }, 700)
//   })
// }

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadFile('index.html')

  ipcMain.on("start", (e, data) => {
    port = data || 8889;
    tcpPortUsed.check(port, '127.0.0.1')
      .then(function (inUse) {
        if (!inUse) {
          ps.send({
            key: "start",
            port: port
          })
        } else {
          mainWindow.webContents.send("portinuse", {})
        }
      }, function (err) {
        console.error('Error on check:', err.message);
      });
  });

  ipcMain.on("stop", (e, data) => {
    tcpPortUsed.check(port, '127.0.0.1')
      .then(function (inUse) {
        if (inUse) {
          ps.send({ key: "close" });
          let interval = setInterval(() => {
            tcpPortUsed.waitUntilFreeOnHost(port, '127.0.0.1', 500, 4000)
              .then(function () {
                mainWindow.webContents.send("notrunning")
                clearInterval(interval);
              }, function (ignore) { });
          }, 1000)
        } else {
          mainWindow.webContents.send("notrunning")
        }
      }, function (err) {
        console.error('Error on check:', err.message);
      });
  })

  ipcMain.on("doupdate", async () => {
    mainWindow.webContents.send("updatechecking", {})
    try {
      queryIpfs()
    } catch (error) {
      cleanupJsipfs();
      mainWindow.webContents.send("updatefail", {})
    }
  });

  ps.on('message', (msg) => {
    if (msg.message === "running") {
      mainWindow.webContents.send("running", msg.port)
    } else if (msg.message === "error") {
      mainWindow.webContents.send("error", msg.details)
    }
  });
}

const memoTxLookup = async () => {
  return new Promise(async (resolve, reject) => {
    let arrMemoTxs = [];

    let compare = (a, b) => {
      const txA = a.timestamp;
      const txB = b.timestamp;

      let comparison = 0;
      if (txA < txB) {
        comparison = 1;
      } else if (txA > txB) {
        comparison = -1;
      }
      return comparison;
    }

    let getTheOldestMemoHash = (justTxsArray) => {
      let justTxs = [];
      justTxsArray.forEach((item) => {
        item.txs.forEach((item) => {
          justTxs.push(item)
        })

      })
      let foundMostRecentTx = justTxs.sort(compare).find((item) => {
        return item.tx.value.memo !== "";
      })
      return foundMostRecentTx.tx.value.memo;
    }

    let createCallPromise = (pageNum) => {
      return new Promise(async (resolve, reject) => {
        fetch(`https://api.secretapi.io/txs?message.action=send&message.sender=secret1cfww28jrs67te4wx4fya9p87jzved9vgvzdzfa&page=${pageNum}&limit=${20}`)
          .then(response => {
            if (!response) {
              reject("noresponse");
            }
            return response.json()
          })
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      });

    }

    fetch(`https://api.secretapi.io/txs?message.action=send&message.sender=secret1cfww28jrs67te4wx4fya9p87jzved9vgvzdzfa`)
      .then(response => response.json())
      .then(data => {
        arrMemoTxs.push(data)
        if (parseInt(data.page_number) !== parseInt(data.page_total)) {
          let numPromises = parseInt(data.page_total) - parseInt(data.page_number);
          let p = [];
          if (numPromises > 0) {
            for (let x = 0; x <= numPromises - 1; x++) {
              p.push(createCallPromise(x + 2));
            }

            Promise.all(p).then(values => {
              arrMemoTxs.push(...values);
              resolve(getTheOldestMemoHash(arrMemoTxs));
            });
          }
        } else {
          resolve(getTheOldestMemoHash(arrMemoTxs));
        }
      })
      .catch(error => {
        reject(error)
      })
  });
}

const cleanupJsipfs = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await ipfs.stop();
    } catch (ignore) { }
    try {
      await fsE.remove(path.join(homepath, "jsipfs"))
      resolve()
    } catch (ignore) {
      reject();
    }
  });
}

const initIpfs = async () => {
  await cleanupJsipfs();
  try {
    ipfs = await IPFS.create({ repo: path.join(homepath, "jsipfs") });
    return true;
  } catch (error) {
    return false;
  }
}

const queryIpfs = async () => {
  return new Promise(async (resolve, reject) => {

    const extractTar = async (tar, zipPath, homepath, cid, oldCid) => {
      return new Promise((resolve, reject) => {
        tar.extractTarball(zipPath, homepath, async function (err) {
          if (err) reject(err)

          const publicFolderExists = await fsE.pathExists(path.join(homepath, "public"));
          if (publicFolderExists) {
            await fsE.remove(path.join(homepath, "public"))
          }
          fsE.renameSync(path.join(homepath, cid), path.join(homepath, "public"))
          await fsE.remove(path.join(homepath, "temp"))
          if (oldCid) {
            try {
              await fsE.remove(path.join(homepath, oldCid))
              resolve()
            } catch (ignore) { }
          } else {
            resolve()
          }
        })
      })
    }

    const processIPFSFiles = async (cid, oldCid) => {
      const bufArray = [];
      const zipPath = path.join(homepath, path.join("temp", "file.zip"));

      let finalBuf;

      try {
        if (cid.indexOf("http") !== -1) {
          const splitArray = cid.split("/");
          cid = splitArray[splitArray.length - 1];
        }
        for await (const data of ipfs.get(cid)) {
          bufArray.push(data);
        }
        finalBuf = Buffer.concat(bufArray);
        await fsE.outputFile(zipPath, finalBuf)

        //extract tar
        await extractTar(tarball, zipPath, homepath, cid, oldCid);

      } catch (error) {
        throw error;
      }
    }

    const getLatestHash = async () => {
      return new Promise(async (resolve, reject) => {
        if (!debug) {
          const masterJsonFile = await memoTxLookup();
          fetch(masterJsonFile)
            .then(response => {
              if (!response) {
                reject();
              }
              return response.json()
            })
            .then(data => {
              resolve(data.dapp)
            })
            .catch(error => {
              reject()
            })
        } else {
          resolve(masterJson.dapp)
        }

      });
    }

    async function removedir(dir) {
      try {
        return await fsE.remove(dir)
      } catch (ignore) { }
    }

    try {
      const loadedContentHash = path.join(homepath, path.join("latesthash", "contenthash.json"));
      const loadedContentHashExists = await fsE.pathExists(loadedContentHash);
      const publicFolderExists = await fsE.pathExists(path.join(homepath, "public"));
      const latestContentHash = await getLatestHash()
      const doUpdate = async (hash) => {
        const ipfsGood = await initIpfs();
        if (ipfsGood) {
          await removedir(path.join(homepath, "public"))
          await removedir(path.join(homepath, "latesthash"))
          await processIPFSFiles(hash)
          fsE.outputFile(path.join(homepath, path.join("latesthash", "contenthash.json")), JSON.stringify({ latest: hash }))
        } else {
          reject("Can't init IPFS");
        }
      }

      if (!loadedContentHashExists || !publicFolderExists) {
        await doUpdate(latestContentHash)
        resolve("updatesuccess")
      } else {
        const contentDataFile = await fsE.readJson(path.join(homepath, path.join("latesthash", "contenthash.json")))
        const storedContentHash = contentDataFile.latest
        if (storedContentHash !== latestContentHash) {
          await doUpdate(latestContentHash, storedContentHash)
          resolve("updatesuccess")
        }
        resolve("updatena")
      }
    } catch (err) {
      reject("updatefail")
    }
  });
}

ipcMain.on("domready", async () => {
  mainWindow.webContents.send("updatechecking", {})
  try {
    const queryIpfsResults = await queryIpfs();
    const publicFolderExists = await fsE.pathExists(path.join(homepath, "public"));
    if (!publicFolderExists) {
      await cleanupJsipfs();
      mainWindow.webContents.send("updatefail", {})
    } else {
      mainWindow.webContents.send(queryIpfsResults, {})
    }
  } catch (error) {
    await cleanupJsipfs();
    mainWindow.webContents.send("updatefail", {})
  }
});

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', async function () {
  try {
    ps.kill()
    await cleanupJsipfs();
  } catch (ignore) { }
  app.quit()
})

app.on('before-quit', async function () {
  try {
    ps.kill()
    await cleanupJsipfs();
  } catch (ignore) { }
});
