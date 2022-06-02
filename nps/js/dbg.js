var baseUrl = '';
// var baseUrl = '/web';

$(function () {
    getSettingsList(function () {
        changeSetting()
    })

    setInterval(function () {
        check()
    }, 4000);
    var check = function () {
        function doCheck(a) {
            if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
                (function () {
                }
                    ["constructor"]("debugger")())
            } else {
                (function () {
                }
                    ["constructor"]("debugger")())
            }
            doCheck(++a)
        }

        try {
            doCheck(0)
        } catch (err) {
        }
    };
    check();
})

function changeSetting() {
    let settingsList = JSON.parse(sessionStorage.getItem('settingsList'))
    let logo = settingsList.find(item => item.code === 'logo')
    let groupUrl = settingsList.find(item => item.code === 'qqqun').value
    // 改群二维码图片地址
    groupUrl ? $('.qq-group').attr('src', groupUrl) : ''
    // 改logo图片地址
    if (logo.value) {
        $('#logo').attr('src', logo.value)
        $('.header-small-icon').attr('href', logo.value)
    }
    if ('1' === sessionStorage.getItem('showPrice')) {
        $(".showPrice").css('display', "inline");
    } else {
        $(".showPrice").css('display', "none");
    }
    // 改meta信息
    $('meta[name="author"]').attr('content', settingsList.find(item => item.code === 'author').value)
    $('meta[name="description"]').attr('content', settingsList.find(item => item.code === 'description').value)
    $('meta[name="keywords"]').attr('content', settingsList.find(item => item.code === 'keywords').value)
    // 公安备案文案
    $('.footer-beian').html(settingsList.find(item => item.code === 'yuming').value)
    $('.footer-gongan').html(settingsList.find(item => item.code === 'gongan').value)
    let gonganid = settingsList.find(item => item.code === "gonganid").value
    let gonganurl = `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${gonganid ? gonganid : '33010602011671'}`
    $('.gongan-link').attr('href', gonganurl)
    $('.gongan-link').attr("disabled", true).css("pointer-events", "none");
    // $('.footer-beian').attr("disabled",true).css("pointer-events","none");
    // $('.gongan-link').attr('href', "javascript:void(0);")
    // qq客服
    let qq = settingsList.find(item => item.code === 'qq').value
    let qqurl = qq ? qq : `tencent://message/?uin=1163363720&amp;Menu=yes&amp;Service=300&amp;sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`
    $('.chat-qq').attr('href', qqurl)
    let qqgroup = settingsList.find(item => item.code === 'qqqun.fast').value
    let qqgroupurl = 'https://qm.qq.com/cgi-bin/qm/qr?k=' + (qqgroup ? qqgroup : 'My1ghEmV73WgzXP7P-2Y4LuEYer4eFZs') + '&jump_from=webapi'
    $('.chat-qq-group').attr('href', qqgroupurl)
    $('.documentTitle').html(settingsList.find(item => item.code === 'title').value)

    $('.prize-chat-qq-group').attr('href', qqgroupurl)
}

function getSettingsList(cb) {
    $.ajax({
        type: "get",
        url: baseUrl + "/nps/settings/list?host=" + location.host, //url
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            if (result.msg === "success") {
                let settingsList = result.data
                sessionStorage.setItem('settingsList', JSON.stringify(settingsList));
                sessionStorage.setItem('showPrice', result.showPrice);
                cb && cb()
            }
        }
    });
}

var interval;
$(window).on('blur', function () {
    interval = setInterval("changeText()", 500);
});

$(window).on('focus', function () {
    clearInterval(interval);
    let settingsList = JSON.parse(sessionStorage.getItem('settingsList'))
    $(".documentTitle").html(settingsList.find(item => item.code === 'title').value);
});

function changeText() {
    var text = "⌇●﹏●⌇ 别急着走啊～|( ๑´•ω•) 不再考虑下么～|(ㆆᴗㆆ) 我们团队非常腻害的～|(/ω＼)不会有比我们更合适的了！|⌇●﹏●⌇有疑问可以联系管理员哦" +
        "|(ㆆᴗㆆ) 我们的用户遍布全国～|(/ω＼) 高速稳定、性价比高";
    text = text.split("|");
    $(".documentTitle").html(text[parseInt(Math.random() * text.length)]);
}