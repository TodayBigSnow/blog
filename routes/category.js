var express = require('express');
var router = express.Router();
var category = require('../controllers/category');

//添加分类
router.post('/add',category.add);

//删除分类
router.get('/delete/:id', category.delete);

//更新分类
router.post('/update/:id', category.update);

//全部分类
router.get('/', category.getall);

//单个分类
router.get('/single/:id', category.getone);

module.exports = router;
