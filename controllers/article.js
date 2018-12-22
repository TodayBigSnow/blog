// 控制文章增删改查
var ArticleModel = require("../models/Article");
var ArticleInfoModel = require("../models/ArticleInfo");
var Article = {

    add: (req, res, next) => {
        let imgPath = (req.file === undefined || req.file == null || !req.file || req.file === '') ? 'bg.jpg' : req.file.filename;
        let author = req.body.author.length > 1 ? req.body.author : '匿名大侠';
        let title = req.body.title.length > 1 ? req.body.title : '无标题';
        let articleModel = new ArticleModel({
            img: imgPath,
            title: title,
            author: author,
            category_id: req.body.category_id,
            is_jing: req.body.is_jing,
            content: req.body.content,
            user_id: req.session.user._id,
            create_at: new Date().getTime()
        });
        articleModel.save().then(function () {
            res.redirect('/')
        }).catch(err => {
            res.redirect('/publish')
        });
    },

    delete: (req, res, next) => {
        let id = req.params.id;
        ArticleModel.remove({_id: id}).then(doc => {
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

    update: (req, res, next) => {
        let id = req.params.id;
        ArticleModel.update({_id: id}, {
            title: req.body.title,
            author: req.body.author,
            is_jing: req.body.is_jing,
            category_id: req.body.category_id,
            // img: req.file.filename,
            content: req.body.content,
            update_at: new Date().getTime()
        }).then(doc => {
            res.json({
                status: 1,
                msg: '更新成功！'
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '更新失败！'
            })
        })
    },

    getall: (req, res, next) => {

        let sort = {};
        // 关键字查找
        let key = req.query.key;
        // 正则表达式对象
        let regex = new RegExp(key);
        if (key && key != '' && key != 'undefined') {
            sort = {title: {$regex: regex}};
            // console.log("关键字");
            // console.log(key);
        } else {
            sort = {}
        }
        // 文章排序方式 -- 热门
        let method = {create_at: 'desc'};
        if (req.query.hot == 'hot') {
            method = {view: 'desc'}
        }
        // 文章类型 -- 精选--同时按照阅读量排行
        if (req.query.best == 'best') {
            sort = {is_jing: 1};
            method = {view: 'desc'}
        }
        // 分类查找
        if (req.query.category_id) {
            sort = {category_id: req.query.category_id};
            method = {create_at: 'desc'};
        }
        //limit -- 每页显示个数 ，allPage -- 总页数 ，nowPage -- 当前页 ，totalPage -- 总页数
        let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 3;
        let nowPage = req.query.page ? req.query.page : 1;
        let skip = (nowPage - 1) * limit;
        // 计算结果总数
        const count = ArticleModel.find(sort).sort(method).count();
        const articleList = ArticleModel.find(sort).skip(skip).limit(limit).sort(method);
        // const articleZanCount = ArticleInfoModel.find({articleId: req.body.articleId, infoType: "点赞"}).count();
        Promise.all([count, articleList]).then(([articleCount, ArticleList]) => {
            res.json({
                status: 1,
                msg: '全部获取成功！',
                doc: ArticleList,
                count: articleCount,
                totalPage: Math.ceil(articleCount / limit),
                nowPage: nowPage
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '全部获取失败！'
            })
        })
    },

    getsingle: (req, res, next) => {

        let id = req.query.id;

        const singleArticle =ArticleModel.findOne({_id: id}).populate('user_id');
        const articlecomment = ArticleInfoModel.find({articleId: id,infoType:"评论"}).populate('userId').sort({createTime: 'desc'});
        Promise.all([singleArticle, articlecomment]).then(([singleArticles, articlecomments]) => {
            res.json({
                status: 1,
                msg: '获取单个文章成功！',
                result: singleArticles,
                comments:articlecomments,
            });
        }).catch(err => {
            res.json({
                status: 0,
                msg: '获取单个文章失败！'
            })
        })
    },

    // 点赞、评论功能
    getInfo: (req, res, next) => {

    },
    addInfo: (req, res, next) => {

        // 用户已登录
        if (req.session.user) {
            ArticleInfoModel.findOne({
                userId: req.session.user._id,
                articleId: req.body.articleId,
                infoType: req.body.infoType,
            }).then(doc => {
                // 点过赞了
                if (doc && req.body.infoType == '点赞') {
                    res.json({
                        msg: "你已经赞过了，你对我的好我会永远记得"
                    });
                }
                // 保存点赞或评论数据
                else {
                   let  articleInfoModel = new ArticleInfoModel({
                        articleId: req.body.articleId,
                        userId: req.session.user._id,
                        infoType: req.body.infoType,
                        comments: req.body.comments,
                        back_id: req.body.back_id,
                        nickName: req.body.nickname,
                        createTime: new Date().getTime()
                    });
                    console.log(articleInfoModel);
                    articleInfoModel.save().then(doc => {
                        if (req.body.infoType == '点赞') {
                            // 点击阅读文章后，增加该文章阅读次数
                            ArticleModel.findOne({_id: req.body.articleId}).then(doc => {
                                let result = doc;
                                // 点击阅读文章后，增加该文章阅读次数
                                ArticleModel.updateOne({_id: req.body.articleId}, {
                                    zanCount: result.zanCount + 1,
                                }).then(doc => {
                                    res.json({
                                        msg: "biu biu ,点赞+1！"
                                    })
                                })
                            })
                        }
                        if (req.body.infoType == '评论') {
                            // 点击阅读文章后，增加该文章评论次数
                            ArticleModel.findOne({_id: req.body.articleId}).then(doc => {
                                let result = doc;
                                // 点击阅读文章后，增加该文章评论次数
                                ArticleModel.updateOne({_id: req.body.articleId}, {
                                    commentCount: result.commentCount + 1,
                                }).then(doc => {
                                    res.json({
                                        msg: "评论成功！"
                                    })
                                })
                            })
                        }
                    }).catch(err => {
                        res.json({
                            msg: "网络开小差了~(｀・ω・´)，刷新试一试"
                        })
                    });
                }
            })

        }
        // 用户未登录
        else {
            res.json({
                msg: "登陆之后才能操作哦！"
            })
        }
    },

    updateInfo: (req, res, next) => {

        let id = req.body.articleId;
        let user = req.session.user;

        ArticleModel.findOne({_id: id}).then(doc => {
            let result = doc;
            // 点击阅读文章后，增加该文章阅读次数
            ArticleModel.update({_id: id}, {
                zan: result.zan.push(user._id),
            }).then(doc => {
                res.json({
                    status: 1,
                    msg: 'biu biu，点赞+1！',
                    result: result,
                    user: user
                })
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '点赞失败！'
            })
        })

    },
    deleteInfo: (req, res, next) => {

    }
};


module.exports = Article;