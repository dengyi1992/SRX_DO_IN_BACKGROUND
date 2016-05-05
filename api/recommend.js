var express = require('express');
var router = express.Router();
var http = require("http");
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();
/* GET home page. */
exports.recommendapi= function (req, res, next) {


    if (req.query.page==undefined){
        return res.json({msg:'err',message:'参数异常'});
    }
    var page=req.query.page;
    var limit_range=(page-1)*20+','+page*20;
    //var userAddSql_Params = [newslist.ctime, newslist.title, newslist.description, newslist.picUrl, newslist.url];
    var userAddSql = "SELECT * FROM toutiao ORDER BY id desc limit "+limit_range+";";

    conn.query(userAddSql, function (err, rows, fields) {
        if (err) throw err;
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push({
                title: rows[i].title,
                imgnums: rows[i].imgnums,
                url: rows[i].url,
                imgurl: rows[i].imgurl,
                imgurl1: rows[i].imgurl1,
                imgurl2: rows[i].imgurl2,
                imgurl3: rows[i].imgurl3

            });
        }

        var result = {
            msg: 'success',
            message: '成功',
            data: data
        };
        if (data.length==0){
            return res.json({msg:'nodata',message:'没有更多的数据了'});
        }

        return res.json(result);
    });


};

