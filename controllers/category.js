// 控制文章分类增删改查
// 控制文章增删改查
var categoryModel = require("../models/Catagory");

var Category = {

    add: (req, res, next) => {
        let CategoryModel = new categoryModel({
            name:req.body.name,
            path:req.body.path,
            sort:req.body.sort,
            is_sys:req.body.is_sys,
            is_nav:req.body.is_nav,
            user_id: req.session.user._id,
            create_at: new Date().getTime()
        });
        CategoryModel.save().then(function () {
            res.json({
                status: 1,
                msg: '添加分类成功'
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '添加分类失败'
            })
        });
    },

    delete: (req, res, next) => {
        let id = req.params.id;
        categoryModel.remove({_id: id}).then(doc => {
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
        categoryModel.updateOne({_id: id}, {
            name:req.body.name,
            path:req.body.path,
            sort:req.body.sort,
            user_id:req.body.user_id,
            is_nav:req.body.is_nav,
            is_sys:req.body.is_sys,
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

        let limit=parseInt(req.query.limit);
        let nowPage=parseInt(req.query.page)?parseInt(req.query.page):1;
        let skip=(nowPage-1)*limit;
        let method = {sort: 'desc'};
        // 计算结果总数
        const count=categoryModel.find().count();
        let categorylist='';
        if (limit){
             categorylist=categoryModel.find().sort(method).skip(skip).limit(limit);
        } else{
             categorylist=categoryModel.find().sort(method);
        }
        Promise.all([count, categorylist]).then(([categoryCount, categoryList]) => {
            res.json({
                status: 1,
                msg: '全部获取成功！',
                doc: categoryList,
                count:categoryCount,
                totalPage:Math.ceil(categoryCount/limit),
                nowPage:nowPage
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '全部获取失败！'
            })
        })
    },

    getone: (req, res, next) => {
        let id = req.params.id;
        categoryModel.findOne({_id: id}).then(doc => {
            res.json({
                status: 1,
                msg: '获取单个成功',
                doc:doc
            })
        }).catch(err => {
            res.json({
                status: 0,
                msg: '获取单个成功失败'
            })
        });
    },
};

module.exports = Category;