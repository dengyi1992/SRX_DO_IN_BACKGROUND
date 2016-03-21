var express = require('express');
var http = require("http");
var options = {
    hostname: 'apis.baidu.com',
    path: '/txapi/weixin/wxhot?num=50&rand=0&page=1' ,
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
exports.weixin=function(req, res, next) {
    res.json( { 'msg': 'success','status code': 200,'message':'服务器已收到请求'});

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
            for (var i=0;i<data.newslist.length;i++){
                newslist = data.newslist[i];
                var  userAddSql_Params = [newslist.hottime,newslist.title,newslist.description,newslist.picUrl,newslist.url];
                var  userAddSql = 'INSERT INTO weixinjingxuan(hottime,title,description,picUrl,url) VALUES(?,?,?,?,?)';

                conn.query(userAddSql,userAddSql_Params,function(err,result){
                    if (err){
                        console.error(err);
                        return;
                    }
                });


            }
            //conn.end();



        });

    });
};


