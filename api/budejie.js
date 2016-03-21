var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var Iconv = require('iconv').Iconv;//用于乱码解决
var iconv = new Iconv('GBK', 'UTF-8');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
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

var items = [];

/* GET users listing. */
exports.budejieapi=function (req, res, next) {
    var userAddSql = 'SELECT * FROM budejie ORDER BY id desc limit 20;';
    conn.query(userAddSql, function (err, rows, fields) {
        if (err) throw err;
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push({
                ctime:rows[i].ctime,
                title: rows[i].title,
                imgbig: rows[i].imgbig,
                imgsmall: rows[i].imgsmall,
                type: rows[i].type,
                video: rows[i].videourl

            });
        }

        var result = {
            msg: 'success',
            message: '成功',
            data: data
        }

        return res.jsonp(result);
    });

};


