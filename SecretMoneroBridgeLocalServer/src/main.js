const { app, BrowserWindow, ipcMain } = require('electron');
const { fork } = require('child_process');
const ps = fork(`${__dirname}/server.js`);
const tcpPortUsed = require('tcp-port-used');
const IPFS = require('ipfs');
const path = require('path');
const fsE = require('fs-extra');
const os = require('os');
const fetch = require('node-fetch');
const tarball = require('tarball-extract');
const homepath = path.join(os.homedir(), "SecretMoneroBridge");
const gatewaysUrl = "https://ipfs.github.io/public-gateway-checker/gateways.json";
const debug = false;
const nsMasterHash = "k51qzi5uqu5dhbw8rdb2izuyemvqmzj12omml9xun0pu58csozinpbvtw7h3f1";
const abortController = require('abort-controller');
const staticGateways = ["https://ipfs.io/ipfs/:hash",
  "https://dweb.link/ipfs/:hash",
  "https://gateway.ipfs.io/ipfs/:hash",
  "https://ipfs.infura.io/ipfs/:hash",
  "https://infura-ipfs.io/ipfs/:hash",
  "https://ninetailed.ninja/ipfs/:hash",
  "https://ipfs.globalupload.io/:hash",
  "https://10.via0.com/ipfs/:hash",
  "https://ipfs.eternum.io/ipfs/:hash",
  "https://hardbin.com/ipfs/:hash",
  "https://gateway.blocksec.com/ipfs/:hash",
  "https://cloudflare-ipfs.com/ipfs/:hash",
  "https://astyanax.io/ipfs/:hash",
  "https://cf-ipfs.com/ipfs/:hash",
  "https://ipns.co/ipfs/:hash",
  "https://ipfs.mrh.io/ipfs/:hash",
  "https://gateway.originprotocol.com/ipfs/:hash",
  "https://gateway.pinata.cloud/ipfs/:hash",
  "https://ipfs.doolta.com/ipfs/:hash",
  "https://ipfs.sloppyta.co/ipfs/:hash",
  "https://ipfs.busy.org/ipfs/:hash",
  "https://ipfs.greyh.at/ipfs/:hash",
  "https://gateway.serph.network/ipfs/:hash",
  "https://jorropo.ovh/ipfs/:hash",
  "https://jorropo.net/ipfs/:hash",
  "https://gateway.temporal.cloud/ipfs/:hash",
  "https://ipfs.fooock.com/ipfs/:hash",
  "https://cdn.cwinfo.net/ipfs/:hash",
  "https://aragon.ventures/ipfs/:hash",
  "https://ipfs-cdn.aragon.ventures/ipfs/:hash",
  "https://permaweb.io/ipfs/:hash",
  "https://ipfs.stibarc.com/ipfs/:hash",
  "https://ipfs.best-practice.se/ipfs/:hash",
  "https://2read.net/ipfs/:hash",
  "https://ipfs.2read.net/ipfs/:hash",
  "https://storjipfs-gateway.com/ipfs/:hash",
  "https://ipfs.runfission.com/ipfs/:hash",
  "https://ipfs.trusti.id/ipfs/:hash",
  "https://ipfs.overpi.com/ipfs/:hash",
  "https://gateway.ipfs.lc/ipfs/:hash",
  "https://ipfs.leiyun.org/ipfs/:hash",
  "https://ipfs.ink/ipfs/:hash",
  "https://ipfs.oceanprotocol.com/ipfs/:hash",
  "https://d26g9c7mfuzstv.cloudfront.net/ipfs/:hash",
  "https://ipfsgateway.makersplace.com/ipfs/:hash",
  "https://gateway.ravenland.org/ipfs/:hash",
  "https://ipfs.funnychain.co/ipfs/:hash",
  "https://ipfs.telos.miami/ipfs/:hash",
  "https://robotizing.net/ipfs/:hash",
  "https://ipfs.mttk.net/ipfs/:hash",
  "https://ipfs.fleek.co/ipfs/:hash",
  "https://ipfs.jbb.one/ipfs/:hash",
  "https://ipfs.yt/ipfs/:hash",
  "https://jacl.tech/ipfs/:hash",
  "https://hashnews.k1ic.com/ipfs/:hash",
  "https://ipfs.vip/ipfs/:hash",
  "https://ipfs.k1ic.com/ipfs/:hash",
  "https://ipfs.drink.cafe/ipfs/:hash",
  "https://ipfs.azurewebsites.net/ipfs/:hash",
  "https://gw.ipfspin.com/ipfs/:hash",
  "https://ipfs.kavin.rocks/ipfs/:hash",
  "https://ipfs.denarius.io/ipfs/:hash",
  "https://ipfs.mihir.ch/ipfs/:hash",
  "https://bluelight.link/ipfs/:hash",
  "https://crustwebsites.net/ipfs/:hash",
  "http://3.211.196.68:8080/ipfs/:hash",
  "https://ipfs0.sjc.cloudsigma.com/ipfs/:hash",
  "https://ipfs-tezos.giganode.io/ipfs/:hash",
  "http://183.252.17.149:82/ipfs/:hash",
  "http://ipfs.genenetwork.org/ipfs/:hash",
  "https://ipfs.eth.aragon.network/ipfs/:hash",
  "https://ipfs.smartholdem.io/ipfs/:hash",
  "https://bin.d0x.to/ipfs/:hash",
  "https://ipfs.xoqq.ch/ipfs/:hash",
  "https://birds-are-nice.me/ipfs/:hash",
  "http://natoboram.mynetgear.com:8080/ipfs/:hash",
  "https://video.oneloveipfs.com/ipfs/:hash",
  "http://ipfs.anonymize.com/ipfs/:hash",
  "https://ipfs.noormohammed.tech/ipfs/:hash",
  "https://ipfs.taxi/ipfs/:hash",
  "https://ipfs.scalaproject.io/ipfs/:hash",
  "https://search.ipfsgate.com/ipfs/:hash",
  "https://ipfs.itargo.io/ipfs/:hash",
  "https://ipfs.decoo.io/ipfs/:hash",
  "https://ivoputzer.xyz/ipfs/:hash",
  "https://alexdav.id/ipfs/:hash",
  "https://ipfs.uploads.nu/ipfs/:hash",
  "https://hub.textile.io/ipfs/:hash",
  "https://ipfs1.pixura.io/ipfs/:hash",
  "https://ravencoinipfs-gateway.com/ipfs/:hash",
  "https://konubinix.eu/ipfs/:hash",
  "https://ipfs.clansty.com/ipfs/:hash",
  "https://3cloud.ee/ipfs/:hash",
  "https://ipfs.tubby.cloud/ipfs/:hash",
  "https://ipfs.forsla.app/ipfs/:hash",
  "https://ipfs.lain.la/ipfs/:hash",
  "https://ipfs.adatools.io/ipfs/:hash",
  "https://ipfs.kaleido.art/ipfs/:hash",
  "https://ipfs.slang.cx/ipfs/:hash",
  "https://ipfs.arching-kaos.com/ipfs/:hash",
  "https://storry.tv/ipfs/:hash",
  "https://ipfs.kxv.io/ipfs/:hash",
  "https://ipfs-nosub.stibarc.com/ipfs/:hash"];

