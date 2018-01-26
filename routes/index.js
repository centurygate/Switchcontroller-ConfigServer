var express = require('express');
var router = express.Router();
var fs = require('fs');
var addhostport = require('./addhostport');
var configpath = "/home/free/config.json";

/* GET home page. */
router.get('/', function(req, res, next) {
  var ipportobj = {host:'',port:''};
  var configobj = JSON.parse(fs.readFileSync(configpath));
  console.log("configobj json: "+JSON.stringify(configobj,null,4));
  //console.log("config json: "+JSON.stringify(configobj,null,4));
  configobj['accessories'] = configobj['accessories']||[];
  if(configobj['accessories'].length > 0)
  {
      ipportobj.host = configobj['accessories'][0]['host'];
      ipportobj.port = configobj['accessories'][0]['port'];

    //为了防止不小心修改了配置文件中其他的host和port，因此从下标为1开始的元素都与下标为0的元素保持一致
    for(var i = 1; i< configobj['accessories'].length;i++)
    {
        configobj['accessories'][i]['host']=configobj['accessories'][0]['host'];
        configobj['accessories'][i]['port']=configobj['accessories'][0]['port'];;
    }
  }
  else
  {
      ipportobj = addhostport.ipportobj;
  }
  res.render('index', { title: '............',configobj: configobj,ipportobj:ipportobj });
});

module.exports = router;