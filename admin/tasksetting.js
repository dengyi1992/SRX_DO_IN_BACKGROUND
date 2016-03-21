var express = require('express');
var querystring = require('querystring');
var util = require('util');
var bodyParser = require('body-parser');
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

exports.tasksetting= function(req, res, next) {
    if (req.body.interfaceurl==undefined||req.body.interfacetag==undefined||req.body.cycle==undefined||req.body.type==undefined){
        res.json({msg:'params err',content:'参数异常'});
        return;
    }
    var  TaskSelect = 'SELECT * FROM tasksetting WHERE interfaceurl =?';
    var  selectParams =[req.body.interfaceurl];
    conn.query(TaskSelect,selectParams,function(err, rows, fields){
        if (err)    {
            res.json({msg:'err',content:'数据库错误'});

        };
        if (rows.length>=1){
            //更新处理
            var updateTask = 'UPDATE tasksetting SET interfacetag=?,cycle=?,type=? WHERE interfaceurl=?';
            var updateParams = [req.body.interfacetag,req.body.cycle,req.body.type,req.body.interfaceurl];
            conn.query(updateTask,updateParams,function(err,rows,fields){
                if (err){
                    res.json({msg:'err',content:'更新失败'});
                }
                res.json({msg:'success',content:'更新成功'});
            });


        }else {
            //插入处理
            var insertNewTask = 'insert tasksetting (interfaceurl, interfacetag, cycle, type) VALUES (?,?,?,?)';
            var insertTaskParams =[req.body.interfaceurl,req.body.interfacetag,req.body.cycle,req.body.type];
            conn.query(insertNewTask,insertTaskParams,function(err,rows,fields){
               if (err){
                   res.json({msg:'err',content:'新增失败'});
               }else {
                   res.json({msg:'success',content:'新增成功'});
                   //可以用socket.io返回
               }

            });

        }

    });

};

