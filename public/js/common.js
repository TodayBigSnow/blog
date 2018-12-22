// header
function getcategoryInfoList() {
    $.get('/category', function (data) {
        let list = data.doc;
        let categorylist = '';
        let articleSortList = '';
        if (data.status == 1) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].is_nav == 1 && list[i].is_sys == 1) {
                    categorylist += '<li><a href="' + list[i].path + '">' + list[i].name + '</a></li>'
                }
            }
            categorylist += '<li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">文章分类<span class="caret"></span></a>'
            categorylist += '<ul class="dropdown-menu">';
            for (let i = 0; i < list.length; i++) {
                if (list[i].is_nav == 1 && list[i].is_sys == 0) {
                    categorylist += '<li><a href="/sort?category_id=' + list[i]._id + '">' + list[i].name + '</a></li>'
                }
            }
            categorylist += '</ul></li>'

            // 右侧分类列表
            // let colorArr=['btn-block','btn-success','btn-danger','btn-warning','btn-primary','btn-default'];
            // let colorRandom=Math.floor(Math.random()*(colorArr.length-1));
            // console.log(colorRandom)
            for (let i = 0; i < list.length; i++) {
                if (list[i].is_nav == 1 && list[i].is_sys == 0) {
                    articleSortList += '<div style="padding: 5px 10px"><a  href="/sort?category_id=' + list[i]._id + '""><button type="button" class="btn  btn-lg btn-block btn-default">' + list[i].name + '</button></a></div>'
                }
            }
        }
        $("#categorylist").html(categorylist);
        articleSortList += '<div style="padding: 5px 10px"><button type="button" class="btn  btn-lg btn-block btn-default">未完待续 。。。</button></div>'
        $("#articleSortList").html(articleSortList)
    })
}

getcategoryInfoList();

// right
function getbestarticle() {

    $.get('/article?best=best', function (data) {
        let list = data.doc;
        if (data.status == 1) {
            let html = '<h4 class="title">精选文章</h4>';
            let length = list.length <= 3 ? list.length : 3;
            if (length > 0) {
                for (let i = 0; i < length; i++) {
                    // html += '<div style="margin-bottom: 20px;padding:5px;border:1px solid #ddd">';
                    // html+='<img src="images/loading1.gif" data-src="/uploads/'+list[i].img+'"  style="height: 150px;width: 100%"   class="img-responsive">';
                    // html += '<img src="/uploads/' + list[i].img + '"  style="height: 150px;width: 100%"   class="img-responsive">';
                    html += '<div style="padding: 10px;border:1px solid #ddd;color: #666;margin-top: 10px;">';
                    html += '<a style="font-size: 18px;color: #666" href="/details?id=' + list[i]._id + '"<p>' + list[i].title.substring(0, 10) + '&nbsp;&nbsp;&nbsp;&nbsp;' + '</p></a>';
                    html += '<p>' + moment(list[i].create_at).fromNow() + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-heart-empty">&nbsp;赞' + list[i].zanCount + '</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open">&nbsp;' + list[i].view + '</span>&nbsp;&nbsp;</p>';
                    html += '</div>';
                    // html += '</div>';
                }
            } else {
                html += '<p class="text-center bg-warning">什么也没有~</p>'
            }

            $("#bestarticle").html(html);
        }
    })
}

getbestarticle();

function gethotarticle() {

    $.get('/article?hot=hot', function (data) {
        let list = data.doc;
        if (data.status == 1) {
            let html = '<h4 class="title">热门文章</h4>';
            let length = list.length <= 3 ? list.length : 3;
            if (length > 0) {
                for (let i = 0; i < length; i++) {
                    // html += '<div style="margin-bottom: 20px;padding:5px;border:1px solid #ddd">';
                    // html+='<img src="images/loading1.gif" data-src="/uploads/'+list[i].img+'" style="height: 150px;width: 100%"  class="img-responsive">';
                    // html += '<img src="/uploads/' + list[i].img + '" style="height: 150px;width: 100%"  class="img-responsive">';
                    html += '<div style="padding: 10px;border:1px solid #ddd;color: #666;margin-top: 10px;">';
                    html += '<a style="font-size: 18px;color: #666" href="/details?id=' + list[i]._id + '"<p>' + list[i].title.substring(0, 10) + '</p></a>';
                    html += '<p>' + moment(list[i].create_at).fromNow() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-heart-empty">&nbsp;赞' + list[i].zanCount + '</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open">' + list[i].view + '</span></p>';
                    html += '</div>';
                    // html += '</div>';
                }
            } else {
                html += '<p class="text-center bg-warning">什么也没有~</p>'
            }
            $("#hotarticle").html(html);
        }
    })
}

