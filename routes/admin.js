var express = require('express');
var database_info = require('../admin/database_info.js');
var tasksetting = require('../admin/tasksetting.js');
var login_admin = require('../admin/login_admin.js');
var upload = require('../admin/upload.js');
var task = require('../admin/task.js');
var delete_data = require('../admin/delete_data.js');
var router = express.Router();
var multipart = require('connect-multiparty');
var User = require("../models/user.js");
var crypto = require("crypto");
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
router.post('/delete_data', delete_data.deleteDataBase);


// router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        return res.json({'error': '两次输入的密码不一致!'});
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email,
        user_collection: "",
        account: 0
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            return res.json({'error': err});
        }
        if (user) {
            return res.json({'error': '用户已存在!'});
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                res.json({'error': err});
            }
            req.session.user = newUser;//用户信息存入 session
            res.json({'success': '注册成功!请等待管理员授权...'});
        });
    });
});
// router.get('/login', checkNotLogin);
// // router.get('/login', function (req, res) {
// //     res.render('login', {
// //         title: '登录',
// //         user: req.session.user,
// //         success: req.flash('success').toString(),
// //         error: req.flash('error').toString()
//     });
// });
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function (err, user) {
        if (!user) {
            return res.json({'error': '用户不存在!'});
        }
        //检查密码是否一致
        if (user.password != password) {
            return res.json({'error': '密码错误!'});
        }
        if (user.actived!=true){
            return res.json({'error': '请等待管理员授权...'});
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        res.json({'success': '登陆成功!', 'coll': user.user_collection, 'account': user.account});
    });
});
router.post('/enPowerAdminUser',function (req, res) {
    User.enPowerAdmin(req.body.name,function (err,result) {
        if (err){
            return res.json({'err':err})
        }
        res.json({'success':'授权成功'})
    })


});
router.post('/changepass', function (req, res) {
    //检验用户两次输入的密码是否一致
    if (req.body.newpassword != req.body["newpassword-repeat"]) {
        return res.json({'error': '两次输入的密码不一致!'});
    }
    if (req.body.newpassword === req.body.password) {
        return res.json({'error': '原密码应与修改密码不一致'});

    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var md5 = crypto.createHash('md5'),
        newpassword = md5.update(req.body.newpassword).digest('hex');

    //检查用户是否存在
    User.changePass(req.body.name, password, newpassword, function (err, result) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': '修改成功'});
    });
});
router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    res.json({'success': '登出成功!'});
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        /**
         * 此处要加retrun
         * 不然next（）会继续执行下一条
         */
        return res.json({'error': '未登录!'});
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        return res.json({'error': '已登录!'});
    }
    next();
}

module.exports = router;
