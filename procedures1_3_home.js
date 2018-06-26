const funs = require('./funs');
const async = require('async');
const mysql = require('mysql');
const mysql_op = require('./mysql_op1_3');
const fs = require('fs');
const events = require('events');

module.exports = {
    showHomePage : function (request, response) {

        //本级别闭包解决方案=>方案可行
        // response.writeHead(200,{'Content-Type':'text/html'});
        // let r = funs.funReadTextFile('./home1_2.html',function(data,response){
        //     response.write(data);
        //     response.end();
        // },response);
        // r();


        //异步转同步解决方案（未解决）
        // response.writeHead(200,{'Content-Type':'text/html'});
        // let resultNote ={'flag':0,'done':false, 'result':'','error':false,'errorMsg':''};
        // // funs.funReadTextFileSync('./home1_2.html',resultNote);
        //
        //
        // fs.readFile('./home1_2.html', function (err, data) {
        //     console.log('readTextFile');
        //     if (err) {
        //         // throw err;
        //         // return (result={'done': false, 'result': data, 'error': true, 'errorMsg': err});
        //         // result={'flag':1,'done': false, 'result': data, 'error': true, 'errorMsg': err};
        //         resultNote.flag = 1;
        //     }
        //     // result = {'flag': 1, 'done': true, 'result': data, 'error': false, 'errorMsg': err};
        //     resultNote.flag = 1;
        //     console.log(result, 'funs');
        //
        // });
        //
        // // while(!(resultNote = funs.funReadTextFileSync('./home1_2.html'))){
        // let i=1;
        // while(resultNote.flag === 0){
        //     if (i===1)
        //     console.log('while');
        //     i++;
        // };
        // if (resultNote.error){
        //     throw resultNote.errorMsg;
        // }
        // console.log('ok');
        // console.log(resultNote.result);
        // response.write(resultNote.result);
        // response.end();



        //事件处理的方法=>方案可行
        response.writeHead(200,{'Content-Type':'text/html'});
        let eEmitter = events.EventEmitter;
        let event = new eEmitter();
        event.once('readok',(data)=>{
            response.write(data);
            response.end();
        });

        funs.funReadTextFileSyncByEmitter('./home1_2.html',event,'readok'); //这样写可以方便把基本的功能模块化！

        // fs.readFile('./home1_2.html', function (err, data) {
        //          console.log('readTextFile');
        //             if (err) {
        //                 throw err;
        //             }
        //             event.emit('readok',data);
        //             console.log('readok, send emiter');
        //
        //         });







        //传递到下级解决方案=>方案可行
        // funs.readFileToResponse('./home1_3.html',response);
    },
    insertUser :function(request,response){
        console.log('procedure -> insertUser');
        let params =funs.getUrlParams(request);
        console.log(params);
        let sql = 'INSERT INTO users(id, name, gender, age, email) VALUES (0,?,?,?,?)';
        params = [params['name'], params['gender'], params['age'], params['email']];
        console.log(params);
        mysql_op.mysqlInsert(sql, params,function(err,result){
            if (err) {
                console.log('preocedure insert error :', err);
                throw err;
            }
            funs.returnStatus(response,'success');
        });
    },
    queryUser : function (request, response) {
        console.log('procedure -> queryUser');
        let params = funs.getUrlParams(request);
        console.log(params);
        let sql = 'SELECT * FROM users ';
        let s='';
        for (i in params) {
            if (params[i] != '') {
                s = `${s}${i} = '${params[i]}' AND `;
            }
        }
        console.log(s);
        if( s!= ''){
         s = s.substring(0,s.length-5);
            sql =sql + 'WHERE ' + s}
        console.log(sql);
        mysql_op.mysqlQuery(sql, function (err, result) {
            if (err) {
                console.log('preocedure insert error :', err);
                throw err;
            }
            funs.returnStatus(response,result,{'Content-Type': 'text/html'});
        })
    },
    deleteUser : function (request, response) {
        console.log('procedure -> deleteUser');
        let params = funs.getUrlParams(request);
        console.log(params);
        let sql = 'DELETE FROM users ';
        let s='';
        for (i in params) {
            if (params[i] != '') {
                s = `${s}${i} = '${params[i]}' AND `;
            }
        }
        console.log(s);
        if( s!= ''){
            s = s.substring(0,s.length-5);
            sql =sql + 'WHERE ' + s}
        console.log(sql);
        mysql_op.mysqlDelete(sql, function (err, result) {
            if (err) {
                console.log('preocedure insert error :', err);
                throw err;
            }
            funs.returnStatus(response,result,{'Content-Type': 'text/html'});
        })
    },
    updateUser : function (request, response) {
        console.log('procedure -> updateUser');
        let params = funs.getUrlParams(request);
        console.log(params);
        let s='';
        for (i in params) {
            if (i != 'name') {
                if (params[i].length != 0) {
                    s = `${s}${i} = '${params[i]}', `;
                }
            }
        }
        console.log(s);
        if( s.length != 0 ){
            s = s.substring(0,s.length-2);}
        let sql = 'UPDATE users SET ';
        sql =sql + s + `WHERE + name = '${params.name}'`;
        console.log(sql);
        mysql_op.mysqlUpdate(sql, function (err, result) {
            if (err) {
                console.log('preocedure update error :', err);
                throw err;
            }
            funs.returnStatus(response,result,{'Content-Type': 'text/html'});
        })
    }

}