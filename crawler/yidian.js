var express = require('express');
var router = express.Router();
var http = require("http");
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
var jsonobject;
var timestamp = (new Date()).valueOf();
var path = 'http://www.yidianzixun.com/api/q/?cstart=0&cend=100&fields=title&fields=image&fields=source&fields=date&fields=comment_count&fields=like&fields=is_like&fields=image_urls&fields=url&infinite=true&path=channel|news-list-for-channel&channel_id=c3';

conn.connect();
/* GET home page. */
exports.yidian = function (req, res, next) {

    var items = [];
    request(path + "&t=" + timestamp, function (error, response, body) {


        if (!error && response.statusCode == 200) {
            //response.on("end",function(){
            //    //console.log(body) // 打印google首页
            jsonobject = JSON.parse(body);
            var it = jsonobject.result;
            for (i = 0; i < it.length; i++) {
                items.push({
                    title: it[i].title,
                    url: it[i].url,
                    jsonString: JSON.stringify(it[i])
                });
            }

            //});

        }
        res.json({'msg': 'success', 'status code': 200, 'result': items});
        myEvents.emit("geted", items);

    })
};
myEvents.on('geted', function (items) {
    items.forEach(function (item) {
        var insertSql = "INSERT INTO yidian (title,url,jsonString) VALUES (?,?,?)";
        var isertParams = [item.title, item.url, item.jsonString];
        conn.query(insertSql, isertParams, function (err, rows, fields) {
            if (err)return;
        });


    })
});

