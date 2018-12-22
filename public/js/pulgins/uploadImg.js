//图片上传预览
    function viewImg(file) {
        var prevDiv = document.getElementById('view');
        if (file.files && file.files[0]) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                prevDiv.innerHTML = '<div style="background-color:#fff;width:100%;height:100%"><img src="' + evt.target.result + '" style="width:100%;height:100%"/></div>';
            }
            reader.readAsDataURL(file.files[0]);
        } else {
            prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
        }
    }

