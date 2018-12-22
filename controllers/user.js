// 控制用户增删改查
var UserModel = require("../models/User")
var User = {
// 登录验证
    loginTest: (req, res, next) => {
        if (req.body.username === '' || req.body.password === '') {
            res.json({
                status: 0,
                msg: '账号或密码不能为空！'
            });
            return;
        }
        UserModel.findOne({
            username: req.body.username
        }).then(doc => {
            // 用户不存在
            if (!doc) {
                res.json({
                    status: 0,
                    msg: '该用户不存在！'
                })
            } else {
                // 用户存在 -- > 密码验证
                UserModel.findOne({
                    password: req.body.password
                }).then(user => {
                    // 用户存在且密码正确
                    if (user) {
                        // 用户开启七日免登陆
                        if (req.body.sevenday == 'true') {
                            res.cookie('user', user.id, {
                                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
                                httpOnly: true
                            });
                        }
                        // 用户名、密码验证通过  -- 用户数据存入session
                        req.session.user = user;
                        // 将session中的用户信息存入locals
                        res.locals.user = req.session.user;
                        res.json({
                            status: 1,
                            msg: '登录成功，欢迎您！',
                            loginer: doc
                        })
                    } else {
                        // 用户名正确，但密码错误
                        res.json({
                            status: 0,
                            msg: '用户密码错误！'
                        })
                    }
                })
            }
        }).catch(err => {
            res.json({
                status: 2,
                msg: '登录验证失败！'
            })
        })
    },
    // 注册验证
    registerTest: (req, res, next) => {
        // 判断用户名是否为空
        if (req.body.username == '' || req.body.password == '' || req.body.repassword == '') {
            res.json({
                status: 0,
                msg: '输入内容不能为空！'
            });
            return;
        }
        if (!(req.body.username.length>=6&&req.body.username.length<=20)) {
            res.json({
                status: 0,
                msg: '用户名长度不符合要求！'
            });
            return;
        }
        if (req.body.password.length>20) {
            res.json({
                status: 0,
                msg: '密码长度不符合要求！'
            });
            return;
        }
        UserModel.findOne({
            username: req.body.username
        }).then(doc => {
            // 用户名合法 --> 判断用户名是否已经存在
            if (doc) {
                res.json({
                    status: 0,
                    msg: '用户名已存在！'
                });
            } else {
                // 用户名不存在 -- 可以用该用户名注册 ==》判断密码
                if (req.body.password != req.body.repassword) {
                    res.json({
                        status: 0,
                        msg: '两次密码不一致！'
                    });
                } else {
                    // 密码一致 -- 》是否已阅读条款
                    if (req.body.watchInfo == 'false') {
                        res.json({
                            status: 0,
                            msg: '请先阅读相关条款！'
                        });
                        return;
                    }
                    if (req.body.watchInfo === 'true') {
                        // 已阅读条款
                        res.json({
                            status: 1,
                            msg: '验证成功！'
                        });
                    }
                }
            }
        }).catch(err => {
            res.json({
                status: 2,
                msg: '注册失败！'
            })
        })
    },
    // 添加用户信息
    addInfo: (req, res, next) => {
        let usermodel = new UserModel({
            username: req.body.username,
            password: req.body.password,
            create_at: new Date().getTime()
        });
        usermodel.save().then(doc => {
            res.json({
                status: 1,
                msg: '注册成功！'
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '注册失败！'
            })
        })
    },
    // 删除用户信息
    deleteInfo: (req, res, next) => {
        let id = req.params.id;
        UserModel.remove({_id: id}).then(doc => {
            res.json({
                status: 1,
                msg: '删除成功！'
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '删除失败！'
            })
        })
    },
    // 更新用户信息
    updateInfo: (req, res, next) => {
        let imgPath = (req.file === undefined || req.file == null || !req.file || req.file === '') ? res.locals.user.avatar : req.file.filename;
        let id = req.params.id;
        UserModel.update({_id: id}, {
                nickname: req.body.nickname,
                avatar: imgPath,
                signature: req.body.signature,
                position: req.body.position,
                tel: req.body.tel,
            }
        ).then(doc => {
            UserModel.findOne({_id: id}).then(doc => {
                // 用户名、密码验证通过  -- 用户数据存入session
                req.session.user = doc;
                // 将session中的用户信息存入locals
                res.locals.user = req.session.doc;
                res.redirect('/manage')
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '更新失败！'
            })
        })
    },
    // 修改密码
    updatePass:(req,res,next)=>{
        let id = req.params.id;
        UserModel.update({_id: id}, {
                password:req.body.password,
            }
        ).then(doc => {
            res.json({
                status: 1,
                msg: '密码修改成功！'
            });
            res.cookie("user","",{
                expires:new Date(Date.now()),
                httpOnly:true
            });
        }).catch(err => {
            res.json({
                status: 0,
                msg: '更新失败！'
            })
            console.log('错误信息！')
            console.log(err)
        })
    },
    // 查询全部用户信息
    getAllInfo: (req, res, next) => {

        let limit=parseInt(req.query.limit)?parseInt(req.query.limit):4;
        let nowPage=req.query.page?req.query.page:1;
        let skip=(nowPage-1)*limit;
        let method = {create_at: 'desc'};
        let sort={};
        // 关键字查找
        let key=req.query.key;
        // 正则表达式对象
        let regex=new RegExp(key);
        if(key!=''){
            sort={username:{$regex:regex}};
        }else{
            sort={}
        }
        // 计算结果总数
        const count=UserModel.find(sort).count();
        let userlist='';
        if (limit){
            userlist=UserModel.find(sort).sort(method).skip(skip).limit(limit);
        } else{
            userlist=UserModel.find(sort).sort(method);
        }
        Promise.all([count, userlist]).then(([userCount, userList]) => {
            res.json({
                status: 1,
                msg: '所有用户信息获取成功！',
                doc: userList,
                count:userCount,
                totalPage:Math.ceil(userCount/limit),
                nowPage:nowPage
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '所有用户信息获取失败！'
            })
        });
    },
    // 查询单个用户信息
    getSingleInfo: (req, res, next) => {
        let id = req.params.id;
        UserModel.findOne({_id: id}).then(doc => {
            res.json({
                status: 1,
                msg: '信息获取成功！',
                doc: doc
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '信息获取失败！'
            })
        })
    },
    // admin管理指定用户信息
    adminupdatasingleuserInfo: (req, res, next) => {
        let id = req.params.id;
        UserModel.update({_id: id}, {
            username: req.body.username,
            password: req.body.password,
            nickname: req.body.nickname,
            position: req.body.position,
            tel: req.body.tel,
            admin:{
                articleAdmin:req.body.articleAdmin,
                categoryAdmin:req.body.categoryAdmin,
                userAdmin:req.body.userAdmin,
                rootAdmin:req.body.rootAdmin,
            }
        }).then(doc => {
                if(id==res.locals.user._id) {
                    UserModel.findOne({_id: id}).then(doc => {
                        // 用户名、密码验证通过  -- 用户数据存入session
                        req.session.user = doc;
                        // 将session中的用户信息存入locals
                        res.locals.user = req.session.doc;
                        res.redirect('/manage')
                    })
                }
                res.json({
                    status:1,
                    msg:"更新成功！"
                })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '更新失败！'
            })
        })


    },
    // 登出
    logout: (req, res, next) => {
        // 清空session
        req.session.destroy(err => {
            if (err) {
                res.json({
                    status:0,
                    msg:"退出失败"
                });
            } else {
                res.cookie("user","",{
                    expires:new Date(Date.now()),
                    httpOnly:true
                });
                res.redirect("/")
            }
        });
    }


    }


module.exports = User;