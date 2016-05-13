var express = require('express');
var budejie = require('../api/budejie.js');
var neihan = require('../api/neihan.js');
var qiubai = require('../api/qiubai.js');
var recommend = require('../api/recommend.js');
var toutiao = require('../api/toutiao.js');
var yidian = require('../api/yidian.js');
var ClientUser = require('../models/clientUser.js');


var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.query.devid==undefined|req.query.usertype==undefined){
        return res.json({error:'参数异常'});
    }
    //获取用户信息
    var devid = req.query.devid;
    var usertype = req.query.usertype;
    var clientUser = new ClientUser({
        devId:devid,
        type:usertype
    });
    //检查用户名是否已经存在
    ClientUser.get(clientUser.devId, function (err, clientUser1) {
        if (err) {
            return res.json({'error': err});
        }
        if (clientUser1) {
            return res.json({'success': '用户已存在!'});
        }
        //如果不存在则新增用户
        clientUser.save(function (err, clientUser) {
            if (err) {
                res.json({'error': err});
            }
            res.json({'success':'成功'});
        });
    });

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
//一点
router.get('/yidian',yidian.yidian);
module.exports = router;
