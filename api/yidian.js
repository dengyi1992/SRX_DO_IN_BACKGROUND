var express = require('express');
var router = express.Router();
var http = require("http");
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var config = require('../config.js');
var CheckUtils = require('../utils/CheckUtils.js');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();

exports.yidian=function(req,res,next){
    if (req.query.page==undefined){
        return res.json({msg:'err',message:'参数异常'});
    }
    var page=req.query.page;
    var limit_range=(page-1)*20+','+page*20;
    var selectString="SELECT * FROM yidian ORDER BY id desc limit "+limit_range+"";
    conn.query(selectString,function(err,rows,fields){
       if (err){
           res.json(config.err_database);

       }else {
           var data = [];
           for (var i = 0; i < rows.length; i++) {
               data.push({
                   jsonString: JSON.parse(rows[i].jsonString)

               });
           }
           if (data.length==0){
               return res.json({msg:'nodata',message:'没有更多的数据了'});
           }
           res.json({msg:'success',content:'成功',data:data});
       }
    });




};

