'use strict'

const http = require('http');
const url = require('url');
const router =require('./router1_3');
const funs = require('./funs');
const mysql = require('./mysql_op1_3');

var server = http.createServer(function(request, response){
   console.log(request.method + ':' +request.url);
   let pathName = url.parse(request.url).pathname;
   if (pathName == '/favicon.ico'){
       funs.showFavicon(request,response);
   }else{
       router['router'](request,response);
   }
});

server.listen(8080);
console.log('server is running at localhost:8080');