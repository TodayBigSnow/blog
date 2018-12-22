function detailsarticlelist() {
    //截取url数据方法
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var Request = new Object();
    Request = GetRequest();
    var _id = Request.id;

    $.get('/article/single?id=' + _id, function (data) {

        let result = data.result;
        let comments = data.comments;
        let html = '';
        let commentsList = '';
        html += '<article class="post">'
        html += '<header class="post-head">'
        html += '<h1 class="post-title">' + result.title + '</h1>'
        html += '<section class="post-meta"><span class="author">作者：' + result.author.substring(0, 5) + '</span> -- <time class="post-date">' + moment(result.create_at).format('LL') + '</time></section>'
        html += '</header>'
        // html += '<section class="featured-media"><img src="images/loading1.gif" data-src="/uploads/' + result.img + '" class="img-responsive" style="max-height: 380px"></section>'
        html += '<section class="featured-media"><img src="/uploads/' + result.img + '" class="img-responsive" style="max-height: 380px" onerror="nofind(this)"></section>'
        html += '<section class="post-content text-center">' + result.content + '</section>';
        html += '<footer class="post-footer clearfix">';
        html += '<div class="bshare-custom icon-medium text-right" ><a title="分享到QQ空间" class="bshare-qzone"></a><a title="分享到新浪微博" class="bshare-sinaminiblog"></a><a title="分享到人人网" class="bshare-renren"></a><a title="分享到腾讯微博" class="bshare-qqmb"></a><a title="分享到网易微博" class="bshare-neteasemb"></a><a title="更多平台" class="bshare-more bshare-more-icon more-style-addthis"></a></div><script type="text/javascript" charset="utf-8" src="http://static.bshare.cn/b/button.js#style=-1&amp;uuid=&amp;pophcol=3&amp;lang=zh"></script><a class="bshareDiv" onclick="javascript:return false;"></a><script type="text/javascript" charset="utf-8" src="http://static.bshare.cn/b/bshareC0.js"></script>';
        html += '</footer>';
        html += '</article>';
        html += '<div class="about-author clearfix" style="overflow: hidden;">';
        html += '<div class="pull-left bg-danger" style="width:100px;height:100px;border-radius: 5px;overflow: hidden"><img src="/uploads/' + result.user_id.avatar + '" class="wh"/></div>';
        html += '<div class="details">';
        html += '<div class="author">文章作者 <a href="#">' + result.user_id.nickname + '</a></div>';
        html += '<div class="meta-info">';
        html += '<div class="meta-info"><span>发表于：' + moment(result.create_at).format('LL') + '</span>'
        html += '</div>';
        html += '<div class="meta-info">' + result.user_id.signature + '</div>';
        html += '</div></div>';
        // 评论区域开始
        commentsList += '<div id="comments">';
        commentsList += '<p><button class="btn btn-md" style="color: #fff;background-color: #2b91af" onclick="zan(\'' + result._id + '\');" id="zan">点赞</button> ';
        commentsList += '&nbsp;&nbsp;<button class="btn btn-md" style="color: #fff;background-color: #2b91af;" onclick="doComments()">评论 ' + comments.length + '</button></p> ';
        commentsList += '<div class="backTxtarea">';
        commentsList += '<textarea placeholder="请开始你的表演"></textarea><button class="btn btn-sm btn-danger pushBack" onclick="pushBack(\'' + result._id + '\')">确认回复</button>';
        commentsList += '</div>';
        if (comments.length <= 0) {
            commentsList += '<p class="bg-warning text-center">暂无评论~~</p>';
        }
        commentsList += '<div style="padding-left: 30px;">';
        commentsList += '<ul class="bigUl">';
        // 评论列表 --comments
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].back_id=="") {
                commentsList += '<li>';
                commentsList += '<p>';
                commentsList += '<img src="/uploads/' + comments[i].userId.avatar + '"><span>'+comments[i].userId.nickname+'</span>&nbsp;&nbsp;&nbsp;<span>'+ moment(comments[i].createTime).format('LLL') +' </span>';
                commentsList += '</p>';
                commentsList += '<p>';
                commentsList += '<span class="backTxt">' + comments[i].comments + '</span>';
                commentsList += '</p>';
                commentsList += '<p class="reBack">';
                commentsList += '<span class="backBtn" onclick="backBtn(\'' + comments[i]._id + '\',\'' + comments[i].userId.nickname + '\')">回复</span>&nbsp;&nbsp;<span class="backZan" onclick="backZan()">点赞</span>';
                commentsList += '</p>';
                // 回复列表
                for (let j = 0; j < comments.length; j++) {
                    if (comments[j].back_id == comments[i]._id) {
                    commentsList += '<ul>';
                    commentsList += '<li>';
                    commentsList += '<p>';
                    commentsList += '<img src="/uploads/' + comments[j].userId.avatar + '"><span>'+comments[j].userId.nickname+'&nbsp;&nbsp;回复</span>&nbsp;&nbsp;<span style="color: red;">@'+comments[j].nickName+'</span>&nbsp;&nbsp;&nbsp;<span>'+ moment(comments[j].createTime).format('LLL') +' </span>';
                    commentsList += '</p>';
                    commentsList += '<p>';
                    commentsList += '<span class="backTxt">' + comments[j].comments + '</span>';
                    commentsList += '</p>';
                    commentsList += '<p class="reBack">';
                    commentsList += '<span class="backBtn" onclick="backBtn(\'' + comments[i]._id + '\',\'' + comments[j].userId.nickname + '\')">回复</span>&nbsp;&nbsp;&nbsp;<span class="backZan" onclick="backZan()">点赞</span>';
                    commentsList += '</p>';
                    commentsList += '</li>';
                    commentsList += '</ul>';
                    }
                }
                commentsList += '</li>';
                }
        }
        // 评论区域结束
        $("#detailsarticlelist").html(html);
        $(".commentsList").html(commentsList);

    })
}


detailsarticlelist();
getbestarticle();
gethotarticle();
var backId="";
var nickname="";
function zan(id) {
    let params = {
        articleId: id,
        infoType: "点赞",
        comments: "",
        back_id: "",
        nickname:""
    };
    $.post('article/addArticleInfo', params, function (data) {
        let result = data;
        layer.msg(result.msg);
        getbestarticle();
        gethotarticle();
    });

}
// 回复框是否显示
var bigUlShow = false;

function doComments(){

    if (bigUlShow) {
        $("#comments .backTxtarea").slideUp(200);
        bigUlShow = !bigUlShow;
        backId="";
        nickname="";
    } else {
        $("#comments .backTxtarea").slideDown(200);
        bigUlShow = !bigUlShow;
    }
}


function backBtn(back_id,nick_name) {

    backId=back_id;
    nickname=nick_name;
    doComments()

};


function pushBack(id) {

    $("#comments .backTxtarea").slideUp(200);
    bigUlShow = false;

    let content = $("#comments .backTxtarea textarea").val();
    let params = {
        articleId: id,
        infoType: "评论",
        comments: content,
        back_id: backId,
        nickname:nickname
    };
    $.post('article/addArticleInfo', params, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#comments .backTxtarea textarea").val('');
        backId="";
        nickname="";
        detailsarticlelist();
    });
};




function backZan() {
    layer.msg("该功能正在建设中!");
};