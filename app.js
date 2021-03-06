var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/**
 * 路由
 * @type {router|exports|module.exports}
 */
var routes = require('./routes/index');
var users = require('./routes/users');
var crawler = require('./routes/crawler');
var api = require('./routes/api');
var admin = require('./routes/admin');
var timeTask = require('./controler/schedule_update');
var session = require('express-session');
var settings = require("./settings.js");
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var times = [];
var MongoStore = require('connect-mongo')(session);
var app = express();

var EventEmitter = require('events').EventEmitter;
/**
 * 全局变量
 * @type {*|EventEmitter}
 */
messageEvents = new EventEmitter();
APP_PATH = __dirname;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 * 会话模块
 */
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days]
    saveUninitialized: true,
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port,
        url: 'mongodb://localhost/guide'
    }),
    resave: false


}));
app.use('/', routes);
app.use('/users', users);
//爬虫
app.use('/crawler', crawler);
//接口提供
app.use('/api', api);
//admin
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = require('http').Server(app);
var io = require('socket.io')(server);
rule.minute = times;
for (var i = 0; i < 60; i = i + 10) {
    times.push(i);
}
schedule.scheduleJob(rule, function () {
    timeTask.timeTask();
    console.log("------------" + new Date())
});

server.listen(3002);

io.on('connection', function (socket) {
    console.log("connection");
    socket.emit('dengyi', {deng: '这是测试数据'});
    socket.on('new admin', function (data) {
        console.log(data);
    });

    messageEvents.on('taskfinish', function (data) {
        console.log(data);
        socket.emit('taskfinish', data);
    });

    messageEvents.on('pushToUser', function (data) {
        console.log(data);
        var to = parseInt(data.to);
        for (var i = 0; i <20; i++) {
            var number = to & parseInt(Math.pow(2, i));
            if (number > 0) {
                console.log(i)
                socket.broadcast.emit('type'+i,data.content);
                /**
                 * type0-type19
                 */
            }

        }
    });
});

module.exports = app;
