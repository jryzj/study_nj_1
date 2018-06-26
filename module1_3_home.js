//home page module
const procedure = require('./procedures1_3_home');
const funs = require('./funs');

module.exports = {
    funSwitch : function (request, response, pathName) {
        pathName = funs.strSplitBySymbol(pathName, '/',1);
        switch (pathName[0]){
            case '':
                procedure.showHomePage(request,response);
                break;
            case '/user_insert':
                procedure.insertUser(request,response);
                break;
            case '/user_query':
                procedure.queryUser(request,response);
                break;
            case '/user_delete':
                procedure.deleteUser(request,response);
                break;
            case '/user_update':
                procedure.updateUser(request, response);
                break;
        }

    }
}