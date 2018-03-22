
var cluster = require('cluster');  
var http = require('http');  
var numCPUs = require('os').cpus().length;  
var log = console.log;
var express = require('express');
var app = new express()
  
if (cluster.isMaster) { 

    for (var i = 0; i < numCPUs; i++) {  
        var wk = cluster.fork();  
        wk.send('[master] ' + 'hi worker' + wk.id);  
    }  
  
    cluster.on('fork', function (worker) {  
        console.log('监听----', worker.id);  
    });  

  
    cluster.on('listening', function (worker, address) {  
        console.log('in listening---', worker.id);  
    });  

    // app.use((req, res)=>{
    //   res.writeHead(200, {"content-type": "text/html"});  
    //   res.end('worker'+cluster.workers+',PID:'+process.pid);
    // });
    // app.listen(3001);
  
    // function eachWorker(callback) {  
    //     for (var id in cluster.workers) {  
    //         callback(cluster.workers[id]);  
    //     }  
    // }  
  
    // setTimeout(function () {  
    //     eachWorker(function (worker) {  
    //         worker.send('[master] ' + 'send message to worker' + worker.id);  
    //     });  
    // }, 3000);  
  
    // Object.keys(cluster.workers).forEach(function(id) {  
    //     cluster.workers[id].on('message', function(msg){  
    //         console.log('[master] ' + 'message ' + msg);  
    //     });  
    // });  
log(cluster.Worker);
  
} else if (cluster.isWorker) {  
    console.log('子进程---',  cluster.worker.id);  
  
    // process.on('message', function(msg) {  
    //     console.log('[worker] '+msg);  
    //     process.send('[worker] worker'+cluster.worker.id+' received!');  
    // });  

    app.listen(2002, '0.0.0.0');
    app.use('*', (req, res)=>{
      console.log('-----', cluster.worker.id)
      setTimeout(() => {
        res.writeHead(200, {"content-type": "text/html"});  
        res.end('worker'+cluster.worker.id+',PID:'+process.pid);
      }, 5000);
    });

   
  
    // var http1 = http.createServer(function (req, res) {  
    //         res.writeHead(200, {"content-type": "text/html"});  
    //         res.end('worker'+cluster.worker.id+',PID:'+process.pid);  
    // }).listen(3000);  
    
  
}  