const { ipcRenderer, shell, clipboard } = require('electron');
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById("spawnbrowser").style.display = "none"
      document.getElementById("instruct").style.display = "none"
      document.getElementById("start").disabled=false
      document.getElementById("stop").disabled=true

      document.getElementById("start").addEventListener("click", function () {
        let port = document.getElementById("port").value
        if (!port || port.trim().length === 0) {
          port = "8889";
        }
        document.getElementById("port").value = port;
        ipcRenderer.send('start', parseInt(port))
      })

      document.getElementById("stop").addEventListener("click", function () {
        ipcRenderer.send('stop')
      })

      document.getElementById("copy").addEventListener("click", ()=>{
        clipboard.writeText(document.getElementById("url").innerText)
      })

      document.getElementById("retryupdate").addEventListener("click", ()=>{
        ipcRenderer.send('doupdate')
      })

      ipcRenderer.send('domready')
    })

    ipcRenderer.on('error', (event, msg) => {
      document.getElementById("status").innerText=msg.details
    });

    ipcRenderer.on('updatechecking', (event) => {
      document.getElementById("uiscreen").classList.remove("show")
      document.getElementById("uiscreen").classList.add("hide")
      document.getElementById("updating").classList.remove("hide")
      document.getElementById("updating").classList.add("show")
      document.getElementById("updatestatus").innerText="Checking for Updates"
      document.getElementById("retryupdateparent").style.display = "none"
    });

    ipcRenderer.on('updatesuccess', (event) => {
      document.getElementById("updating").style.display = "none"
      document.getElementById("uiscreen").style.display = "block"
      document.getElementById("updatestatus").innerText=""
      document.getElementById("retryupdateparent").style.display = "none"
    });

    ipcRenderer.on('updatena', (event) => {
      document.getElementById("updating").style.display = "none"
      document.getElementById("uiscreen").style.display = "block"
      document.getElementById("updatestatus").innerText=""
      document.getElementById("retryupdateparent").style.display = "none"
    });

    ipcRenderer.on('updatefail', (event) => {
      document.getElementById("updating").style.display = "block"
      document.getElementById("uiscreen").style.display = "none"
      document.getElementById("updatestatus").innerText="Update Failed, please Retry"
      document.getElementById("retryupdateparent").style.display = "block"
    });
    
    ipcRenderer.on('portinuse', (event) => {
      const status = document.getElementById("status")

      document.getElementById("spawnbrowser").style.display = "none"
      document.getElementById("instruct").style.display = "none"
      document.getElementById("stop").disabled=true
      document.getElementById("start").disabled=false
      document.getElementById("port").disabled=false
      status.classList.remove("successstatus")
      status.classList.add("errorstatus")
      status.innerText="This port is not available."
      document.getElementById("url").innerText=""
    });
    ipcRenderer.on('running', (event, msg) => {
      const status = document.getElementById("status")

      document.getElementById("spawnbrowser").style.display = "block"
      document.getElementById("stop").disabled=false
      document.getElementById("start").disabled=true
      document.getElementById("port").disabled=true
      document.getElementById("instruct").style.display = "block"
      status.classList.remove("errorstatus")
      status.classList.add("successstatus")
      document.getElementById("status").innerText=`Running on port ${msg}`
      document.getElementById("url").innerText=`http://127.0.0.1:${msg}`
    });

    ipcRenderer.on('notrunning', () => {
      const status = document.getElementById("status")
      document.getElementById("spawnbrowser").style.display = "none"
      document.getElementById("instruct").style.display = "none"
      document.getElementById("stop").disabled=true
      document.getElementById("start").disabled=false
      document.getElementById("port").disabled=false
      status.classList.remove("errorstatus")
      status.classList.remove("successstatus")
      status.innerText=""
      document.getElementById("url").innerText=""
    });