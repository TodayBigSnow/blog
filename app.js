var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//登录状态信息
var session=require("express-session");

//flash闪存  -- 一次性信息
const flash=require("connect-flash");

//locals 全局信息
const locals=require("./middleware/locals");
// 登录用户信息 -- 全局
const loginuser=require("./middleware/user");


//连接数据库
var database = require('./bootstrap/database');
database.connect();

//路由列表
// 首页/详情页/分类查询页/发布页
var index = require('./routes/index');

// 用户信息管理
var user=require('./routes/user');
// 文章管理
var article=require('./routes/article');
// 分类管理
var category=require('./routes/category');

var compression = require('compression')
var app = express();

//尽量在其他中间件前使用compression
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({
    secret: 'keyboard cat', //一个String类型的字符串，作为服务器端生成session的签名
    resave: true, //(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
    saveUninitialized: true //初始化session时是否保存到存储
}));

//flash 闪存信息
app.use(flash());

//locals 全局信息
app.use(locals);
// loginuser 用户全局信息
app.use(loginuser);
// 路由列表
// 首页/详情页/分类查询页/发布页
app.use('/', index);

// 用户信息管理
app.use('/user',user);
// 文章管理
app.use('/article',article);
// 分类管理
app.use('/category',category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
