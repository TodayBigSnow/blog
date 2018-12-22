//引入数据库模块
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//自定义Schema
var UserSchema = new Schema({

//   用户名
    username: {
        type: String,
        default: ""
    },
//   用户密码
    password: {
        type: String,
        default: ""
    },
//   昵称
    nickname: {
        type: String,
        default: "没有设置昵称"
    },
//   头像
    avatar: {
        type: String,
        default: "morenAvator.png"
    },
//   个性签名
    signature: {
        type: String,
        default: "这个人很懒，没有设置签名"
    },
//    职位
    position: {
        type: String,
        default: "职场新人"
    },
//    其他信息
    tel: {
        type: String,
        default: "这个人很懒，没有留下联系方式"
    },
    // 权限
    admin: {
        articleAdmin: {
            type: Boolean,
            default: false
        },
        categoryAdmin: {
            type: Boolean,
            default: false
        },
        userAdmin: {
            type: Boolean,
            default: false
        },
        rootAdmin: {
            type: Boolean,
            default: false
        }
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
//创建model,并实现外部接口 作用的集合为node数据库里的users(自动加“s”)
var usermodel = mongoose.model("user", UserSchema);
module.exports = usermodel;

