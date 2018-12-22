//引入数据库模块
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//自定义Schema
var ArticleInfoSchema = new Schema({

    articleId: {
        type: String,
        default: ""
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    infoType: {
        type: String,
        default: ""
    },
    // 回复的评论的id
    commentId:{
        type: String,
        default: ""
    },
    // 回复的 评论对应用户的id
    backWho: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: {
        type: String,
        default: ""
    },
    createTime: {
        type: Number,
        default: 0
    }

});
//创建model,并实现外部接口 作用的集合名称自动加“s”
var ArticleInfo = mongoose.model("articleInfo", ArticleInfoSchema);
module.exports = ArticleInfo;