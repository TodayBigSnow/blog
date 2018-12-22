var ArticleModel = require("../models/Article");
const middlewareArticleDetails=(req,res,next)=>{

    let id = req.query.id;
    if (id){
        ArticleModel.findOne({_id: id}).then(doc => {
            let result = doc;
            // 点击阅读文章后，增加该文章阅读次数
            ArticleModel.update({_id: id}, {
                view: parseInt(result.view) + 1,
            }).then(doc => {
                next();
            })
        })
    } else{
        next();
    }


};
module.exports=middlewareArticleDetails;


