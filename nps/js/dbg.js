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
        $(".showPrice").css('display', "");
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

! function() {
    //封装方法，压缩之后减少文件大小
    function get_attribute(node, attr, default_value) {
        return node.getAttribute(attr) || default_value;
    }
    //封装方法，压缩之后减少文件大小
    function get_by_tagname(name) {
        return document.getElementsByTagName(name);
    }
    //获取配置参数
    function get_config_option() {
        var scripts = get_by_tagname("script"),
            script_len = scripts.length,
            script = scripts[script_len - 1]; //当前加载的script
        return {
            l: script_len, //长度，用于生成id用
            z: get_attribute(script, "zIndex", -1), //z-index
            o: get_attribute(script, "opacity", 0.5), //opacity
            c: get_attribute(script, "color", "0,0,0"), //color
            n: get_attribute(script, "count", 99) //count
        };
    }
    //设置canvas的高宽
    function set_canvas_size() {
        canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    //绘制过程
    function draw_canvas() {
        context.clearRect(0, 0, canvas_width, canvas_height);
        //随机的线条和当前位置联合数组
        var e, i, d, x_dist, y_dist, dist; //临时节点
        //遍历处理每一个点
        random_lines.forEach(function(r, idx) {
            r.x += r.xa,
                r.y += r.ya, //移动
                r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1,
                r.ya *= r.y > canvas_height || r.y < 0 ? -1 : 1, //碰到边界，反向反弹
                context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); //绘制一个宽高为1的点
            //从下一个点开始
            for (i = idx + 1; i < all_array.length; i++) {
                e = all_array[i];
                //不是当前点
                if (null !== e.x && null !== e.y) {
                    x_dist = r.x - e.x, //x轴距离 l
                        y_dist = r.y - e.y, //y轴距离 n
                        dist = x_dist * x_dist + y_dist * y_dist; //总距离, m
                    dist < e.max && (e === current_point && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), //靠近的时候加速
                        d = (e.max - dist) / e.max,
                        context.beginPath(),
                        context.lineWidth = d / 2,
                        context.strokeStyle = "rgba(" + config.c + "," + (d + 0.2) + ")",
                        context.moveTo(r.x, r.y),
                        context.lineTo(e.x, e.y),
                        context.stroke());
                }
            }
        }), frame_func(draw_canvas);
    }
    //创建画布，并添加到body中
    var the_canvas = document.createElement("canvas"), //画布
        config = get_config_option(), //配置
        canvas_id = "c_n" + config.l, //canvas id
        context = the_canvas.getContext("2d"), canvas_width, canvas_height,
        frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {
            window.setTimeout(func, 1000 / 45);
        }, random = Math.random,
        current_point = {
            x: null, //当前鼠标x
            y: null, //当前鼠标y
            max: 20000
        },
        all_array;
    the_canvas.id = canvas_id;
    the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    get_by_tagname("body")[0].appendChild(the_canvas);
    //初始化画布大小

    set_canvas_size(), window.onresize = set_canvas_size;
    //当时鼠标位置存储，离开的时候，释放当前位置信息
    window.onmousemove = function(e) {
        e = e || window.event, current_point.x = e.clientX, current_point.y = e.clientY;
    }, window.onmouseout = function() {
        current_point.x = null, current_point.y = null;
    };
    //随机生成config.n条线位置信息
    for (var random_lines = [], i = 0; config.n > i; i++) {
        var x = random() * canvas_width, //随机位置
            y = random() * canvas_height,
            xa = 2 * random() - 1, //随机运动方向
            ya = 2 * random() - 1;
        random_lines.push({
            x: x,
            y: y,
            xa: xa,
            ya: ya,
            max: 12000 //沾附距离
        });
    }
    all_array = random_lines.concat([current_point]);
    //0.1秒后绘制
    setTimeout(function() {
        draw_canvas();
    }, 100);
}();

(function(window,document,undefined){
    var hearts = [];
    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback){
                setTimeout(callback,1000/60);
            }
    })();
    init();
    function init(){
        css(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: absolute;}.heart:after{top: -5px;}.heart:before{left: -5px;}");
        attachEvent();
        gameloop();
    }
    function gameloop(){
        for(var i=0;i<hearts.length;i++){
            if(hearts[i].alpha <=0){
                document.body.removeChild(hearts[i].el);
                hearts.splice(i,1);
                continue;
            }
            hearts[i].y--;
            hearts[i].scale += 0.004;
            hearts[i].alpha -= 0.013;
            hearts[i].el.style.cssText = "left:"+hearts[i].x+"px;top:"+hearts[i].y+"px;opacity:"+hearts[i].alpha+";transform:scale("+hearts[i].scale+","+hearts[i].scale+") rotate(45deg);background:"+hearts[i].color;
        }
        requestAnimationFrame(gameloop);
    }
    function attachEvent(){
        var old = typeof window.onclick==="function" && window.onclick;
        window.onclick = function(event){
            old && old();
            createHeart(event);
        }
    }
    function createHeart(event){
        var d = document.createElement("div");
        d.className = "heart";
        hearts.push({
            el : d,
            x : event.clientX - 5,
            y : event.clientY - 5,
            scale : 1,
            alpha : 1,
            color : randomColor()
        });
        document.body.appendChild(d);
    }
    function css(css){
        var style = document.createElement("style");
        style.type="text/css";
        try{
            style.appendChild(document.createTextNode(css));
        }catch(ex){
            style.styleSheet.cssText = css;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    function randomColor(){
        return "rgb("+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")";
    }
})(window,document);