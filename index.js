const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
var app = express();
// var server1 = require('http').createServer(app);
var users=[];

const server = http.createServer((req, res) => {
    //Images
    var publicDir = require('path').join(__dirname,'/public');
    app.use(express.static(publicDir));
    app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
    // Build File Path
    let filePath = path.join(__dirname, 
        'public', 
        req.url === '/' ? 'index.html': req.url);
    
    //Extension of file
    let extName = path.extname(filePath);

    //Initial Content Type
    let contentType = 'text/html';

    //Check the extension and then set the content type
    switch(extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;    
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;        
        case '.jpg':
            contentType = 'image/jpg';
            break;        

    }

    //Read File
    fs.readFile(filePath, (err,content) => {
        if(err) {
            if(err.code === 'ENONET') {
                // Page Not Found
                fs.readFile(
                    path.join(__dirname, 'public', '404.html'), 
                    (err,content) => {
                        res.writeHead(200, {'Content-Type' :'text/html'});
                        res.end(content, 'utf8');
                    }
                    );
            } else {
                // Some Server Error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);

            }
        } else {
            //Success
            res.writeHead(200, {'Content-Type' :contentType});
            res.end(content, 'utf8');
        } 
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    
    users[socket.id] = socket;

console.log(users.length);
});