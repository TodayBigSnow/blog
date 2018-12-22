var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c8d13872a523d9c286aa7affbe0921f1";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

function indexarticle() {

    //先判断路由是否有query值，判断是首页还是热门或者精选文章 =》截取url数据方法
    function getCategoryID() {
        let url = location.search; //获取url中"?"符后的字串
        let theRequest = new Object();
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    let Request = new Object();
    Request = getCategoryID();
    let queryname = '/article';
    if (Request.page) {
        queryname = '/article?page=' + Request.page;
    }
    if (Request.hot == 'hot') {
        queryname = '/article/?hot=hot';
        if (Request.page) {
            queryname += '/article/?hot=hot&page=' + Request.page;
        }
    }
    if (Request.best == 'best') {
        queryname = '/article?best=best';
        if (Request.page) {
            queryname += '/article/?best=best&page=' + Request.page;
        }
    }
    $.get(queryname, function (data) {

        // 文章列表
        let list = data.doc;
        // 当前页
        let nowPage = parseInt(data.nowPage);
        // 总页数
        let totalPage = data.totalPage;
        let html = '';
        if (list.length >= 1) {
            for (let i = 0; i < list.length; i++) {
                html += '<article class="post" style="border: 1px solid #eee;">';
                html += '<div class="post-head">'
                html += '<h1 class="post-title"><a href="#">' + list[i].title.substring(0, 18) + '</a></h1>'
                html += '<div class="post-meta"><span class="author">作者：' + list[i].author.substring(0, 5) + '</span> • <time class="post-date"> ' + moment(list[i].create_at).fromNow() + '</time></div>';
                // html += '<div class="featured-media"><a href="#"><img src="images/loading1.gif" data-src="/uploads/' + list[i].img + '" class="img-responsive" style="height: 320px"></a></div>'
                html += '<div class="featured-media"><a href="/details?id=' + list[i]._id + '"><img src="/uploads/' + list[i].img + '" class="img-responsive" style="height: 320px" onerror="nofind(this)"></a></div>'
                html += '<div class="post-content"><p></p><p class="articleContent" style="color: #555">' + list[i].content.replace(/<\/?.+?>/g,"").replace(/ /g,"").substring(0, 80) + ' ...</p><p></p></div>'
                html += '<div class="post-permalink text-left" style="line-height: 36px"><a href="/details?id=' + list[i]._id + '" class="btn btn-default">阅读全文</a>&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-heart-empty">&nbsp;赞'+ list[i].zanCount + '</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open">&nbsp;' + list[i].view + '</span></div>'
                html += '<footer class="post-footer clearfix"></footer>'
                html += '</article>'
            }
            let pagehref = '/?';
            if (Request.hot == 'hot') {
                pagehref = '/?hot=hot&';
            }
            if (Request.best == 'best') {
                pagehref = '/?best=best&';
            }
            let pre = (nowPage - 1) <= 1 ? 1 : (nowPage - 1);
            let next = (nowPage + 1) >= totalPage ? totalPage : (nowPage + 1);
            html += '<nav class="pagination" role="navigation" style="padding: 10px;background-color: #fff">';
            if (totalPage > 1 && nowPage > 1) {
                html += '<a class="older-posts" href="' + pagehref + 'page=' + pre + '" ><i class="fa fa-angle-left"></i></a>';
            }
            html += '<span class="page-number">第 ' + nowPage + ' 页 / 共' + totalPage + ' 页</span>';
            if (totalPage > 1 && nowPage < totalPage) {
                html += '<a class="older-posts" href="' + pagehref + 'page=' + next + '"><i class="fa fa-angle-right"></i></a>'
            }
            html += '</nav>'
        } else {
            html += '<div class="text-center bg-warning"><p>一条数据都没有(╯▽╰)，快去发布文章吧~~</p></div>';
        }
        $("#indexarticlelist").html(html);
    })
}

indexarticle();
