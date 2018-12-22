$('#site-landing').polygonizr();

$("#registerSubmit").click(function () {

    let username = $("#username").val();
    let password = $("#password").val();
    let repassword = $("#repassword").val();
    let watchInfo = $("#importantInfo").is(':checked');
    let params={
        username: username,
        password: password,
        repassword: repassword,
        watchInfo: watchInfo
    }
    // 注册验证
    $.post('/user/registerTest', params, function (data) {
        let result = data;
        if (result.status==0){
            layer.msg(result.msg)
        }
        // 注册验证成功
        if (result.status == 1) {
            $.post('/user/addInfo', {
                username: username,
                password: password
            }, function (data) {
                let result=data;
                layer.msg(result.msg)
                // 注册成功 -- 路由跳转
                setInterval(function () {
                    window.location.href = '/login';
                }, 1500)
            })
        }
    })
})