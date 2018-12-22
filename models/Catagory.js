//引入数据库模块
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//自定义Schema
var CatagorySchema = new Schema({

//   名称
    name: {
        type: String,
        default: ""
    },
//   路径
    path: {
        type: String,
        default: "/"
    },

//   排序（数字越大越靠前）
    sort: {
        type: Number,
        default: 0
    },
//    是否是系统栏目（0否，1 是）
    is_sys: {
        type: Number,
        default: 0
    },
//    是否显示在导航（0否，1 是）
    is_nav: {
        type: Number,
        default: 0
    },
//  用户ID
    user_id: {
        type: String,
        default: ''
    },
//  创建时间
    create_at: {
        type: Number,
        default: 0
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
//创建model,并实现外部接口 作用的集合为node数据库里的catagorys(自动加“s”)
var categorymodel = mongoose.model("catagory", CatagorySchema);
module.exports = categorymodel;

