/**
 * Created by deng on 16-5-12.
 */
var mongodb = require('./db');

function Record(record) {
    this.operator=record.operator;
    this.operatortype=record.operatortype;
    this.operate=record.operate;
}
module.exports=Record;

//存储操作记录
Record.prototype.save=function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    // var time = {
    //     date: date,
    //     year: date.getFullYear(),
    //     month: date.getFullYear() + "-" + (date.getMonth() + 1),
    //     day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    //     minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
    //     date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    // };
    var record={
        operator:this.operator,
        operatortype:this.operatortype,
        operate:this.operate,
        time:date
    };
    mongodb.open(function (err, db) {
        if (err){
            return callback(err);
        }
        db.collection('records',function (err, collection) {
            if (err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(record,{
                safe:true
            },function (err, record) {
                mongodb.close();
                if (err){
                    return callback(err);
                }
                callback(null,record[0]);
            })
        })
    })
    
};

Record.getAll=function (callback) {
    mongodb.open(function (err, db) {
        if (err){
            return callback(err);
        }
        
        db.collection('records',function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.find().toArray(function (err, result) {
                if (err){
                    return callback(err);//错误，返回 err 信息
                }
                return callback(null,result);
            })
        })
    })
};
