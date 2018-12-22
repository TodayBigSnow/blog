
function showarticlesort() {
    //截取url数据方法
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

    let queryname = '/article?category_id=' + Request.category_id;
    if (Request.page) {
        queryname = '/article?category_id=' + Request.category_id + '&page=' + Request.page;
    }
    if(Request.key){
        queryname = '/article?key=' + Request.key;
        if (Request.page) {
            queryname = '/article?key=' + Request.key + '&page=' + Request.page;
        }
    }

    $.get(queryname, function (data) {
        // 文章列表
        let list = data.doc;
        // 当前页
        let nowPage = parseInt(data.nowPage);
        // 总页数
        let totalPage = data.totalPage;
        let sortarticlelist = '';
        if (list.length >= 1) {
            for (let i = 0; i < list.length; i++) {
                sortarticlelist += '<div  class="sortBidDiv" style="padding:10px 15px 10px 5px;box-sizing:border-box;background:#fff;height: 240px;overflow: hidden;margin-bottom: 20px;border: 1px solid #eee;">';
                sortarticlelist += '<div class="col-xs-5 sortImg  whheight" style="overflow: hidden;">';
                // sortarticlelist += '<a href="/details?id=' + list[i]._id + '"><img  src="images/loading1.gif" data-src="uploads/' + list[i].img + '" class=" wh img-responsive"></a>';
                sortarticlelist += '<img  src="uploads/' + list[i].img + '" class=" wh img-responsive">';
                sortarticlelist += '</div>';
                sortarticlelist += '<div class="col-xs-7 sortDiv whheight  whpadding">';
                sortarticlelist += '<div class="text-left">';
                sortarticlelist += '<h4 style="color: #555">' + list[i].title.substring(0,12) + ' ...</h4>';
                sortarticlelist += '<p style="color: #555;">作者：<span style="color: red">' + list[i].author.substring(0,5) + '</span> -- ' + moment(list[i].create_at).startOf('hour').fromNow() + '</p>';
                sortarticlelist += '</p>';
                sortarticlelist += '</div>';
                sortarticlelist += '<a href="/details?id=' + list[i]._id + '"><p class="articleContent" style="margin: 0;padding: 10px;color: #666">' + list[i].content.replace(/<\/?.+?>/g,"").replace(/ /g,"").substring(0, 80) + ' ...</p></a>';
                sortarticlelist += '<div class="text-right" style="padding:5px 10px;position:absolute;width:100%;left:0;bottom: 5px">';
                sortarticlelist += '<span class="glyphicon glyphicon-heart-empty">&nbsp;biu</span>';
                sortarticlelist += '&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open">&nbsp;' + list[i].view + '</span>';
                sortarticlelist += ' </div> </div> </div>';
            }
            let pagehref = '/sort?category_id=' + Request.category_id + '&page=';
            if(Request.key){
                pagehref = '/sort?key=' + Request.key + '&page=';
            }
            let pre = (nowPage - 1) <= 1 ? 1 : (nowPage - 1);
            let next = (nowPage + 1) >= totalPage ? totalPage : (nowPage + 1);

            sortarticlelist += '<nav class="pagination" role="navigation" style="padding: 10px;background-color: #fff">';
            if (totalPage >= 1) {
                if (totalPage > 1 && nowPage > 1) {
                    sortarticlelist += '<a class="older-posts" href="' + pagehref + pre + '" ><i class="fa fa-angle-left"></i></a>';
                }
                sortarticlelist += '<span class="page-number">第 ' + nowPage + ' 页 / 共' + totalPage + ' 页</span>';
                if (totalPage > 1 && nowPage < totalPage) {
                    sortarticlelist += '<a class="older-posts" href="' + pagehref + next + '"><i class="fa fa-angle-right"></i></a>';
                }
                sortarticlelist += '</nav>';
            }
        } else {
            sortarticlelist += '<div class="text-center bg-warning"><p>一条数据都没有(╯▽╰)，快去发布文章吧~~</p></div>';
        }
        $("#sortarticlelist").html(sortarticlelist);

    })
}

showarticlesort();


