var express = require('express');
var router = express.Router();
var http = require("http");
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var request = require('request');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
var jsonobject;
var timestamp = (new Date()).valueOf();
var path='http://www.yidianzixun.com/api/q/?cstart=0&cend=100&fields=title&fields=image&fields=source&fields=date&fields=comment_count&fields=like&fields=is_like&fields=image_urls&fields=url&infinite=true&path=channel|news-list-for-channel&channel_id=c3';
var items = [];
conn.connect();
/* GET home page. */
exports.yidian=function (req, res, next) {


    request(path+"&t="+timestamp, function (error, response, body) {


        if (!error && response.statusCode == 200) {
            //response.on("end",function(){
            //    //console.log(body) // 打印google首页
            jsonobject = JSON.parse(body);
            var it=jsonobject.result;
            for (i=0;i<it.length;i++){
                items.push({
                    comment_count:it[i].comment_count,
                    ctype:it[i].ctype,
                    date:it[i].date,
                    dtype:it[i].dtype,
                    image:it[i].image,
                    image_urls:it[i].image_urls,
                    source:it[i].source,
                    title:it[i].title,
                    url:it[i].url
                });
            }

            //});

        }
        res.json({'msg': 'success', 'status code': 200, 'result':items});
    })
};


