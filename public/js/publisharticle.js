var E = window.wangEditor;
var editor = new E('#editor');
editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
editor.customConfig.uploadFileName = 'img';

var $tex = $('#tex');
editor.customConfig.onchange = function (html) {
    // 监控变化，同步更新到 textarea
    $tex.val(html)
};
editor.create();
// 初始化 textarea 的值
$tex.val(editor.txt.html());

// 获取分类信息
function publishcategorylist() {
    $.get('/category', function (data) {
        let list = data.doc;
        let html = '<option>默认</option>';
        if (data.status == 1) {
            for (let i = 0; i < list.length; i++) {
                if(list[i].is_nav==1 &&list[i].is_sys==0){
                    html += '<option value="'+list[i]._id+'">' + list[i].name + '</option>'
                }
            }
        }
        $("#selectsort").html(html);
    })
}
publishcategorylist();