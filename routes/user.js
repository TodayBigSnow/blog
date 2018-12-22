var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
//图片上传
var upload = require('../library/upload');

//  -------登录-------
// 登录验证
router.post('/loginTest', user.loginTest);
//  -------注册-------
// 注册验证  -- 添加用户信息
router.post('/registerTest', user.registerTest);

// ------用户信息------
// 添加用户信息
router.post('/addInfo', user.addInfo);
// 删除用户信息
router.get('/deleteInfo/:id', user.deleteInfo);
// 更新用户信息
router.post('/updateInfo/:id',upload.single('avatar'), user.updateInfo);
router.post('/updatePass/:id', user.updatePass);
// 查询全部用户信息
router.get('/getAllInfo', user.getAllInfo);
// 查询单个用户信息
router.get('/getSingleInfo/:id', user.getSingleInfo);
// admin更新指定用户信息
router.post('/adminupdatasingleuserInfo/:id', user.adminupdatasingleuserInfo);

router.get("/logout",user.logout);
module.exports = router;