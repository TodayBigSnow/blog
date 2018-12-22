$(document).ready(function () {
    $("#myul> li").click(function () {
        var index = $(this).index();
        $("#myul >li").eq(index).find('div').addClass('ulfocus').parent().siblings().find('div').removeClass('ulfocus');
        $("#myol >li").eq(index).addClass('olfocus').siblings().removeClass('olfocus');
    })
})

// 关键字搜索
function findArticle() {
    getarticlelist();
}

function findUser() {
    getuserlist();
}

// 获取文章列表信息
function getarticlelist(page) {

    if (!page) {
        let page = 1;
    }
    let getartivlelisturl = '/article?limit=4';
    if (page) {
        getartivlelisturl = '/article?limit=4&page=' + page
    }
    let key = $("#articleKey").val();
    if (key != '') {
        getartivlelisturl = '/article?limit=4&key=' + key;
        if (page) {
            getartivlelisturl = '/article?limit=4&page=' + page + '&key=' + key;
        }
    }

    $.get(getartivlelisturl, function (data) {
        // 文章列表
        let list = data.doc;
        // 当前页
        let nowPage = parseInt(data.nowPage);
        // 总页数
        let totalPage = data.totalPage;

        if (data.status == 1) {
            let html = '';
            if (list.length >= 1) {
                html = '<table class="table table-bordered table-hover table-striped text-center" style="background-color: #fff;"> '
                html += '<tr><td>图片</td><td>标题</td><td>作者</td><td>阅读量</td><td>发布时间</td><td>操作</td></tr>';
                for (let i = 0; i < list.length; i++) {
                    html += '<tr>';
                    html += '<td class="text-center"><img src="/uploads/' + list[i].img + '" style="height: 30px;width: 100px;display: inline-block;" class="img-responsive" onerror="nofind(this)"></td>';
                    html += '<td>' + list[i].title + '</td>';
                    html += '<td>' + list[i].author + '</td>';
                    html += '<td>' + list[i].view + '</td>';
                    html += '<td>' + moment(list[i].create_at).format('LL') + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-xs btn-primary"  data-toggle="modal" data-target="#updatearticleModal"  onclick="getSingleArticle(\'' + list[i]._id + '\')">编辑</button>&nbsp;&nbsp;';
                    html += '<button class="btn btn-xs btn-danger" onclick="deleteArticle(\'' + list[i]._id + '\')">删除</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</table>';
                let pre = (nowPage - 1) <= 1 ? 1 : (nowPage - 1);
                let next = (nowPage + 1) >= totalPage ? totalPage : (nowPage + 1);
                if (totalPage >= 1) {
                    html += '<nav class="pagination">';
                    if (totalPage > 1 && nowPage > 1) {
                        html += '<span class="page-number" onclick="getarticlelist(' + parseInt(nowPage - 1) + ')"><i class="fa fa-angle-left"></i></span>';
                    }
                    html += '<span class="page-number">第 ' + nowPage + ' 页 / 共' + totalPage + ' 页</span>';
                    if (totalPage > 1 && nowPage < totalPage) {
                        html += '<span class="page-number" onclick="getarticlelist(' + parseInt(nowPage + 1) + ')"><i class="fa fa-angle-right"></i></span>'
                    }
                    html += '</nav>'
                }
            } else {
                html += '<div class="text-center bg-warning"><p>一条数据都没有(╯▽╰)，快去发布文章吧~~</p></div>';
            }

            $("#articletable").html(html);
        }
    })
}

function getSingleArticle(_id) {
    let id = _id;
    $.get('/article/single?id=' + id, function (data) {
        let result = data.result;
        $("#articletitle").val(result.title);
        $("#articleauthor").val(result.author);
        let isjing = '<p>是否精选</p>';
        if (result.is_jing == 1) {
            isjing += '<label class="radio-inline articleisjing"><input type="radio" name="articleisjing" value="1" checked> 是 </label>'
            isjing += '<label class="radio-inline articleisjing"><input type="radio" name="articleisjing" value="0"> 否 </label>'
        } else {
            isjing += '<label class="radio-inline articleisjing"><input type="radio" name="articleisjing" value="1"> 是 </label>'
            isjing += '<label class="radio-inline articleisjing"><input type="radio" name="articleisjing" value="0" checked> 否 </label>'
        }
        $("#articleisjing").html(isjing);
        $("#articlecontent").val(result.content);
        $.get('/category', function (data) {
            let list = data.doc;
            let html = '<option>默认</option>';
            if (data.status == 1) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].is_sys == 0 && list[i].is_nav == 1) {
                        if (list[i]._id == result.category_id) {
                            html += '<option value="' + list[i]._id + '" selected="selected">' + list[i].name + '</option>'
                        } else {
                            html += '<option value="' + list[i]._id + '">' + list[i].name + '</option>'
                        }
                    }
                }
            }
            $("#singlearticlecategory").html(html);
        })
        $("#article_id").val(id);
    })
}

