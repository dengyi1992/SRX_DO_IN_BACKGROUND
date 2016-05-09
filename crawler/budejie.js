var express = require('express');
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
    url: 'http://www.budejie.com/'
};
var Iconv = require('iconv').Iconv;//用于乱码解决
var iconv = new Iconv('GBK', 'UTF-8');
/* GET users listing. */
exports.budejie=function (req, res, next) {
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
        var link = $('.j-r-list-c').toArray();  //将所有的img放到一个数组中

        var len = link.length;
        for (var i = 0; i < len; i++) {
            if (link[i].children.length == 9) {
                //图片
                items.push({
                    title: link[i].children["7"].children["1"].attribs.alt,
                    type: 0,
                    imgbig: link[i].children["7"].children["1"].attribs["data-original"],
                    imgsmall: link[i].children["7"].children["1"].attribs.src
                });
            } else if (link[i].children.length == 11) {
                //视频
                items.push({
                    title: link[i].children["9"].attribs["data-title"],
                    videourl: link[i].children["9"].children["1"].attribs["data-mp4"],
                    imgsmall: link[i].children["9"].children["1"].attribs["data-poster"],
                    type: 1
                });
            }

            //var smallpic=link[i].children["1"].attribs.onerror;

        }
        res.send(items);
        myEvents.emit('geted', items);
    };
    items = [];
};
myEvents.on('geted',function(items){
   //寫入數據庫
    for (var i=0;i<items.length;i++){
        if(items[i].type==0){
            //图片
            var  userAddSql_Params = [items[i].title,items[i].imgbig,items[i].imgsmall,items[i].type];
            var  userAddSql = 'INSERT INTO budejie(title,imgbig,imgsmall,type) VALUES(?,?,?,?)';
        }else {
            var  userAddSql_Params = [items[i].title,items[i].videourl,items[i].imgsmall,items[i].type];
            var  userAddSql = 'INSERT INTO budejie(title,videourl,imgsmall,type) VALUES(?,?,?,?)';
        }


        conn.query(userAddSql,userAddSql_Params,function(err,result){
            if (err){
                return;
            }
        });


    }

});

