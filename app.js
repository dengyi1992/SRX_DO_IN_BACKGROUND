var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var crawler = require('./routes/crawler');
var api = require('./routes/api');
var app = express();
var EventEmitter = require('events').EventEmitter;
messageEvents = new EventEmitter();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
//爬虫
app.use('/crawler',crawler);
//接口提供
app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(2999);
io.on('connection', function (socket) {
    console.log("connection");
    socket.emit('dengyi',{deng:'这是测试数据'});
    socket.on('new admin', function (data) {
        console.log(data);
    });

    messageEvents.on('taskfinish',function(data){
        console.log(data);
        socket.emit('taskfinish',data);
    });



});
module.exports = app;