const fetchWithTimeout = async (resource, options) => {
  const { timeout = 20000 } = options;
  const controller = new abortController();
  const callTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);



  return await fetch(resource, {
    signal: controller.signal,
    redirect: 'follow'
  })
    .then((response) => {
      // console.log(response)
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .catch((error) => {
      return error;
    })
    .finally(() => {
      clearTimeout(callTimeout);
    });
}

const createCallPromise = (gate, item, ipfsPrefix) => {
  return new Promise((resolve, reject) => {
    const startTime = new Date();
    console.log(gate, item)
    fetchWithTimeout(gate, {
      timeout: 30000
    })
      .then(response => {
        if (!response) {
          reject({ gate: item, error: "noresponse" });
        }
        return response.json()
      })
      .then(data => {
        resolve({ gate: item, type: ipfsPrefix, responseTime: new Date().getTime() - startTime.getTime() })
      })
      .catch(error => {
        reject({ gate: item, error: error, type: ipfsPrefix })
      })
  });

}


let port, mainWindow, ipfs, contentcid, loadedGateways;

if (process.platform === "linux") {
  app.disableHardwareAcceleration()
}

const getDappSize = async (dapploc) => {
  return new Promise(async (resolve, reject) => {
    fetch(dapploc)
      .then(response => {
        if (!response) {
          reject("noresponse");
        }
        return response.json()
      })
      .then(data => {
        resolve(data.size)
      })
      .catch(error => {
        reject(error)
      })
  });
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  })
  mainWindow.setMenuBarVisibility(true)
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
      queryIpfsResults = await queryIpfs()
      mainWindow.webContents.send(queryIpfsResults, {})
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

