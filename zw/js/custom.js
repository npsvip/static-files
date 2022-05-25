// preloader
$(window).load(function () {
    $('.preloader').fadeOut(1000); // set duration in brackets    
});

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function imageRecognition() {
    var url = $("#url").val();
    var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (!reg.test(url)) {
        $('#result').html(syntaxHighlight({"code": 500, "msg": "请输入http或https开头的图片网址！"}));
        return;
    }
    $('#result').html(syntaxHighlight({"msg": "文件上传分析中……"}));
    $.ajax({
        type: "get",
        url: "/image/test/recognition?url=" + url, //url
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            if (result.code == 0) {
                $('#result').html(syntaxHighlight(result));
            } else {
                // alert(result.msg);
                $('#result').html(syntaxHighlight(result));
            }
        }
    });
}

function lcensePlateRecognition() {
    var url = $("#lcensePlateUrl").val();
    var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (!reg.test(url)) {
        $('#lcensePlateResult').html(syntaxHighlight({"code": 500, "msg": "请输入http或https开头的图片网址！"}));
        return;
    }
    $('#lcensePlateResult').html(syntaxHighlight({"msg": "文件上传分析中……"}));
    $.ajax({
        type: "get",
        url: "/ocr/test/lcensePlate/recognition?urlflag=" + encodeURI(url), //url
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            console.log(result)
            if (result.code == 0) {
                $('#lcensePlateResult').html(syntaxHighlight(result));
            } else {
                // alert(result.msg);
                $('#lcensePlateResult').html(syntaxHighlight(result));
            }
        }
    });
}

function wzRecognition() {
    $.ajax({
        type: "get",
        url: "/ocr/test/recognition", //url
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            if (result.code == 0) {
                window.open(result.msg);
            }
        }
    });
}

function submitForm() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/message/save",
        data: $('#message').serialize(),
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if (result.code == 0) {
                alert("发送成功！");
            } else {
                alert(result.msg);
            }
        },
        error: function () {
            alert("异常！");
        }
    });
}

$(function () {
    new WOW().init();
    $('.templatemo-nav').singlePageNav({
        offset: 70
    });

    /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function () {
        $(".navbar-collapse").collapse('hide');
    });
    $('#result').html(syntaxHighlight({"code": 500, "msg": "请输入图片地址"}));
    $('#lcensePlateResult').html(syntaxHighlight({"code": 500, "msg": "请输入图片地址"}));

})