// 获取分类信息
function getcategorylist(page) {
    if (!page) {
        let page = 1;
    }
    let getcategorylisturl = '/category?limit=4';
    if (page) {
        getcategorylisturl = '/category?limit=4&page=' + page;
    }
    $.get(getcategorylisturl, function (data) {
        // 分类列表
        let list = data.doc;
        // 当前页
        let nowPage = parseInt(data.nowPage);
        // 总页数
        let totalPage = data.totalPage;
        if (data.status == 1) {
            let html = '';
            if (list.length >= 1) {
                html = '<table class="table table-bordered table-hover table-striped text-center" style="background-color: #fff;margin-top:10px;">'
                html += '<tr><td>名称</td><td>路径</td><td>优先级</td><td>是否显示</td><td>系统分栏</td><td>操作</td></tr>';
                for (let i = 0; i < list.length; i++) {
                    html += '<tr>';
                    html += '<td>' + list[i].name + '</td>';
                    html += '<td>' + list[i].path + '</td>';
                    html += '<td>' + list[i].sort + '</td>';
                    html += '<td>' + list[i].is_nav + '</td>';
                    html += '<td>' + list[i].is_sys + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#updatecategoryModal" onclick="getcategorysingle(\'' + list[i]._id + '\')">编辑</button>&nbsp;&nbsp';
                    html += '<button class="btn btn-xs btn-danger" onclick="deleteCategory(\'' + list[i]._id + '\')">删除</button>';
                    html += '</td>';
                    html += '</tr>';
                }
                html += '</table>';
                let pre = (nowPage - 1) <= 1 ? 1 : (nowPage - 1);
                let next = (nowPage + 1) >= totalPage ? totalPage : (nowPage + 1);
                if (totalPage >= 1) {
                    html += '<nav class="pagination">';
                    if (totalPage > 1 && nowPage > 1) {
                        html += '<span class="page-number" onclick="getcategorylist(' + parseInt(nowPage - 1) + ')"><i class="fa fa-angle-left"></i></span>';
                    }
                    html += '<span class="page-number">第 ' + nowPage + ' 页 / 共' + totalPage + ' 页</span>';
                    if (totalPage > 1 && nowPage < totalPage) {
                        html += '<span class="page-number" onclick="getcategorylist(' + parseInt(nowPage + 1) + ')"><i class="fa fa-angle-right"></i></span>'
                    }
                    html += '</nav>'
                }
            } else {
                html += '<div class="text-center bg-warning"><p>一条数据都没有(╯▽╰)，快去分类发布文章吧~~</p></div>';
            }
            $("#categorytable").html(html);
        }
    })
}

