var express = require('express');
var router = express.Router();
var middlewareArticleDetails=require("../middleware/articleDetails")
// 登录
router.get('/login', function(req, res, next) {
    res.render('login', { title: '取墨 - 取墨小屋' });
});

// 注册
router.get('/register', function(req, res, next) {
    res.render('register', { title: '取墨 - 取墨小屋' });
});

// 首页
router.get('/', function(req, res, next) {
    res.render('index', { title: '取墨 - 取墨小屋' });
});
// 文章发布页
router.get('/publish', function(req, res, next) {
    res.render('publishArticle', { title: '取墨 - 取墨小屋' });
});
// 文章详情页
router.get('/details', middlewareArticleDetails, function(req, res, next) {
    res.render('articleDetails', { title: '取墨 - 取墨小屋' });
});
// 分类展示页
router.get('/sort', function(req, res, next) {
    res.render('articleSort', { title: '取墨 - 取墨小屋' });
});
// 搜索结果展示页
router.get('/search', function(req, res, next) {
    res.render('publishArticle', { title: '取墨 - 取墨小屋' });
});
//管理页面
router.get('/manage', function(req, res, next) {
    res.render('adminManage', { title: '取墨 - 取墨小屋' });
});

module.exports = router;
