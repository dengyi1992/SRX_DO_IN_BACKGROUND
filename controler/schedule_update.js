/**
 * Created by deng on 16-3-17.
 * 思维广一点，不能用sql触发器的话可以用，用事件触发嘛！
 * 只要有他思考setting接口访问成功，并在数据库里面成功
 * 更新，或者插入了数据，我们就可以去数据库中查询更新的
 * 数据，或者直接由触发器传来相应的数据，并进行一系列的
 * 操作。Bingo！
 */

var request = require('request');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();

var count = 0;


exports.timeTask = function () {


    var userAddSql = 'SELECT * FROM tasksetting';
    count = count + 1;
    conn.query(userAddSql, function (err, rows, fields) {
        if (err) throw err;

        for (var i = 0; i < rows.length; i++) {
            if (count % rows[i].cycle == 0) {
                myEvents.emit('newtask', rows[i].interfaceurl,rows[i].interfacetag);
            }
        }


    });
};

myEvents.on('newtask', function (url,tag) {
    var options1 = {
        method: 'GET',
        encoding: null,
        url: url
    };
    request(options1, function (error, response, body) {
        console.log(new Date());
        messageEvents.emit('taskfinish',{message:'success',url:url,type:'数据更新成功',messageType:'dataupdate',iname:tag,time:new Date()});
    });

});