function getcategorysingle(_id) {
    let id = _id;
    $.get('/category/single/' + id, function (data) {
        let result = data.doc
        $("#updatacategoryname").val(result.name)
        $("#updatacategorypath").val(result.path)
        $("#updatacategorysort").val(result.sort)
        let html = '<p>是否显示在导航</p>';
        if (result.is_nav == 1) {
            html += '<label class="radio-inline getifshow"><input type="radio" name="getifshow" value="1" checked> 是 </label>'
            html += '<label class="radio-inline getifshow"><input type="radio" name="getifshow" value="0"> 否 </label>'
        } else {
            html += '<label class="radio-inline getifshow"><input type="radio" name="getifshow" value="1"> 是 </label>'
            html += '<label class="radio-inline getifshow"><input type="radio" name="getifshow" value="0" checked> 否 </label>'
        }
        html += '<p>是否作为系统分栏</p>';
        if (result.is_sys == 1) {
            html += '<label class="radio-inline getifnavmain"><input type="radio" name="getifnavmain" value="1" checked> 是 </label>'
            html += '<label class="radio-inline getifnavmain"><input type="radio" name="getifnavmain" value="0"> 否 </label>'
        } else {
            html += '<label class="radio-inline getifnavmain"><input type="radio" name="getifnavmain" value="1"> 是 </label>'
            html += '<label class="radio-inline getifnavmain"><input type="radio" name="getifnavmain" value="0" checked> 否 </label>'
        }
        $("#ifnav").html(html);

        $("#hidden").val(result._id)
    })
}

// 获取用户列表
function getuserlist(page) {

    if (!page) {
        let page = 1;
    }
    let getuserlisturl = '/user/getAllInfo?limit=4';
    if (page) {
        getuserlisturl = '/user/getAllInfo?limit=4&page=' + page;
    }
    let key = $("#userKey").val();

    if (key != '') {
        getuserlisturl = '/user/getAllInfo?limit=4&key=' + key;
        if (page) {
            getuserlisturl = '/user/getAllInfo?limit=4&page=' + page + '&key=' + key;
        }
    }
    $.get(getuserlisturl, function (data) {
        // 分类列表
        let list = data.doc;
        // 当前页
        let nowPage = parseInt(data.nowPage);
        // 总页数
        let totalPage = data.totalPage;
        if (data.status == 1) {
            let html = '';
            if (list.length >= 1) {
                html = '<table class="table table-bordered table-hover table-striped text-center" style="background-color: #fff;"> '
                html += '<tr><td>用户名</td><td>昵称</td><td>联系方式</td><td>操作</td></tr>';
                for (let i = 0; i < list.length; i++) {
                    html += '<tr>';
                    html += '<td>' + list[i].username + '</td>';
                    html += '<td>' + list[i].nickname + '</td>';
                    html += '<td>' + list[i].tel + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-xs btn-primary"  data-toggle="modal" data-target="#updatauserInfoModal"  onclick="getSingleuser(\'' + list[i]._id + '\')">编辑</button>&nbsp;&nbsp;';
                    html += '<button class="btn btn-xs btn-danger" onclick="deleteuser(\'' + list[i]._id + '\')">删除</button>';
                    html += '</tr>';
                }
                html += '</table>';
                let pre = (nowPage - 1) <= 1 ? 1 : (nowPage - 1);
                let next = (nowPage + 1) >= totalPage ? totalPage : (nowPage + 1);
                if (totalPage >= 1) {
                    html += '<nav class="pagination">';
                    if (totalPage > 1 && nowPage > 1) {
                        html += '<span class="page-number" onclick="getuserlist(' + parseInt(nowPage - 1) + ')"><i class="fa fa-angle-left"></i></span>';
                    }
                    html += '<span class="page-number">第 ' + nowPage + ' 页 / 共' + totalPage + ' 页</span>';
                    if (totalPage > 1 && nowPage < totalPage) {
                        html += '<span class="page-number" onclick="getuserlist(' + parseInt(nowPage + 1) + ')"><i class="fa fa-angle-right"></i></span>'
                    }
                    html += '</nav>'
                }
            } else {
                html += '<div class="text-center bg-warning"><p>一个人都没有(╯▽╰)，无敌是多么寂寞吧~~</p></div>';
            }
            $("#userlisttable").html(html);
        }
    })
}

