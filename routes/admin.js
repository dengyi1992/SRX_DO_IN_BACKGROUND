var express = require('express');
var database_info = require('../admin/database_info.js');
var tasksetting = require('../admin/tasksetting.js');
var login_admin = require('../admin/login_admin.js');
var upload = require('../admin/upload.js');
var task = require('../admin/task.js');
var delete_data =require('../admin/delete_data.js');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET home page. */
router.get('/', function (req, res, next) {
    //管理基本信息
    res.render('index', {title: '管理员'});
});
//所有的数据库表信息的概述
router.get('/databaseinfo', database_info.databaseinfo);
//任务设置
router.post('/tasksetting', tasksetting.tasksetting);
//登录
router.post('/adminlogin', login_admin.admin_login);
//上传
router.get('/upload', upload.upload);
router.post('/uploadfile', multipartMiddleware, upload.uploadfile);
//任务数据库接口
router.get('/tasksetting_info', task.tasksetting_info);
//新闻表数据清除接口，此处需要认证
router.post('/delete_data',delete_data.deleteDataBase);
module.exports = router;
