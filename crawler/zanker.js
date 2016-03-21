/**
 * 163新闻爬取
 * @type {*|exports|module.exports}
 */
var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var conn = mysql.createConnection({
    host: '120.27.41.245',
    user: 'srx',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();


var options = {
    method: 'GET',
    encoding: null,
    url: 'http://app.myzaker.com/'
};
var pagenums = 1;

/* GET users listing. */
exports.zanker=function (req, res, next) {
    var items = [];
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //返回请求页面的HTML
            //var result = iconv.convert(new Buffer(body, 'binary')).toString();
            acquireData(body);
        }
    });

    function acquireData(data) {
        var $ = cheerio.load(data);  //cheerio解析data
        var imgurl = $('.tb div a .pic-cover').toArray();  //将所有的img放到一个数组中
        var len =imgurl.length;
        for (var i = 0; i < len; i++) {
            var img=imgurl[i].attribs.style;
            if (img.substring(img.indexOf('http'),img.length-2)=='border:non')
            {
                items.push({
                    url:imgurl[i].parent.parent.attribs.href,
                    imgnums:0,
                    title:imgurl[i].prev.prev.children["1"].children["1"].children["0"].data
                })
            }else {
                items.push({
                    url:imgurl[i].parent.parent.attribs.href,
                    imgnums:1,
                    imgurl:img.substring(img.indexOf('http'),img.length-2),
                    title:imgurl[i].prev.prev.children["1"].children["1"].children["0"].data
                })
            }

        }
        res.send(items);
        myEvents.emit('geted',items);
    }





};
myEvents.on('geted', function (items) {
    //寫入數據庫
    for (var i = 0; i < items.length; i++) {
        var userAddSql_Params = '';
        var userAddSql = '';
        if (items[i].imgnums == 0) {
            userAddSql_Params = [items[i].title, items[i].url, items[i].imgnums];
            userAddSql = 'INSERT INTO toutiao_movie(title,url,imgnums) VALUES(?,?,0)';
        } else {
            userAddSql_Params = [items[i].title, items[i].url, items[i].imgurl];
            userAddSql = 'INSERT INTO toutiao_movie(title,url,imgnums,imgurl) VALUES(?,?,1,?)';

        }


        conn.query(userAddSql, userAddSql_Params, function (err, result) {
            if (err) {
                return;
            }
        });


    }
});

