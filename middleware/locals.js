const Locals=(req,res,next)=>{
    
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
};
module.exports=Locals;