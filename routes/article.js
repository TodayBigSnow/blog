var express = require('express');
var router = express.Router();
var article = require('../controllers/article');
//图片上传
var upload = require('../library/upload');

//添加文章
router.post('/add', upload.single('img'), article.add);

//删除文章
router.get('/delete/:id', article.delete);

//更新文章
router.post('/update/:id', article.update);

//全部文章
router.get('/', article.getall);

//获取单个文章
router.get('/single',article.getsingle);

// 点赞、评论功能
// 获取点赞评论信息
router.post('/getArticleInfo', article.getInfo);

// 添加点赞评论信息
router.post('/addArticleInfo', article.addInfo);

// 删除点赞评论信息
router.post('/deleteArticleInfo', article.deleteInfo);

// 更新点赞评论信息
router.post('/updateArticleInfo', article.updateInfo);



module.exports = router;
