var querystring = require('querystring');
var util = require('util');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var config = require('../config.js');

var login_admin = require('../admin/login_admin')

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();
/* post users listing. */

exports.deleteDataBase = function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var tablename = req.body.tablename;
    var ifexist=login_admin.select_user(name, password)
    if (true) {
        /**
         * 验证通过
         */
        DELETE_SQL = "DELETE FROM " + tablename+" where 1" ;
        conn.query(DELETE_SQL, function (err, result) {
            if (err) {
                console.log(err);
                res.json(config.err_database);
            } else {
                console.log(result);
                res.json(result)
            }

        });

    } else {
        res.json(config.err_userinfo);
    }


};

