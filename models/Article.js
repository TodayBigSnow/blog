//引入数据库模块
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//自定义Schema
var ArticleSchema = new Schema({

//   文章标题
    title: {
        type: String,
        default: ""
    },
//   作者
    author: {
        type: String,
        default: ""
    },
//   图片路径
    img: {
        type: String,
        default: ""
    },
//   文章内容
    content: {
        type: String,
        default: ""
    },
//   是否为精选文章
    is_jing: {
        type: Number,
        default: 0
    },
//    阅读数量
    view: {
        type: Number,
        default: 0
    },
//  文章类别ID      
    category_id: {
        type: String,
        default: '默认'
    },
//  用户ID
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    // 点赞个数
    zanCount: {
        type: Number,
        default: 0 ,
    },
    // 评论个数
    commentCount: {
        type: Number,
        default: 0 ,
    },
//  创建时间
    create_at: {
        type: Number,
        default:0
    },
//  更新时间
    update_at: {
        type: String,
        default: null
    },
//  删除时间
    delete_at: {
        type: String,
        default: null
    }
});
//创建model,并实现外部接口 作用的集合为node数据库里的articles(自动加“s”)
var Article = mongoose.model("article", ArticleSchema);
module.exports = Article;

