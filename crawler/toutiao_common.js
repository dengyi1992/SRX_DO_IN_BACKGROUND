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
    url: 'http://toutiao.com/m4166980049/ '
};
var pagenums = 1;
var tablename ='';

/* GET users listing. */
exports.toutiao_common= function (req, res, next) {
    var items = [];

    options.url = 'http://toutiao.com/' + req.query.toutiaonum+'/p'+req.query.pagenum+'/';
    tablename=req.query.tablename;
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //返回请求页面的HTML
                //var result = iconv.convert(new Buffer(body, 'binary')).toString();
                //console.log(result);
                acquireData(body);
            }
        });

        function acquireData(data) {
            var $ = cheerio.load(data);  //cheerio解析data
            var link = $('.pin .pin-content td h3 a').toArray();  //将所有的img放到一个数组中
            var imglink = $('.pin .pin-content .text').toArray();  //将所有的img放到一个数组中console.log(link.length);
            var pagenum = $('.pagebar .pagebar_step').toArray();
            pagenums = pagenum[pagenum.length - 1].children["0"].data;
            var len = link.length;
            for (var i = 0; i < len; i++) {
                var href = link[i].attribs.href;
                var titl = link[i].children[0].data;
                if (imglink[i].parent.children[1].attribs.class == 'list_image') {
                    //表示是3张图片
                    items.push({
                        title: titl,
                        link: href,
                        imgnums: 3,
                        imgurl1: imglink[i].parent.children[1].children["1"].children["1"].children["0"].children["0"].attribs.src,
                        imgurl2: imglink[i].parent.children[1].children["1"].children["3"].children["0"].children["0"].attribs.src,
                        imgurl3: imglink[i].parent.children[1].children["1"].children["5"].children["0"].children["0"].attribs.src
                    });
                } else if (imglink[i].parent.children[1].attribs.class == 'img_bg shadow_img') {
                    //一张图片
                    items.push({
                        title: titl,
                        link: href,
                        imgnums: 1,
                        imgurl: imglink[i].parent.children[1].children[1].children[1].attribs.src
                    });

                }


            }
            myEvents.emit('geted',items);
            messageEvents.emit('taskfinish',{message:'success',iname:'头条',time:new Date()});
            res.send(items);
        };

};
myEvents.on('geted', function (items) {
    //寫入數據庫
    for (var i = 0; i < items.length; i++) {
        var userAddSql_Params='';
        var userAddSql=''
        if (items[i].imgnums==1){
            userAddSql_Params= [items[i].title, items[i].link,items[i].imgurl];
            userAddSql = 'INSERT INTO toutiao'+tablename+' (title,url,imgnums,imgurl) VALUES(?,?,1,?)';
        }else {
            userAddSql_Params= [items[i].title, items[i].link,items[i].imgurl1,items[i].imgurl2,items[i].imgurl3];
            userAddSql = 'INSERT INTO toutiao'+tablename+' (title,url,imgnums,imgurl1,imgurl2,imgurl3) VALUES(?,?,3,?,?,?)';

        }


        conn.query(userAddSql, userAddSql_Params, function (err, result) {
            if (err) {
                return;
            }
        });


    }

});

