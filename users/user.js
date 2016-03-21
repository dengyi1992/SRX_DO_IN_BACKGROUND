var mysql = require('mysql');
/**
 * Created by deng on 16-3-21.
 */

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'srx',
    port: 3306
});

/**
 * 看某个用户是否存在
 * @param username
 */
exports.userFind = function (username) {
    var selectUserInfo = 'SELECT * FROM appuser where username =' + username;
    conn.query(selectUserInfo, function (err, rows, fields) {
        if (!err && rows.length > 0) {
            return rows[0];
        }

    });
};
/**
 * 新增用户
 * @param username
 * @param devicesId
 * @param pass
 * @param loginname
 */
exports.useradd = function (username, devicesId, pass, loginname, interest) {
    var addUser = 'INSERT INTO appuser(username,devicesId,pass,loginname,interest) VALUES(?,?,?,?,?)'
    var addUserParams = [username, devicesId, pass, loginname, interest];
    conn.query(addUser, addUserParams, function (err, result) {
        if (err) {

            return false;
        } else {
            return true;
        }
    });
};
exports.index = function (req, res, next) {
    var user_name = req.params.name;
    user.userFind(user_name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render('这个用户不存在。');
            return;
        }
    });
};
exports.deleteUser=function(username){
    var delUser = 'DELETE FROM  appuser WHERE usename= ?'
    var delParams = [username];
    conn.query(delUser,delParams, function (err, result) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
};
