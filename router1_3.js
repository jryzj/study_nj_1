const http = require('http');
const url = require('url');
const procedure = require('./procedures1_3_home');
const funs = require('./funs');
const module_home = require ('./module1_3_home');

module.exports = {
    router : function (request, response) {
        let pathName =  url.parse(request.url).pathname;
        pathName = funs.strSplitBySymbol(pathName, '/',1);
        console.log(pathName);
        switch (pathName[0]){
            case '/' :
                //show homepage
                module_home.funSwitch(request,response,pathName[1]);
                break;
            case '/home' :
                module_home.funSwitch(request,response,pathName[1]);
                break;
        }
    }
}