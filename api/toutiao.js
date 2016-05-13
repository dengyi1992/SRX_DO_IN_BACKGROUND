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
/* GET home page. */
exports.toutiaoapi=function (req, res, next) {

     var tablename='';
    if (req.query.tablename==undefined){
        return res.json({msg:'err',message:'参数异常，表名'});
    }
    tablename=req.query.tablename;
    if (req.query.page==undefined){
        return res.json({msg:'err',message:'参数异常，页数'});
    }
    var page=req.query.page;
    var limit_range=(page-1)*20+','+page*20;
    var userAddSql = 'SELECT * FROM toutiao_'+tablename+' ORDER BY id desc limit '+limit_range+';';

    conn.query(userAddSql, function (err, rows, fields) {
        if (err) {
            return res.json({msg:'err',message:err});
        }
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

        return res.jsonp(result);
    });


};
exports.toutiaov2=function(req,res,next){
    if (CheckUtils.ifUndefined(req.query.type)){
        res.json(config.err_params);
        return;
    }
    var tablename="toutiao_"+req.query.type;
    var page=req.query.page;
    var limit_range=(page-1)*20+','+page*20;
    var selectString="SELECT * FROM "+tablename+" ORDER BY id desc limit " + limit_range+"";
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
           res.json({msg:'success',content:'成功',data:data});
       }
    });




};

