'use strict';
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

var root = path.resolve(process.argv[2]||'.');
console.log('Static root dir :' + root);
var server=http.createServer(function(requset,response){
    var pathname=url.parse(requset.url).pathname;
    var filepath = path.join(root, pathname);
    fs.stat(filepath,function(err,stats){
        if(!err&&stats.isFile()){
            console.log('200' + requset.url);
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);
        }
        else{
            console.log('404' + requset.url);
            response.writeHead('404');
            response.end('404 not found');
        }
    });
});
server.listen(8080);

console.log('server is running at http://localhost:8080');



