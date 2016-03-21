var querystring = require('querystring');
var util = require('util');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var config = require('../config.js');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'information_schema',
    port: 3306
});
conn.connect();

exports.upload = function (req, res, next) {
    /* 上传页面 */
    res.sendFile(APP_PATH+"/public/upload.html");


};

exports.uploadfile = function (req, res, next) {
    console.log(req.body, req.files);
    var des_file = APP_PATH + "/public/" + req.files.userPhoto.originalFilename
    fs.readFile( req.files.userPhoto.path+"", function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            var response;
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename: config.address+req.files.userPhoto.originalFilename
                };
            }
            console.log( response );
            res.end( JSON.stringify( response ) );
        });
    });

};