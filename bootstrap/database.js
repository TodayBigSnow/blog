//引入数据库模块
var mongoose = require('mongoose');
//连接名为node的数据库
function connect(){
    mongoose.connect("mongodb://47.99.83.216:27017/newBlog");
//数据库连接状态
    var db = mongoose.connection;
//    连接成功
    db.on('open',function () {
        console.log('数据库连接成功!');
    });
//    连接失败
    db.on('error',function (err) {
        console.log(err.stack);
        console.log("连接失败！");
    });
}
//建立用于连接数据库的对外接口
exports.connect = connect;