gethotarticle();

// searchArticle
var searchFlag = false;
function navSearchArticle() {

    let key = encodeURI(encodeURI($("#navArticleKey").val()));
    searchFlag = !searchFlag;
    if (key != '') {
        window.location.href = '/sort?key=' + key;
    } else {
        layer.msg("请输入文章标题!");
        // $("#navArticleKey").focus();
        return;
    }
}

// addcategory
function addcategory() {
    let params = {
        name: $("#categoryname").val(),
        path: $("#categorypath").val(),
        sort: $("#categorysort").val(),
        is_nav: $(".ifshow input:checked").val(),
        is_sys: $(".ifnavmain input:checked").val(),
    }
    $.post('/category/add', params, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#categoryname").val('');
        $("#categorypath").val('');
        $("#categorysort").val('');
        $("#addcategoryModal").modal('hide');
        getcategorylist();
        getcategoryInfoList();
    })
}

// updataPassword
function addcategory() {
    let params = {
        name: $("#categoryname").val(),
        path: $("#categorypath").val(),
        sort: $("#categorysort").val(),
        is_sys: $(".ifshow input:checked").val(),
        is_nav: $(".ifnavmain input:checked").val(),
        user_id: "用户ID000"
    }
    $.post('/category/add', params, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#categoryname").val('');
        $("#categorypath").val('');
        $("#categorysort").val('');
        $(".ifshow input:checked").val('');
        $(".ifnavmain input:checked").val('');
        $("#addcategoryModal").modal('hide');

        getcategorylist();
    })
}

// updataarticle
function updatearticle() {

    let id = $("#article_id").val();
    let params = {
        title: $("#articletitle").val(),
        author: $("#articleauthor").val(),
        is_jing: $(".articleisjing input:checked").val(),
        category_id: $("#singlearticlecategory").val(),
        content: $("#articlecontent").val(),
    }
    $.post('/article/update/' + id, params, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#articletitle").val('');
        $("#articleauthor").val('');
        $("#articlecontent").val('');
        $("#article_id").val('');
        $("#updatearticleModal").modal('hide');
        getarticlelist();
    })
}

// updatacategory
function updatecategory() {

    let _id = $("#hidden").val();
    $.post('/category/update/' + _id, {
        name: $("#updatacategoryname").val(),
        path: $("#updatacategorypath").val(),
        sort: $("#updatacategorysort").val(),
        user_id: "用户ID000",
        is_nav: $(".getifshow >input:checked").val(),
        is_sys: $(".getifnavmain >input:checked").val()
    }, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#updatacategoryname").val('');
        $("#updatacategorypath").val('');
        $("#updatacategorysort").val('');
        $("#hidden").val('');
        $("#updatecategoryModal").modal('hide');

        getcategorylist();
        getcategoryInfoList();
    })
}

// updatauserInfo
function updatasingleuserInfo() {

    let params = {
        username: $("#singleUserusername").val(),
        password: $("#singleUserpassword").val(),
        nickname: $("#singleUsernickname").val(),
        position: $("#singleUserposition").val(),
        tel: $("#singleUsertel").val(),
        articleAdmin: $("#articleAdmin").is(':checked'),
        categoryAdmin: $("#categoryAdmin").is(':checked'),
        userAdmin: $("#userAdmin").is(':checked'),
        rootAdmin: $("#rootAdmin").is(':checked')
    };
    let id = $("#singleuser_id").val();
    $.post('/user/adminupdatasingleuserInfo/' + id, params, function (data) {
        let result = data;
        layer.msg(result.msg);
        $("#singleUserusername").val('');
        $("#singleUserpassword").val('');
        $("#singleUsernickname").val('');
        $("#singleUserposition").val('');
        $("#singleUsertel").val('');
        $("#updatauserInfoModal").modal('hide');
        getuserlist();
        $("#singleuser_id").val('');
    })
}

// 页面滚动监听
// $(window).scroll(function(){
// // 滚动条距离顶部的距离 大于300px时
// //     console.log($(window).scrollTop())
//     if($(window).scrollTop() >= 50){
//         $("#navbar").css({'height':"70px","lineHeight":"70px","transition":"0.5s","fontSize":"16px"});
//     } else{
//         $("#navbar").css({'height':"","lineHeight":"","fontSize":""});
//     }
// });

$("#search input").focus(function () {
    $("#search input").css({'width': "200px"})
})
$("#search input").focusout(function () {
    $("#search input").css({'width': "100px"})
})

// 图片加载失败
function nofind(_this) {
    _this.src = "/images/imgErr.jpg";
    _this.onerror = null;
}
