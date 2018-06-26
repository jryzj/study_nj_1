'use strict'
console.log('hello world');

console.log('===================');

var plus = require('./lib');
var n=1;
n = plus.oneplus(n);
console.log('one plus is: ', n);
process.nextTick(function(){
    console.log('this is running from next TICK! ')
})
n = plus.twoplus(n);
console.log('two plus is: ', n);

console.log('===================');

if (typeof(window) === 'undefined') {
    console.log('node.js');
} else {
    console.log('browser');
}

console.log('===================');

var write = require('fs');
var words = 'hello Node js!';
write.writeFile('reader.txt',words,function(err) {
    if(err)
    {
        console.log(err);
    }
    else
        console.log('ok.');});

var reader = require('fs');
/*
fs.readFile('lib.js','utf-8',function(err,data){
if(err){
    console.log(err);
}
else {
    console.log(data);
}});
*/

reader.readFile('reader.txt',function(err,data){
    if(err){
        console.log(err);
    }
    else {
        console.log(data.toString());
    }});

console.log('===================');

reader.stat('reader.txt',function (err,stat) {
    if(err) {
        console.log('err');
    }
    else
    {
        console.log('isFile:'+stat.isFile());
        console.log('isDirectory:'+stat.isDirectory());
        if(stat.isFile()){
            console.log('size: ' + stat.size);
            console.log('birth time: '+stat.birthtime);
            console.log('modified time :' + stat.mtime);
        }

    }

})

console.log('===================');

var stream = require('fs');

var rs = stream.createReadStream('17.txt', 'utf-8');

rs.on('data',function(chunk){
    console.log('data:');
    console.log(chunk);
});
rs.on('end',function(){
    console.log('end');
});
rs.on('error',function(err) {
    console.log('error is ' + err);
});

var cs = stream.createWriteStream('copy17.txt', 'utf-8');
rs.pipe(cs);


console.log('===================');
var ws=stream.createWriteStream('streamwrite.txt','utf-8');
ws.write('var Sparkle,isNullOrEmpty,concat,join,SparkleFramework;!function(n){if(\"object\"==typeof');
ws.write('hahahahah');
ws.end();

var wsbin = stream.createWriteStream('streamwritebin.txt');
wsbin.write(new Buffer('var Sparkle,isNullOrEmpty,concat,join,SparkleFramework;!function(n){if(\"object\"==typeof','utf-8'));
wsbin.end();


console.log('===================');
var url = require('url');
console.log(url.parse('https://developers.weixin.qq.com/ebook?action=get_post_info&token=935589521&volumn=1&lang=zh_CN&book=miniprogram&docid=0000286f908988db00866b85f5640a'));


