/**
 *任意头条号爬取
 *@type {*|exports|module.exports}
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
var CheckUtils = require('../utils/CheckUtils.js');
var config = require('../config.js');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
conn.connect();


var typesname = "&category=";
var typeslast = "news_entertainment";

/GET users listing. */
exports.toutiao = function (req, res, next) {
    if (CheckUtils.ifUndefined(req.query.type)){
        res.json({msg:"err_params",content:"参数错误"});
        return;
    }
    typeslast=req.query.type;
    var options = {
        url: config.toutiao_api_url + typesname + typeslast,
        method: 'GET',
        encoding: null

    };
    var items = [];
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //返回请求页面的HTML
            //var result = iconv.convert(new Buffer(body, 'binary')).toString();
            //console.log(result);

            acquireData(JSON.parse(body));
        }
    });

    function acquireData(data) {


        data.data.forEach(function (item) {

            items.push({
                abstract: CheckUtils.toutiaoUtil(item.abstract),
                image_list: CheckUtils.toutiaoUtil(item.image_list),
                datetime: CheckUtils.toutiaoUtil(item.datetime),
                article_type: CheckUtils.toutiaoUtil(item.article_type),
                more_mode: CheckUtils.toutiaoUtil(item.more_mode),
                tag: CheckUtils.toutiaoUtil(item.tag),
                is_favorite: CheckUtils.toutiaoUtil(item.is_favorite),
                has_m3u8_video: CheckUtils.toutiaoUtil(item.has_m3u8_video),
                keywords: CheckUtils.toutiaoUtil(item.keywords),
                has_mp4_video: CheckUtils.toutiaoUtil(item.has_mp4_video),
                favorite_count: CheckUtils.toutiaoUtil(item.favorite_count),
                display_url: CheckUtils.toutiaoUtil(item.display_url),
                article_sub_type: CheckUtils.toutiaoUtil(item.article_sub_type),
                bury_count: CheckUtils.toutiaoUtil(item.bury_count),
                title: CheckUtils.toutiaoUtil(item.title),
                has_video: CheckUtils.toutiaoUtil(item.has_video),
                share_url: CheckUtils.toutiaoUtil(item.share_url),
                id: CheckUtils.toutiaoUtil(item.id),
                source: CheckUtils.toutiaoUtil(item.source),
                comment_count: CheckUtils.toutiaoUtil(item.comment_count),
                article_url: CheckUtils.toutiaoUtil(item.article_url),
                create_time: CheckUtils.toutiaoUtil(item.create_time),
                recommend: CheckUtils.toutiaoUtil(item.recommend),
                middle_mode: CheckUtils.toutiaoUtil(item.middle_mode),
                aggr_type: CheckUtils.toutiaoUtil(item.aggr_type),
                item_source_url: CheckUtils.toutiaoUtil(item.item_source_url),
                display_time: CheckUtils.toutiaoUtil(item.display_time),
                publish_time: CheckUtils.toutiaoUtil(item.publish_time),
                go_detail_count: CheckUtils.toutiaoUtil(item.go_detail_count),
                display_title: CheckUtils.toutiaoUtil(item.display_title),
                item_seo_url: CheckUtils.toutiaoUtil(item.item_seo_url),
                tag_id: CheckUtils.toutiaoUtil(item.tag_id),
                source_url: CheckUtils.toutiaoUtil(item.source_url),
                large_mode: CheckUtils.toutiaoUtil(item.large_mode),
                item_id: CheckUtils.toutiaoUtil(item.item_id),
                is_digg: CheckUtils.toutiaoUtil(item.is_digg),
                seo_url: CheckUtils.toutiaoUtil(item.seo_url),
                repin_count: CheckUtils.toutiaoUtil(item.repin_count),
                url: CheckUtils.toutiaoUtil(item.url),
                level: CheckUtils.toutiaoUtil(item.level),
                digg_count: CheckUtils.toutiaoUtil(item.digg_count),
                behot_time: CheckUtils.toutiaoUtil(item.behot_time),
                hot: CheckUtils.toutiaoUtil(item.hot),
                preload_web: CheckUtils.toutiaoUtil(item.preload_web),
                comments_count: CheckUtils.toutiaoUtil(item.comments_count),
                has_image: CheckUtils.toutiaoUtil(item.has_image),
                is_bury: CheckUtils.toutiaoUtil(item.is_bury),
                group_id: CheckUtils.toutiaoUtil(item.group_id)


            });

        });


        res.send(items);
        myEvents.emit('geted', items);
    };

};
myEvents.on('geted', function (items) {
    var tableCreate = "CREATE TABLE IF NOT EXISTS toutiao_" + typeslast + " LIKE toutiao_model"

    conn.query(tableCreate, function (err, result) {
        console.log(err);
    });
    //寫入數據庫
    for (var i = 0; i < items.length; i++) {

        var itemAddSql_Params = '';
        var itemAddSql = '';
        itemAddSql_Params = [items[i].title, items[i].abstract, items[i].keywords, JSON.stringify(items[i])];
        itemAddSql = 'INSERT INTO toutiao_' + typeslast + '(title,abstract,keywords,jsonString) VALUES(?,?,?,?)';


        conn.query(itemAddSql, itemAddSql_Params, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });


    }

});

