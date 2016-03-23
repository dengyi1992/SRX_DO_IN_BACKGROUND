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

    var selectString="SELECT * FROM yidian ORDER BY id desc limit 20";
    conn.query(selectString,function(err,rows,fields){
       if (err){
           res.json(config.err_database);

       }else {
           var data = [];
           for (var i = 0; i < rows.length; i++) {
               data.push({
                   data: JSON.parse(rows[i].jsonString)

               });
           }
           res.json({msg:'success',content:'成功',data:data});
       }
    });




};

