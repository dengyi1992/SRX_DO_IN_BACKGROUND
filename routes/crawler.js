var express = require('express');
var router = express.Router();
var yule= require('../crawler/yule.js');
var yidian= require('../crawler/yidian.js');
var zanker = require('../crawler/zanker.js');
var health = require('../crawler/health.js');
var neihan = require('../crawler/neihan.js');
var budejie = require('../crawler/budejie.js');
var intime = require('../crawler/intime.js');
var toutiao_common = require('../crawler/toutiao_common.js');
var toutiao_recommend = require('../crawler/toutiao_recommend.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    //获取所有的爬虫的基本信息
  res.render('index', { title: '爬虫' });
});
router.get('/test',function(req, res, next) {
    //获取所有的爬虫的基本信息
    res.json({msg:'asdads'});
});
//百度娱乐api
router.get('/yule',yule.yule);
//小米浏览器一点
router.get('/yidian',yidian.yidian);
//赞客
router.get('/zanker',zanker.zanker);
//健康
router.get('/health',health.health);
//内涵段子
router.get('/neihan',neihan.neihan);
//不得姐
router.get('/budejie',budejie.budejie);
//实时百度api
router.get('/intime',intime.intime);
//头条通用爬取接口
// toutiaonum 头条号
// agenum 第几页
// tablename 存入的数据库的表名称
router.get('/toutiao_common',toutiao_common.toutiao_common);


router.get('/toutiao_recommend',toutiao_recommend.toutiao);


module.exports = router;
