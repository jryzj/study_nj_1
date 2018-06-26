'use strict';

var http = require('http');
var fun22 = require('./fun2');
var fun = require('./funs');
var funName = 'fun4';

var Jerry = new fun.clsPerson('jerry',29);

var server = http.createServer(function (request, response) {
    console.log(request.method + ':' + request.url);
    response.writeHead(200, {'Content-Type': 'text/html'});
    fun1(response);
    fun22(response);
    fun.fun3(response);
    fun[funName](response);
    response.write(Jerry.sayHello());
    response.end('<h1>Hello guys!</h1>');
});

server.listen(8080);

console.log('Server is running at http://localhost:8080');

function fun1(res){
    console.log('fun1');
    res.write('this is fun1 \n');
}
