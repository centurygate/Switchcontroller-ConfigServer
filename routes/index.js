var express = require('express');
var router = express.Router();
var fs = require('fs');
var configpath = "/home/free/config.json"
var ipportpath = "/home/free/host.json";
/* GET home page. */
router.get('/', function(req, res, next) {
  var configobj = JSON.parse(fs.readFileSync(configpath));
  var ipportobj = JSON.parse(fs.readFileSync(ipportpath))
  console.log("ipportobj json: "+JSON.stringify(ipportobj,null,4));
  //console.log("config json: "+JSON.stringify(configobj,null,4));
  configobj['platforms'] = configobj['platforms']||[];
  res.render('index', { title: '............',configobj: configobj,ipportobj:ipportobj });
});

module.exports = router;