var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var Iconv = require('iconv').Iconv;//用于乱码解决
var iconv = new Iconv('GBK', 'UTF-8');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'dengyi',
    database:'srx',
    port:3306
});
conn.connect();

var items = [];
var options = {
    method: 'GET',
    encoding: null,
    url: 'http://neihanshequ.com/pic/'
}
var Iconv = require('iconv').Iconv;//用于乱码解决
var iconv = new Iconv('GBK', 'UTF-8');
/* GET users listing. */
exports.neihan=function (req, res, next) {
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
              //返回请求页面的HTML
            //var result = iconv.convert(new Buffer(body, 'binary')).toString();
            //console.log(response);
            acquireData(body);
        }
    });

    function acquireData(data) {
        var $ = cheerio.load(data);  //cheerio解析data
        var link = $('.img-wrapper').toArray();  //将所有的img放到一个数组中

        var len = link.length;
        for (var i = 0; i < len; i++) {

            var smallpic=link[i].children["1"].attribs.onerror;
            items.push({
                title: link[i].children["1"].attribs.alt,
                imgbig: link[i].children["1"].attribs["data-src"],
                imgsmall:smallpic.substring(smallpic.indexOf('http'),smallpic.length-2)
            });
        }
        res.send(items);
        myEvents.emit('geted');
    };

};
myEvents.on('geted',function(){
   //寫入數據庫
    for (var i=0;i<items.length;i++){
        var  userAddSql_Params = [items[i].title,items[i].imgbig,items[i].imgsmall];
        var  userAddSql = 'INSERT INTO neihan(title,imgbig,imgsmall) VALUES(?,?,?)';

        conn.query(userAddSql,userAddSql_Params,function(err,result){
            if (err){
                return;
            }
        });


    }
    items=[];

});

