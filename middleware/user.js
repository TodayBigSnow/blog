// 记住密码
// 如果session不存在
// 1、将cookies中的 user_id 进行查询，
// 2、如果能查询到，则将查询到的结果 存入session

const UserModel = require("../models/User");
const User = (req, res, next) => {

// cookie获取用户id
    if (req.session.user==null) {
        let id = req.cookies.user;
        // 查询用户
        UserModel.findOne({_id: id}).then(doc => {
            let user = doc;
            if (user) {
                // 将用户写入session
                req.session.user = user;
                // 将session中的用户信息存入locals
                res.locals.user = req.session.user;
            }
            next();
        })
    }
    else {
        res.locals.user = req.session.user;
        next();

    }
}
module.exports =  User;