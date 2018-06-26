const fs = require('fs');
const url = require('url');
const funs = require('./funs');
const querystring = require('querystring');
const buffer = require('buffer');
const formidable =require('formidable');

module.exports = {
    rOne : function (request, response, callback) {
        response.writeHead(200,{'Content-Type':"text/html"});
        console.log('get in rOne');
        fs.readFile('./node.html',function (err,data) {
           if (err) throw err;
           // console.log(data);
           response.write(data);
           response.end('end');
            // callback(request, response, data);
        });
    },
    rTwo : function (request, response, callback) {
        response.writeHead(200,{'Content-Type':"text/html"});
        console.log('get in rTwo');
        fs.readFile('./2.txt',function (err,data) {
            if (err) throw err;
            callback(request, response, data);
        });
    },
    rHome : function (request, response, callback) {
        response.writeHead(200,{'Content-Type':"text/html"});
        console.log('get in rHome');
        fs.readFile('./home1_2.html', function (err,data) {
            if (err) throw err;
            response.write(data);
            response.end();
        })
    },
    rThree : function (request, response, callback) {
        response.writeHead(200,{'Content-Type':"text/html"});
        let msg='';
        console.log('get in rThree');
        if (request.method == 'GET'){
            console.log('GET method in rThree');
        msg = querystring.parse(url.parse(request.url).query);
        console.log(request);
        console.log(msg);
        fs.appendFile('./msg.txt', 'get: ' +  msg.msg + '\r\n', 'utf8', function (err) {
            if (err) throw err;
            console.log('GET : append message done!');
            response.write('<p>get message saved!</p>');
            response.end();
        });}else if (request.method == 'POST'){
            console.log('POST method in rThree');
            let post='';
            request.on('data',function (chunk) {
                post = post +chunk;
            });
            request.on('end',function () {
                msg = querystring.parse(post);
                fs.appendFile('./msg.txt','post; ' + msg.msg + '\r\n', function (err) {
                    if (err) throw err;
                    console.log('POST ; append msg done!');
                    response.write('<p>get message saved!</p>');
                    response.end();
                })
            })
        }
    },
    rFour : function(requset, response, callback) {
        response.writeHead(200,{'Content-Type':"image/jpeg"});
        console.log('get in rFour');
        fs.readFile('./altas.jpg','binary',function (err,data) {
            if (err) throw err;
            response.write(data, 'binary');
            response.end();
        })

},
    showdata : function (request, response) {
        let get = querystring.parse(url.parse(request.url).query);
        let datasrc = '';
        console.log(get);
        switch (get.datatype){
            case 'text':
                if(get.data == 'msgtxt'){
                    datasrc = './msg.txt'
                }
                funs.showText(request, response, datasrc);
                break;
            default :

        }
    },
    savepic : function(request, response){
        console.log('savepic');
        let method = request.method.toUpperCase();
        if (method == 'POST') {
            let postdata = Buffer.alloc(0);         //定义二进制缓冲区
            request.on('data',function (chunk) {
                console.log(chunk, chunk.length);
                postdata = Buffer.concat([postdata,chunk]);   //request中接受的是浏览器器拼接成的FromData数据，数据如果表单是ACSII码，文件是二进制，所以是混合体。
            });
            request.on('end',function () {
                let params = funs.postBodyParse(request,postdata); //调用解析函数
                fs.writeFile('./'+params[1]['filename'],params[1]['file'],function (err,data) {
                    if (err) throw err;
                    response.writeHead(200,{"Content-Type":"text/html"});
                    response.end('got and save file!');
                });
            })
        }

    }
    ,
    savepic1 : function(request, response){
        console.log('savepic1');
        let method = request.method.toUpperCase();
        if (method == 'POST') {
            let postdata = '';
            request.on('data',function (chunk) {

                for (let i=0; i<chunk.length;i++){
                    //如果以postdata+chunk的方式，合成的整体数据会变短，还看不出原因，估计是字符转换造成问题。
                    //所以只好逐个数据处理。
                    postdata += String.fromCharCode(chunk[i]);
                }
            });
            request.on('end',function () {
                let params = funs.postBodyParse1(request,postdata);
                fs.writeFile('./'+params[1]['filename'],params[1]['file'],'latin1',function (err,data) {
                    if (err) throw err;
                    response.writeHead(200,{"Content-Type":"text/html"});
                    response.end('got and save file!');
                });
            })
        }

    },
    savepic2 : function(request, response){
        let form = new formidable.IncomingForm();
        form.uploadDir = './';
        form.keepExtensions = 'true';

        form.parse(request,function(err, fields, files){//fileds, files输出都是对象
            console.log(fields);
            console.log(files);
            fs.rename(files.file.path,'./'+fields.filename,function (err) {
               if (err) throw err;
            });
            response.writeHead(200,{"Content-Type":"text/html"});
            response.end('got and save file!');
        }).on('field',function(name, field){  //收到文本输入的额外处理
            console.log('field: ',name,'----',field);
        }).on('fileBegin',function(name, file){  //开始接收文件时候需要的额外处理
            console.log(name,'----fileBegin');
        }).on('file',function(name,file){   //文件接收完毕时候的额外处理
            console.log(name,'------file received', file);
        }).on('progress',function(byteReceived, byteExcepted){   //接收过程中的额外处理
            console.log(byteReceived,'byte---received!');
        }).on('end',function () {  //处理完毕，关闭前的最后额外处理，比parse主处理还后。
            console.log('form reecived end');

        }).on('err',function (err) {  //发生错误的额外处理
            throw err;            
        }).on('abort',function () {  //放弃的额外处理
            console.log('form aborted');
        })

    },
    rN : function (request, response, callback) {
        response.writeHead(200,{'Content-Type':"text/html"});
        console.log('get in rN');
        response.write('<p>here is rN</p>');
        response.end('end')
    }
}