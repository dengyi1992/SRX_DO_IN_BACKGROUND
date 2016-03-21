var express = require('express');
var database_info = require('../admin/database_info.js');
var tasksetting = require('../admin/tasksetting.js');
var login_admin = require('../admin/login_admin.js');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    //管理基本信息
  res.render('index', { title: '管理员' });
});
//所有的数据库表信息的概述
router.get('/databaseinfo',database_info.databaseinfo);
//任务设置
router.post('/tasksetting',tasksetting.tasksetting);
//登录
router.post('/adminlogin',login_admin.admin_login);
module.exports = router;
