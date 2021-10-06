
const static = require('node-static');
const os = require('os');
const path = require('path');
const webFilesLocation = path.join(path.join(os.homedir(), "SecretMoneroBridge"), "public");
const file = new static.Server(webFilesLocation)

let server;

process.on('message', (msg) => {
    if (msg.key==="start"){
        try{
            start(msg.port);
        }catch(error){
            console.log("ERROR 1", error);
        }
    }else{
        try{
            stop();
        }catch(error){
            console.log("ERROR 2", error);
        }
    }
});

const start = (port)=>{
    try{
        server = require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                file.serve(request, response)
            }).resume()
        }).listen(port)
        process.send({message:"running", port:port})
    }catch(error){
        process.send({message:"error", details:error})
    }
}
const stop = ()=>{
    try{
        server.close();
    }catch(ignore){}
}
