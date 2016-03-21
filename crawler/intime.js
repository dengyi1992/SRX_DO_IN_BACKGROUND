var express = require('express');
var router = express.Router();
var http = require("http");
var EventEmitter = require('events').EventEmitter;//事件模块
var myEvents = new EventEmitter();
var options = {
    hostname: 'apis.baidu.com',
    path: '/songshuxiansheng/news/news' ,
    method: 'GET',
    headers:{'apikey':'85f58fd70159426be3e4367cd5afa2cc'}

};
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
/* GET home page. */
exports.intime=function(req, res, next) {
    res.json( { 'msg': 'success','status code': 200,'message':'服务器已收到请求'});

// get is a simple wrapper for request()
// which sets the http method to GET
    var request = http.get(options, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event
        var buffer = "",
            data,
            newslist;

        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            //console.log(buffer);
            console.log("\n");
            data = JSON.parse(buffer);
            //console.log(data);

            //console.log(newslist[0]);
            for (var i=0;i<data.retData.length;i++){
                newslist = data.retData[i];
                var  userAddSql_Params = [newslist.title,newslist.url,newslist.image_url,newslist.abstract];
                var  userAddSql = 'INSERT INTO intime(title,url,image_url,abstract) VALUES(?,?,?,?)';

                conn.query(userAddSql,userAddSql_Params,function(err,result){
                    if (err){
                        console.error(err);
                        return;
                    }
                });


            }
            //myEvents.emit('completed');




        });

    });
};

