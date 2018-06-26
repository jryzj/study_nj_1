/*
function a (str, symbol, nth){
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
}
*/


// const mongo = require('mongoose');

// const ejs = require('ejs');

console.log('hhh');

var l = 0;
var i=1;

setTimeout(()=>{
        l = 1;
        console.log('===================================================');
 },200);
while (l == 0){
    i++;
    if(i>1000) break;
    console.log('i :',i,"====",l);
}
i=0;
while (l == 0){
    i++;
    if(i>1000000) break;
    console.log('2   i :',i,"====",l);
}
console.log(i,"lll");