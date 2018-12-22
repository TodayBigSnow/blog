
$('#site-landing').polygonizr();
$("#login").click(function () {

    let username = $("#username").val();
    let password = $("#password").val();
    let sevenday=$("#sevenday").is(':checked');
    $.post('/user/loginTest', {
        username: username,
        password: password,
        sevenday:sevenday
    }, function (data) {
        let result = data;
        layer.msg(result.msg)
        if (result.status === 1) {
            // 登录成功 -- 路由跳转
            setInterval(function () {
                window.location.href = '/';
            }, 800)
        }
    })
})