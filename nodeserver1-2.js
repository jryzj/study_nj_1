'use strict'

var http = require('http');
var url = require('url');
var router = require('./router1_2');
var funs = require('./funs');
var r = '';
var callback ='';

var server = http.createServer(function(request, response){
    console.log(request.method + ':' + request.url);
    // response.writeHead(200,{'Content-Type':"text/html"});
    var pathName = url.parse(request.url).pathname;
    pathName = pathName.split('/');
    // pathName = pathName.replace(/\//,'');
    console.log(pathName);
    if(pathName[1] != 'favicon.ico') {
        switch (pathName[1]) {
            case 'one':
                r = 'rOne';
                callback = 'funs.BOMShow';
                break;
            case 'two':
                r = 'rTwo';
                callback = 'funs.BOMShow';
                break;
            case '':
                r = 'rHome';
                callback = 'funs.BOMShow';
                break;
            case 'three':
                r = 'rThree';
                callback = '';
                break;
            case 'four':
                r = 'rFour';
                callback = '';
                break;
            case 'showdata':
                r = 'showdata';
                break;
            case 'savepic' :
                    r = 'savepic';
                break;
            case 'savepic1' :
                r = 'savepic1';
                break;
            case 'savepic2' :
                r = 'savepic2';
                break;
            default:
                r = 'rN';
                callback = 'funs.BOMShow'
        }
        router[r](request, response, callback);
    }
    else {
        funs.showFavicon(request, response);
    }
});

server.listen(8080);
console.log('server is running at local:8080');