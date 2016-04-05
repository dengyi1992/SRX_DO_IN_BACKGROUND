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
/* post users listing. */

exports.tasksetting_info=function(req, res, next) {
  var  selectTableInfo = 'SELECT * FROM tasksetting';
  conn.query(selectTableInfo,function(err, rows, fields){
    if (err) {
      res.json({msg:'err',content:'数据库错误'});

    }else {
      //console.log(rows);
      res.json({msg:'success',content:rows});
    }

  });

};