const getGateways = (replaceThis, replaceThat,filename, prefix) => {
  return new Promise(async (resolve, reject) => {

    fetchWithTimeout(gatewaysUrl, {
      timeout: 60000
    })
      .then(response => response.json())
      .then(data => {
        gatewaysToUse = data;
      })
      .catch(error => {
        gatewaysToUse = staticGateways;
      })
      .finally(() => {
        
        
        const promises = gatewaysToUse.map(item => createCallPromise(item.replace(replaceThis, replaceThat + (filename?"/"+filename:"")), item, prefix));

        Promise.allSettled(promises)
          .then(data => {
            for (let i = data.length - 1; i >= 0; i--) {
              if (!data[i].status || data[i].status !== "fulfilled" || !data[i].value.responseTime) {
                data.splice(i, 1);
              }
            }
            data.sort((firstItem, secondItem) => {
              return firstItem.value.responseTime - secondItem.value.responseTime
            });
            resolve(data)
          })
          .catch(error => {
            reject(error);
          })
      });
  });
}
const getDappFilelist = (replaceThis, replaceThat, filename, prefix,timeout) => {
  return new Promise(async (resolve, reject) => {
    let gateways;

    if (loadedGateways){
      gateways=loadedGateways;
    }else{
      gateways = await getGateways(replaceThis, replaceThat, filename, prefix);
      loadedGateways=gateways;
    }

    if (gateways && gateways.length>0){
      let data;
      for (let x = 0; x < gateways.length; x++) {
        try {
          const response = await fetchWithTimeout(`${gateways[x].value.gate.replace(replaceThis,replaceThat)}${filename?"/"+filename:""}`, { timeout: timeout||30000 });
          data = await response.json();
          resolve(data)
          break;
        } catch (ignore) { }
        if (x===gateways.length-1){
          reject(data);
        }
      }
    }else{
      reject();
    }
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

    const extractTar = async (tar, zipPath, homepath, cid) => {
      return new Promise((resolve, reject) => {
        tar.extractTarball(zipPath, homepath, async function (err) {
          if (err) reject(err)

          const publicFolderExists = await fsE.pathExists(path.join(homepath, "public"));
          if (publicFolderExists) {
            await fsE.remove(path.join(homepath, "public"))
          }
          fsE.renameSync(path.join(homepath, cid), path.join(homepath, "public"))
          await fsE.remove(path.join(homepath, "temp"))
          resolve()
         
        })
      })
    }

    const processIPFSFiles = async () => {
      const bufArray = [];
      const zipPath = path.join(homepath, path.join("temp", "file.zip"));

      let finalBuf;

      try {
        for await (const data of ipfs.get(contentcid)) {
          bufArray.push(data);
        }
        finalBuf = Buffer.concat(bufArray);
        await fsE.outputFile(zipPath, finalBuf)

        //extract tar
        await extractTar(tarball, zipPath, homepath, contentcid);

      } catch (error) {
        throw error;
      }
    }

    const getSize = async () => {
      return new Promise(async (resolve, reject) => {
        try{
          const filelistData = await getDappFilelist(":hash", contentcid, "filelist.json", "ipfs");
          resolve(filelistData.size)
        }catch(error){
          reject();
        }
      });
    }

    const getContentVars = async () => {
      return new Promise(async (resolve, reject) => {
        try{
          const filelistData = await getDappFilelist("ipfs/:hash", `ipns/${nsMasterHash}`, 'master.json', "ipns");
          resolve(filelistData.dappQm)
        }catch(error){
          reject();
        }
      });
    }


    const removedir = async(dir) => {
      try {
        return await fsE.remove(dir)
      } catch (ignore) { }
    }

    try {
      const publicFolderExists = await fsE.pathExists(path.join(homepath, "public"));
      const doUpdate = async (hash) => {
        await removedir(path.join(homepath, "public"))
        await removedir(path.join(homepath, "latesthash"))
        await processIPFSFiles(hash)
      };

      mainWindow.webContents.send("updatestatus", {text:"Initializing IPFS"})
      const ipfsGood = await initIpfs();

      if (ipfsGood) {
        mainWindow.webContents.send("updatestatus", {text:"Checking latest Dapp"})
        contentcid = await getContentVars();

        if (contentcid){
          if (!publicFolderExists) {
            mainWindow.webContents.send("updatestatus", {text:"Syncing Dapp content"})
            await doUpdate()
            resolve("updatesuccess")
          } else {

            // const publicFilelist = await fsE.readJson(path.join(homepath, path.join("public", "filelist.json")));
            const publicFilelist = await fsE.readJson(path.join(homepath,"public", "filelist.json"));
            const filelistSize = await getSize();

            if (!filelistSize || filelistSize !== publicFilelist.size) {
              mainWindow.webContents.send("updatestatus", {text:"Update available, syncing Dapp content"})
              await doUpdate()
              resolve("updatesuccess")
            }
            resolve("updatena")
          }
        }else{
          await fsE.remove(ath.join(homepath,"public"))
          reject("updatefail")
        }
      } else {
        await fsE.remove(ath.join(homepath,"public"))
        reject("updatefail")
      }
    } catch (err) {
      await fsE.remove(path.join(homepath,"public"))
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
