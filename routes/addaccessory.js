var express = require('express');
var fs = require('fs');
var router = express.Router();
// var configpath = "/home/free/config.json";
var configpath = "/root/.homebridge/config.json";
var addhostport = require('./addhostport');
// var ipportpath = "/home/free/host.json";
// var process = require('child_process');
/* GET users listing. */
router.post('/', function(req, res, next) {
    try{
    var configobj = JSON.parse(fs.readFileSync(configpath));
    // var ipportobj = JSON.parse(fs.readFileSync(ipportpath));
    var ipportobj = addhostport.ipportobj;
    var result = {};
    result.status = 'ok';
    configobj['accessories'] = configobj['accessories']||[];
    var len = configobj['accessories'].length;
    var groupId = parseInt(req.body.groupId,10);
    var channelId = parseInt(req.body.channelId,10);
    var channeltype = req.body.channeltype;
    console.log('________________________________________________________');
    console.log("Read config.json   "+JSON.stringify(configobj));
    console.log('Read host.json : ' + JSON.stringify(ipportobj));
    console.log('________________________________________________________');
    console.log(JSON.stringify(req.body));
    console.log('________________________________________________________');
      
    console.log("groupId :" + groupId + ", channelId : "+channelId +" , channeltype :"+channeltype);
    if ((!isNaN(groupId))&&(!isNaN(channelId))&&(groupId >= 0) && (groupId <= 15) && (channelId >= 0)  && (channelId <= 255) &&((channeltype === 'switch')||(channeltype === 'bulb')||(channeltype === 'inputcontrol')))
    {

        //check the repeatability of the accessory , but only the groupId and channelId will be checked
        for(var k =0; k < configobj['accessories'].length; k++)
        {
            if (configobj['accessories'][k]['groupId'] === groupId && configobj['accessories'][k]['channelId'] === channelId)
            {
                result.status = 'errexist';
                res.end(JSON.stringify(result));
                return;
            }
        }
        var accessory =
        {
                "accessory": "gp"+groupId+"-chan"+channelId+"-"+channeltype,
                "name": "gp"+groupId+"-chan"+channelId+"-"+channeltype,
                "port": ipportobj['port'],
                "host": ipportobj['host'],
                "groupId": groupId,
                "channelId": channelId,
                "channeltype":channeltype
        };
        result.status =  'ok';
        console.log("Assemblied the accessory info is \n"+JSON.stringify(accessory,null,4));
        configobj['accessories'][len]=accessory;
        console.log("Will Write Contents as below to config.json .....................................");
        console.log(JSON.stringify(configobj,null,4));
        fs.writeFileSync(configpath,JSON.stringify(configobj,null,4));
        res.end(JSON.stringify(result));
        // process.exec('reboot -f',function(err, stdout, stderr){
        //     console.log(stdout);
        //   });
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
