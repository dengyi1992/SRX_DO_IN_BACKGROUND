/**
 * 任意头条号爬取
 * @type {*|exports|module.exports}
 */
var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
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


var options = {
    method: 'GET',
    encoding: null,
    url:'http://m.toutiao.com/list/?tag=__all__&ac=wap&item_type=4&count=40&format=json&list_data_v2=1'
};


/* GET users listing. */
exports.toutiao = function (req, res, next) {
    var items = [];
    var timestamp = (new Date()).valueOf();
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //返回请求页面的HTML
            //var result = iconv.convert(new Buffer(body, 'binary')).toString();
            //console.log(result);

            acquireData(JSON.parse(body).html.toString());
        }
    });

    function acquireData(data) {
        var $ = cheerio.load(data);  //cheerio解析data
        var link = $('section').toArray();
        link.forEach(function(item){
            if(item.attribs.class=="middle_mode has_action")
            {
                /**
                 * middle_mode has_action
                 */

                items.push({
                    class:item.attribs.class,
                    "data-group-id":item.attribs["data-group-id"],
                    "data-is-video":item.attribs["data-is-video"],
                    "data-item-id":item.attribs["data-item-id"],
                    "hot-time":item.attribs["hot-time"],
                    "title":""
                });
            }

        });
        res.send(items);
    };

};
myEvents.on('geted', function (items) {
    //寫入數據庫
    for (var i = 0; i < items.length; i++) {
        var userAddSql_Params = '';
        var userAddSql = ''
        if (items[i].imgnums == 1) {
            userAddSql_Params = [items[i].title, items[i].link, items[i].imgurl];
            userAddSql = 'INSERT INTO toutiao' + tablename + ' (title,url,imgnums,imgurl) VALUES(?,?,1,?)';
        } else {
            userAddSql_Params = [items[i].title, items[i].link, items[i].imgurl1, items[i].imgurl2, items[i].imgurl3];
            userAddSql = 'INSERT INTO toutiao' + tablename + ' (title,url,imgnums,imgurl1,imgurl2,imgurl3) VALUES(?,?,3,?,?,?)';

        }


        conn.query(userAddSql, userAddSql_Params, function (err, result) {
            if (err) {
                return;
            }
        });


    }

});

