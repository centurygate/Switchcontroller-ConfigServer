var express = require('express');
var fs = require('fs');
var router = express.Router();
var configpath = "/home/free/config.json";
var ipportpath = "/home/free/host.json";
var process = require('child_process');
var pos = 0;
// var find = false;
/* GET users listing. */
router.post('/', function(req, res, next) {
    try{
    var configobj = JSON.parse(fs.readFileSync(configpath));
    var ipportobj = JSON.parse(fs.readFileSync(ipportpath));
    var result = {};
    result.status = 'ok';
    configobj['accessories'] = configobj['accessories']||[];
    var len = configobj['accessories'].length;
    var groupId = req.body.groupId;
    var channelId = req.body.channelId;
    
    console.log('________________________________________________________');
    console.log("Read config.json   "+JSON.stringify(configobj));
    console.log('Read host.json : ' + JSON.stringify(ipportobj));
    console.log('________________________________________________________');
    console.log(JSON.stringify(req.body));
    console.log('________________________________________________________');
      
    console.log("groupId :" + groupId + ", channelId : "+channelId);
    if ((groupId >= 0) && (groupId < 15) && (channelId >= 0)  && (channelId < 255))
    {

        for (var i = 0; i < len; i++) 
        {
            if(configobj['accessories'][i].groupId == groupId && configobj['accessories'][i].channelId == channelId)
            {
                // result.status =  'ok';
                // console.log("The System will delete the accessory : \n" + configobj['accessories'][i]);
                //delete configobj['accessories'][i];
                // console.log("Will Write Contents as below to config.json .....................................");
                // console.log(JSON.stringify(configobj,null,4));
                // fs.writeFileSync(configpath,JSON.stringify(configobj,null,4));
                // res.end(JSON.stringify(result));
                // return;
                pos = i;
                // find = true;
                break;
            }
        }
        if(i == len)
        {
            console.log("accessory is not exist............");
            result.status = 'errnotexist';
            res.end(JSON.stringify(result));
            return;
        }
        //delete the element at pos, Please do not use delete configobj['accessories'][i];  or the length of configobj['accessories'] will not change and the element at pos changes to be null
        for(var j = pos; j < (len-1);j++)
        {
            configobj['accessories'][j]=configobj['accessories'][j+1];
        }
        configobj['accessories'].length = len-1;
        result.status =  'ok';
        console.log("Will Write Contents as below to config.json .....................................");
        console.log(JSON.stringify(configobj,null,4));
        fs.writeFileSync(configpath,JSON.stringify(configobj,null,4));
        res.end(JSON.stringify(result));
        return;

    }
    else
    {
        result.status = 'errinvalid';
        res.end(JSON.stringify(result));
    }
    }
    catch(err)
    {
        console.log("->->->->->->->->->->->->->->->->->->->->"+err);
    }
   
});

//添加这个代码是为了解决 向 /save  url post 过后经过 save.js 的router.post('/',function(req,res,next){... res.redirect('/'); })处理过后 浏览器地址栏并没有显示为
// http://localhost:3000 的样子,而是显示为了http://localhost:3000/save 的样子,因此 如果服务器重启后浏览器重新刷新则默认是 get http://localhost:3000/save, 而如果没有
//如下的get处理 会导致浏览器找不到对应的资源,因此这里重新将http://localhost:3000/save 重定向到http://localhost:3000
router.get('/', function(req, res, next) {
    res.redirect('/');
});


module.exports = router;