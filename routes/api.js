var express = require('express');
var budejie = require('../api/budejie.js');
var neihan = require('../api/neihan.js');
var qiubai = require('../api/qiubai.js');
var recommend = require('../api/recommend.js');
var toutiao = require('../api/toutiao.js');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    //获取所有的api的基本信息
  res.render('index', { title: 'api' });
});
//不得姐api
router.get('/budejie',budejie.budejieapi);
//内涵段子api
router.get('/neihan',neihan.neihanapi);
//糗事百科
router.get('/qiubai',qiubai.qiubaiapi);
//推荐
router.get('/recommend',recommend.recommendapi);
//头条通用
//tablename
router.get('/toutiao',toutiao.toutiaoapi);

//头条v2
router.get('/toutiaov2',toutiao.toutiaov2);

module.exports = router;