function getSingleuser(_id) {
    let id = _id;
    $.get('/user/getSingleInfo/' + id, function (data) {
        let result = data.doc;
        $("#singleuser_id").val(result._id);
        $("#singleUserusername").val(result.username);
        $("#singleUserpassword").val(result.password);
        $("#singleUsernickname").val(result.nickname);
        $("#singleUserposition").val(result.position);
        $("#singleUsertel").val(result.tel);
        let singleUser = '<p>用户权限</p>';
        if (result.admin.articleAdmin) {
            singleUser += '<label class="checkbox-inline"><input id="articleAdmin" type="checkbox" checked> 管理文章 </label>'
        } else {
            singleUser += '<label class="checkbox-inline"><input id="articleAdmin" type="checkbox"> 管理文章 </label>'
        }
        if (result.admin.categoryAdmin) {
            singleUser += '<label class="checkbox-inline"><input id="categoryAdmin" type="checkbox" checked> 管理分类 </label>'
        } else {
            singleUser += '<label class="checkbox-inline"><input id="categoryAdmin" type="checkbox"> 管理分类 </label>'
        }
        if (result.admin.userAdmin) {
            singleUser += '<label class="checkbox-inline"><input id="userAdmin" type="checkbox" checked> 管理用户 </label>'
        } else {
            singleUser += '<label class="checkbox-inline"><input id="userAdmin" type="checkbox"> 管理用户 </label>'
        }
        if (result.admin.rootAdmin) {
            singleUser += '<label class="checkbox-inline"><input id="rootAdmin" type="checkbox" checked> 超级管理员 </label>'
        } else {
            singleUser += '<label class="checkbox-inline"><input id="rootAdmin" type="checkbox"> 超级管理员 </label>'
        }

        $("#useradminlist").html(singleUser)

    })
}

function deleteuser(_id) {

    layer.confirm('确认删除该用户信息吗？', {
        btn: ['确定', '取消']
    }, function () {
        let id = _id;
        $.get('/user/deleteInfo/' + id, function (data) {
            layer.msg(data.msg);
            getuserlist();
        })
    })
}

<!--删除分类-->
function deleteCategory(_id) {
    layer.confirm('确认删除该分类吗？', {
        btn: ['确定', '取消']
    }, function () {
        let id = _id;
        $.get('/category/delete/' + id, function (data) {
            layer.msg(data.msg);
            getcategorylist();
            getcategoryInfoList();
        })
    })
}

<!--删除文章-->
function deleteArticle(_id) {
    layer.confirm('确认删除该文章吗？', {
        btn: ['确定', '取消']
    }, function () {
        let id = _id;
        $.get('/article/delete/' + id, function (data) {
            layer.msg(data.msg);
            getarticlelist();
        })
    })
}

function changePassword() {
    let oldpass = $("#oldpass").val();
    let newpass = $("#newpass").val();
    let renewpass = $("#renewpass").val();
    let user_id = $("#user_id").val();
    let user_pass = $("#user_pass").val();
    if (oldpass == '') {
        layer.msg('请输入原密码！')
    } else {
        if (oldpass != user_pass) {
            layer.msg('原密码错误！')
        } else {
            if (newpass == '') {
                layer.msg('请输入新密码！')
            } else {
                if (renewpass == '') {
                    layer.msg('请再次输入新密码！')
                } else {
                    if (newpass != renewpass) {
                        layer.msg('两次密码不一致！')
                    } else {
                        $.post('/user/updatePass/' + user_id + '', {password: newpass}, function (data) {
                            layer.msg(data.msg);
                            $("#oldpass").val('');
                            $("#newpass").val('');
                            $("#renewpass").val('');
                            if (data.status == 1) {
                                setInterval(function () {
                                    window.location.href = '/login'
                                }, 1000)
                            }
                        })
                    }
                }
            }
        }
    }
}