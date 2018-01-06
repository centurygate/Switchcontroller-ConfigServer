var express = require('express');
var fs = require('fs');
var router = express.Router();
var ipportpath = "/home/free/host.json";
var process = require('child_process');
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
function isValidPort(str)  
{  
    var pattern=/^(\d)+$/g;  
    if(pattern.test(str)&&parseInt(str)<=65535&&parseInt(str)>=0){  
        return true;  
     }else{  
        return false;  
     }   
}
router.post('/', function(req, res, next) {
    var result = {};
    result.status = 'ok';
    var ipportobj = JSON.parse(fs.readFileSync(ipportpath));
    console.log('Read req.body : ' + JSON.stringify(req.body));
    console.log('Read host.json : ' + JSON.stringify(ipportobj));
    try
    {
        if(isValidIP(req.body.host) && isValidPort(req.body.port))
        {
            console.log('______________________________________________________________________');
            ipportobj['host']=req.body.host;
            ipportobj['port']=req.body.port;
            result.status =  'ok';
            console.log("Writing ipportobj : " + JSON.stringify(ipportobj,null,4));
            fs.writeFileSync(ipportpath,JSON.stringify(ipportobj,null,4));
            res.end(JSON.stringify(result));        
        }
        else
        {
            console.log("errinfo == " + errinvalid);
            result.status = 'errinvalid';
            res.end(JSON.stringify(result));
        }
    }
    catch(err)
    {
        console.log("err"+err);
    }
});

//添加这个代码是为了解决 向 /save  url post 过后经过 save.js 的router.post('/',function(req,res,next){... res.redirect('/'); })处理过后 浏览器地址栏并没有显示为
// http://localhost:3000 的样子,而是显示为了http://localhost:3000/save 的样子,因此 如果服务器重启后浏览器重新刷新则默认是 get http://localhost:3000/save, 而如果没有
//如下的get处理 会导致浏览器找不到对应的资源,因此这里重新将http://localhost:3000/save 重定向到http://localhost:3000
router.get('/', function(req, res, next) {
    res.redirect('/');
});


module.exports = router;