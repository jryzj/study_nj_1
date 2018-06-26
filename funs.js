const fs = require('fs');
const async = require('async');
const mysql = require('mysql');
const querystring =require('querystring');
const url =require('url');

module.exports = {
    fun3: function (res) {
        console.log('funs.fun3');
        res.write('<div style="display:flex;height:50px;width:50px;background-color:green;justify-content:center;align-items:center"> fun3</div>')
    },
    fun4: function (res) {
        console.log('funs.fun4');
        res.write('fun4 \n');
    },
    clsPerson: class {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }

        sayHello() {
            console.log('sayHello');
            return `<p>I\'m ${this.name}, ${this.age} years old.</p>`;
        }
    },
    BOMShow: function (request, response, data) {
        console.log('BOMShow');
        response.write('<p>' + data + '</p>');
        response.end('<p>end of res.</p>');
    },
    showText: function (request, response, datasrc) {
        console.log('showText');
        response.writeHead(200, {'Context-Type': 'text/html'});
        fs.readFile(datasrc, function (err, data) {
            if (err) throw err;
            response.write(data);
            response.end();
        })
    },
    showFavicon: function (request, response) {
        console.log('showFavicon');
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        fs.readFile('./favicon.ico', 'binary', function (err, data) {
            if (err) throw err;
            response.write(data, 'binary');
            response.end();
        })
    },
    funReadTextFile: function (fileName, postAction, response) {
        return function () {
            fs.readFile(fileName, function (err, data) {
                console.log('readTextFile');
                if (err) throw err;
                postAction(data, response);
            })
        }
    },
    funReadTextFileSync: function (fileName, result) {
        console.log('funReadTextFileSync');
        fs.readFile(fileName, function (err, data) {
            console.log('readTextFile');
            if (err) {
                // throw err;
                // return (result={'done': false, 'result': data, 'error': true, 'errorMsg': err});
                // result={'flag':1,'done': false, 'result': data, 'error': true, 'errorMsg': err};
                result.flag = 1;
            }
            result={'flag':1,'done': true, 'result': data, 'error': false, 'errorMsg': err};
            result.flag = 1;
            console.log(result,'funs');
            // return result;
        });
    },
    funReadTextFileSyncByEmitter: function (fileName, emitter, event) {
        console.log('funReadTextFileSync');
        fs.readFile(fileName, function (err, data) {
            console.log('readTextFile');
            if (err) {
                throw err;
            }
            emitter.emit('readok',data);
        });
    },
    readFileToResponse: function (fileName, response,
                                  headers={'Content-Type': 'text/html'},
                                  encoding='utf8') {
        fs.readFile(fileName, function (err, data) {
            console.log('readTextFile');
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        })
    },
    readTextFile: function (fileName) {
        fs.readFile(fileName, function (err, data) {
            console.log('readTextFile');
            if (err) throw err;
            return data;
        })
    },
    strSplitBySymbol : function a (str, symbol, nth){
        if ( nth <=0) {
            return ['',str];
        }
        if ( str === '') {
            return ['',''];
        }
        if (str === symbol){
            return [symbol,''];
        }

        let index = 0;
        let n = 0;
        let l = str.length;
        while (n <= nth && index <l ) {
            index = str.indexOf(symbol, index);
            index++;
            n++;
            if (index == 0) {
                index = l;
                n--;
            }
        }
        console.log(index);
        console.log(n);

        if (index == l && n <= nth){
            console.log(3);
            return [str,''];
        }
        console.log(4);

        return [str.substring(0,index-1), str.substring(index-1)];
    },
    getUrlParams : function (request) {
        let params='';
        switch (request.method){
            case 'GET' :
                params = querystring.parse(url.parse(request.url).query);
                break;
            case 'POST' :
                let post='';
                request.on('data',function (chunk) {
                    post += chunk;
                })
                request.on('end',function () {
                    params = querystring.parse(post);
                })
                break
        }
        return params;
    },
    returnStatus: function (response, status, headers={'Content-Type': 'text/html'}) {
        console.log('returnStatus');
        console.log(typeof(status));
            response.writeHead(200, headers);
            response.write(JSON.stringify(status));
            response.end();
    },
    postBodyParse :  function (request,post){

        //传入的post是Buffer的类型

        console.log(post, post.length);

        /*
        获得的request数据结构如下，例如，
        ------WebKitFormBoundarytyJ2801DusTkW7pg
        Content-Disposition: form-data; name="filename"

        savapic
        ------WebKitFormBoundarytyJ2801DusTkW7pg
        Content-Disposition: form-data; name="file"; filename="Computer_Monitor_128px_566914_easyicon.net.png"
        Content-Type: image/png

       PNG

        IHDR         i7©@   gAMA  ±üa    cHRM  z&    ú   è  u0  ê`  :  
        ------WebKitFormBoundarytyJ2801DusTkW7pg
        Content-Disposition: form-data; name="btn-submit"

        æäº¤
        ------WebKitFormBoundarytyJ2801DusTkW7pg--







         */

        let postdata = post.toString();  //复制一个字符串副本，以便后面使用字符串方法。

        //获取request的headers属性的content-tyoe中的boundary定义。
        let index = request['headers']['content-type'].indexOf('boundary=');

        //在接受到的拼接数据中，boundary前面多个‘--’，在整个数据最后也多个‘--’
        let boundary = '--'+request['headers']['content-type'].substring(index+9);

        console.log(boundary);
        let postArray = postdata.split(boundary); //用字符串的split方法分割数据，获得数组。
        /*
        分割后的数组结构例子如下。
        [ '',
        '\r\nContent-Disposition: form-data; name="filename"\r\n\r\nsavapic\r\n',
        '\r\nContent-Disposition: form-data; name="file"; filename="Computer_Monitor_128px_566914_easyicon.net.png"\r\nContent-Type: image/png\r\n\r\nPNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000\u0000\u0000\u0000
        '\r\nContent-Disposition: form-data; name="btn-submit"\r\n\r\næäº¤\r\n',
        '--\r\n' ]

         */

        console.log(postArray);
        let params = []; //用于装解析后要返回的request数据，内含的每一项都是对象。
        let l = postArray.length;
        let code;
        let postPhrase = '';  //用于装数组中的单条数据，用于解析。
        for (let i = 1; i < l; i++) {
            console.log(i);
            let paramObj = {};  //用于装解析后的对象数据
            postPhrase = postArray[i];
            console.log(postPhrase,typeof(postPhrase));
            if (postPhrase.length != 0 | postPhrase != '--\r\n') {  //排除掉上面分割后的数组中的无用数据。

                //获得formdata中input的name及值。放在paramObj.name中
                let position = postPhrase.indexOf('name=');  //先定位到name，然后获取后面双引号中值
                if (position != -1) {
                    position += 6;  //调整到值的位置偏移，name="的长度是6
                    paramObj.name = '';
                    while ((code = postPhrase.charAt(position)) !== '"') { //逐个取出值的字母
                        paramObj.name += code;
                        position++;
                    }
                }

                //获得formdata中input的Content-Type值，放在paramObj.ContentType中
                position = postPhrase.indexOf('Content-Type:');  //先定位到Content-Type:，然后取后面的值
               if (position != -1) {
                    position += 14; //调整到值的位置偏移，Content-Type:及一个空格长度是14
                    paramObj.ContentType = '';
                    while ((code = postPhrase.charAt(position)) != '\r') {//逐个取出值的字母
                        paramObj.ContentType += code;
                        position++;
                    }

                    paramObj.filename = '';   //如果是文件，表单的数据中还有文件名，可以取出。
                    position = postPhrase.indexOf('filename')+10; //定位到filename，然后调整偏移到值的位置。filename="的长度是10
                    while ((code = postPhrase.charAt(position)) != '"') { //逐个取出值的字母
                        paramObj.filename += code;
                        position++;
                    }


                    //获取文件的数据，文件是以二进制形式拼在request中的
                    let p1 = post.indexOf(paramObj.content_type); //定位到content type的值，再往后检索
                    p1 = post.indexOf('\r\n\r\n',p1) + 4;  //再跳过后面的4个回车换行符，这个位置作为文件数据的开始位置
                    let p2 = post.indexOf(boundary,p1)-2;  //分割的出的单条数据是以\r\n结束的，也需要去掉。
                    paramObj.file = post.slice(p1, p2); //从单条数据中取出文件的数据，存到paramObj.file
                    console.log('paramObj.file.length',p2-p1);
                }

                //如果要获取其他类型的信息，先把request的post数据打印出来，然后分析获取。
                params.push(paramObj);
            }
        }
        console.log(params);
        return params;
},
    postBodyParse1 :  function (request,postdata){

        //功能同上，不过传入postdata是字符串。处理方式基本同上。

        let index = request['headers']['content-type'].indexOf('boundary=');
        let boundary = '--'+request['headers']['content-type'].substring(index+9);
        let postArray = postdata.split(boundary);

        let params = [];
        let l = postArray.length;
        let code;
        let postPhrase = '';
        for (let i = 1; i < l; i++) {
            console.log(i);
            let paramObj = {};
            postPhrase = postArray[i];

            if (postPhrase.length != 0) {
                let position = postPhrase.indexOf('name=');
                if (position != -1) {
                    position += 6;
                    paramObj.name = '';
                    while ((code = postPhrase.charAt(position)) !== '"') {
                        paramObj.name += code;
                        position++;
                    }
                }
                position = postPhrase.indexOf('Content-Type:');
                if (position != -1) {
                    position += 13;
                    paramObj.ContentType = '';
                    while ((code = postPhrase.charAt(position)) != '\r') {
                        paramObj.ContentType += code;
                        position++;
                    }

                    paramObj.filename = '';
                    position = postPhrase.indexOf('filename')+10;
                    while ((code = postPhrase.charAt(position)) != '"') {
                        paramObj.filename += code;
                        position++;
                    }


                    position = postPhrase.indexOf(paramObj.ContentType);
                    position = postPhrase.indexOf('\r\n\r\n',position) + 4;
                    paramObj.file = postPhrase.slice(position, postPhrase.length-2);
                    console.log('paramObj.file length :', paramObj.file.length);
                }

                params.push(paramObj);
            }
        }

        return params;  //返回一个对象数组
    }
}