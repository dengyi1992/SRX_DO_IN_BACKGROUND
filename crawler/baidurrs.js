/**
 *百度RSS爬取
 *@type {*|exports|module.exports}
 */
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var mysql = require('mysql');
var Iconv = require('iconv').Iconv;//用于乱码解决
var iconv = new Iconv('GBK', 'UTF-8');
var http = require('http');
var fs = require('fs');
var CheckUtils = require('../utils/CheckUtils.js');
var config = require('../config.js');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();


var typesname = "&class=";
var typeslast = "civilnews";

/GET users listing. */
exports.baidu = function (req, res, next) {
    if (CheckUtils.ifUndefined(req.query.type)) {
        res.json({msg: "err_params", content: "参数错误"});
        return;
    }
    typeslast = req.query.type;

    var options = {
        url: config.baidu_rss + typesname + typeslast,
        method: 'GET',
        encoding: null

    };
    var items = [];
    request(options, function (error, response, body) {
        console.log(options.url);
        if (!error && response.statusCode == 200) {
            //返回请求页面的HTML
            var result = iconv.convert(new Buffer(body, 'binary')).toString();
            //console.log(result);

            acquireData(result);
        }
    });

    function acquireData(data) {
        var $=cheerio.load(data);
        var link = $('item').toArray();  //将所有的新闻放到一个数组中
        for(i=0;i<link.length;i++){
            var item = link[i];
            items.push({
                title:link[i].children["1"].children["0"].data,
                link:link[i].children["4"].data,
                description:link[i].children["6"].children["0"].data,
                pubDate:link[i].children["8"].children["0"].data,
                source:link[i].children["11"].data,
                author:link[i].children["13"].children["0"].data
            })

        }





        res.send(items);
        myEvents.emit('geted', items);
    };

};
myEvents.on('geted', function (items) {
    var tableCreate = "CREATE TABLE IF NOT EXISTS baidu_" + typeslast + " LIKE baidu_model"

    conn.query(tableCreate, function (err, result) {
        console.log(err);
    });
    //寫入數據庫
    for (var i = 0; i < items.length; i++) {

        var itemAddSql_Params = '';
        var itemAddSql = '';
        itemAddSql_Params = [items[i].title, items[i].link, items[i].description, items[i].pubDate,items[i].author];
        itemAddSql = 'INSERT INTO baidu_' + typeslast + '(title,link,description,pubDate,author) VALUES(?,?,?,?,?)';


        conn.query(itemAddSql, itemAddSql_Params, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });


    }

});

