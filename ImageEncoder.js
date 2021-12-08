// JS Byte array to image source encoder
// Made by Kenneth Gibson
// @2021 version 1.2
var b64a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=e=>{let t="";for(;~~(e/2);)t=e%2+t,e=~~(e/2);return 1+t},b=e=>{let t="";if(e.length<8)for(let r=0;r<8-e.length;r++)t+="0";return t+=e},c=e=>{let t="";for(let r=0;r<e.length;r++)t+=b(a(e[r].charCodeAt()));return t},d=e=>{let t=0;for(let r=0;r<e.length;r++)t+=Math.pow(2,e.length-r-1)*+e[r];return t},base64=e=>{let t=0,r="",n=c(e),a="";for(;n.length%6;)n+="00000000",t++;for(let e=0;e<n.length/6;e++)a+=b64a[d(n.slice(6*e,6*(e+1)))];for(let e=0;e<a.length-t;e++)r+=a[e];for(let e=0;e<t;e++)r+="=";return r};

function ByteArrayToJpeg(e){return"data:image/jpeg;base64,"+btoa(e)}function ByteArrayToPng(e){return"data:image/png;base64,"+btoa(e)}
