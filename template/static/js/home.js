window.getpicSms = function () {
    $(".captchaPic").attr("src", config.url + "/api/captcha.jpg");
};

let validate = function (dom, fields) {
    $(dom).data("bootstrapValidator").resetField(fields);
    const is = $(dom).data("bootstrapValidator").validateField(fields).isValidField(fields);
    return is;
};
window.getUserInfo = function () {
    userInfoApi().then((res) => {
        if (res.code == 0) {
            let obj = JSON.parse(localStorage.getItem("user"));
            obj.userInfo.openTime = res.data.openTime;
            obj.userInfo.downTimes = res.data.downTimes;
            localStorage.setItem("user", JSON.stringify(obj));
        }
    });
};
window.getSms = function (e) {
    if (!validate("#register-form", "email")) return;
    if (!validate("#register-form", "captcha")) return;
    let params = {};
    $("#register-form")
        .serializeArray()
        .forEach((item) => {
            if (item.value) {
                if (item.name == "email") {
                    params.mail = item.value;
                } else if (item.name == "captcha") {
                    params.captcha = item.value;
                }
            }
        });
    sendMailApi(params).then((res) => {
        if (res.code === 0) {
            $("#register-form").data("bootstrapValidator").resetField("email");
            $("#register-form").data("bootstrapValidator").resetField("captcha");
            const nextdom = $(e.target).next();
            $(e.target).hide();
            nextdom.show();
            let s = 30;
            let time = null;
            time = setInterval(() => {
                s--;
                nextdom.text(s + "秒后重新获取");
                if (s === 0) {
                    $(e.target).show();
                    nextdom.hide();
                    clearInterval(time);
                    nextdom.text("30s重新获取");
                }
            }, 1000);
        } else {
            layer.msg(res.msg, {icon: 5, anim: 6});
            getpicSms();
        }
    });
};

function detailInfo(id) {
    if (undefined != config.loginInfo.userInfo) {
        window.location.href = "single.html?id=" + id + "&userId=" + config.loginInfo.userInfo.userId;
    } else {
        window.location.href = "single.html?id=" + id;
    }
}

// 获取模板列表
function getTemplateList(obj) {
    if (null == obj) {
        obj = {};
        // 赋值
        if (undefined != localStorage.getItem('classificationId') && 'null' != localStorage.getItem('classificationId') && '' != localStorage.getItem('classificationId')) {
            obj.classificationId = localStorage.getItem('classificationId');
            config.classParams['classificationId'] = localStorage.getItem('classificationId');

            // 标题分类效果
            $(".layui-nav-item").each(function (index, item) {
                if (item.innerText == config.classification.find((row) => row.id == obj.classificationId).name) {
                    $(".layui-nav-item").removeClass("layui-this");
                    $(item).addClass("layui-this");
                }
            });
            // 展开分类效果
            $(`.classification .class-span`).each(function (index, item) {
                if (obj.classificationId == item.getAttribute("data-id")) {
                    $(item).css("color", "");
                    item.style.color = "#3db389";
                }
            });
        }
        if (undefined != localStorage.getItem('colorId') && 'null' != localStorage.getItem('colorId') && '' != localStorage.getItem('colorId')) {
            obj.colorId = localStorage.getItem('colorId');
            config.classParams['colorId'] = localStorage.getItem('colorId');

            $(`.color .class-span`).each(function (index, item) {
                if (obj.colorId == item.getAttribute("data-id")) {
                    $(item).css("color", "");
                    item.style.color = "#3db389";
                }
            });
        }
        if (undefined != localStorage.getItem('tagId') && 'null' != localStorage.getItem('tagId') && '' != localStorage.getItem('tagId')) {
            obj.tagId = localStorage.getItem('tagId');
            config.classParams['tagId'] = localStorage.getItem('tagId');

            $(`.tag .class-span`).each(function (index, item) {
                if (obj.tagId == item.getAttribute("data-id")) {
                    $(item).css("color", "");
                    item.style.color = "#3db389";
                }
            });
        }
        if (undefined != localStorage.getItem('name') && 'null' != localStorage.getItem('name') && '' != localStorage.getItem('name')) {
            obj.name = localStorage.getItem('name');
            config.classParams['name'] = localStorage.getItem('name');

            $('#searchInput').val(obj.name);
        }
        if (undefined != localStorage.getItem('current') && 'null' != localStorage.getItem('current') && '' != localStorage.getItem('current')) {
            obj.current = localStorage.getItem('current');
            config.classParams['current'] = localStorage.getItem('current');
        }
        if (undefined != localStorage.getItem('size') && 'null' != localStorage.getItem('size') && '' != localStorage.getItem('size')) {
            obj.size = localStorage.getItem('size');
            config.classParams['size'] = localStorage.getItem('size');
        }

    }

    let params = {
        classificationId: null,
        colorId: null,
        current: 1,
        name: "",
        size: 20,
        tagId: null,
        ...obj
    };

    // 缓存搜索条件，返回时增强用户体验
    localStorage.setItem('classificationId', params.classificationId);
    localStorage.setItem('colorId', params.colorId);
    localStorage.setItem('tagId', params.tagId);
    localStorage.setItem('name', params.name);
    localStorage.setItem('current', params.current);
    localStorage.setItem('size', params.size);

    layui.use("laypage", function () {
        var laypage = layui.laypage;
        templatePage(params).then((res) => {
            let htmlStr = "";
            let a = [],
                b = [];
            for (let i = 0; i <= 1000; i++) {
                a.push(3 + 4 * i);
                b.push(4 + 5 * i);
            }
            if (res.data.records.length > 0) {
                res.data.records.forEach((item, index) => {
                    htmlStr += `
                <article class="col-lg-2 col-md-3 col-sm-2 col-xs-6 col-xxs-12 animate-box article">
                    <figure class='figure'>
                        <a href="javascript:void(0);" onclick="detailInfo(${item.id})"><img src="${item.img}" alt="Image" class="img-responsive"></a>
                    </figure>
                    <h2 class="fh5co-article-title"><a href="single.html?id=${item.id}">${item.name}</a></h2>
                </article>
                `;
                    if (a.includes(index)) {
                        htmlStr += '<div class="clearfix visible-sm-block visible-xs-block"></div>';
                    } else if (b.includes(index)) {
                        htmlStr += `<div class="clearfix visible-lg-block visible-md-block  visible-xs-block"></div>`;
                    }
                });
            } else {
                htmlStr = `
                    <div class=" lazyImgWrap">
                        <div  style=" flex: 1 1 0%;">
                            <div class="list-empty"><div class="list-empty-image">
                            <?xml version="1.0" encoding="utf-8"?>
                            <!-- Generator: Adobe Illustrator 23.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve">
                            <style type="text/css">
                                .st0{fill:url(#SVGID_1_);}
                                .st1{fill:url(#SVGID_2_);}
                                .st2{fill:url(#SVGID_3_);}
                                .st3{fill:url(#SVGID_4_);}
                                .st4{fill:url(#SVGID_5_);}
                                .st5{fill:url(#SVGID_6_);}
                                .st6{fill:url(#SVGID_7_);}
                                .st7{fill:url(#SVGID_8_);}
                                .st8{fill:url(#SVGID_9_);}
                                .st9{fill:url(#SVGID_10_);}
                                .st10{fill:url(#SVGID_11_);}
                                .st11{fill:url(#SVGID_12_);}
                                .st12{fill:url(#SVGID_13_);}
                                .st13{fill:url(#SVGID_14_);}
                                .st14{fill:url(#SVGID_15_);}
                                .st15{fill:url(#SVGID_16_);}
                                .st16{fill:url(#SVGID_17_);}
                                .st17{fill:url(#SVGID_18_);}
                                .st18{fill:url(#SVGID_19_);}
                                .st19{fill:url(#SVGID_20_);}
                                .st20{fill:#C6D5E6;}
                                .st21{fill:url(#SVGID_21_);}
                                .st22{fill:url(#SVGID_22_);}
                                .st23{fill:url(#SVGID_23_);}
                                .st24{fill:url(#SVGID_24_);}
                                .st25{fill:url(#SVGID_25_);}
                                .st26{fill:url(#SVGID_26_);}
                                .st27{fill:url(#SVGID_27_);}
                                .st28{fill:url(#SVGID_28_);}
                                .st29{fill:url(#SVGID_29_);}
                                .st30{fill:#B4C6D9;}
                                .st31{fill:url(#SVGID_30_);}
                                .st32{fill:url(#SVGID_31_);}
                                .st33{fill:#F8B62D;}
                                .st34{fill:#E6E8E8;}
                                .st35{fill:url(#SVGID_32_);}
                                .st36{fill:url(#SVGID_33_);}
                                .st37{fill:url(#SVGID_34_);}
                                .st38{fill:url(#SVGID_35_);}
                                .st39{fill:url(#SVGID_36_);}
                                .st40{fill:url(#SVGID_37_);}
                                .st41{fill:url(#SVGID_38_);}
                                .st42{fill:url(#SVGID_39_);}
                                .st43{fill:url(#SVGID_40_);}
                                .st44{fill:url(#SVGID_41_);}
                                .st45{fill:url(#SVGID_42_);}
                                .st46{fill:url(#SVGID_43_);}
                                .st47{fill:url(#SVGID_44_);}
                                .st48{fill:url(#SVGID_45_);}
                                .st49{fill:url(#SVGID_46_);}
                                .st50{fill:url(#SVGID_47_);}
                                .st51{fill:url(#SVGID_48_);}
                                .st52{fill:url(#SVGID_49_);}
                                .st53{fill:url(#SVGID_50_);}
                                .st54{fill:url(#SVGID_51_);}
                                .st55{fill:url(#SVGID_52_);}
                                .st56{fill:#F7F8F8;}
                                .st57{fill:url(#SVGID_53_);}
                                .st58{fill:url(#SVGID_54_);}
                                .st59{fill:#FFBE92;}
                                .st60{fill:#4D8FE9;}
                                .st61{fill:url(#SVGID_55_);}
                                .st62{fill:#171C61;}
                                .st63{fill:url(#SVGID_56_);}
                                .st64{fill:url(#SVGID_57_);}
                                .st65{fill:url(#SVGID_58_);}
                                .st66{fill:url(#SVGID_59_);}
                                .st67{fill:url(#SVGID_60_);}
                                .st68{fill:url(#SVGID_61_);}
                                .st69{fill:url(#SVGID_62_);}
                                .st70{fill:url(#SVGID_63_);}
                                .st71{fill:url(#SVGID_64_);}
                                .st72{fill:url(#SVGID_65_);}
                                .st73{fill:url(#SVGID_66_);}
                                .st74{fill:url(#SVGID_67_);}
                                .st75{fill:url(#SVGID_68_);}
                                .st76{fill:url(#SVGID_69_);}
                                .st77{fill:url(#SVGID_70_);}
                                .st78{fill:url(#SVGID_71_);}
                                .st79{fill:url(#SVGID_72_);}
                                .st80{fill:url(#SVGID_73_);}
                                .st81{fill:url(#SVGID_74_);}
                                .st82{fill:url(#SVGID_75_);}
                                .st83{fill:url(#SVGID_76_);}
                                .st84{fill:url(#SVGID_77_);}
                                .st85{fill:url(#SVGID_78_);}
                                .st86{fill:url(#SVGID_79_);}
                                .st87{fill:url(#SVGID_80_);}
                                .st88{fill:url(#SVGID_81_);}
                                .st89{fill:url(#SVGID_82_);}
                                .st90{fill:url(#SVGID_83_);}
                                .st91{fill:url(#SVGID_84_);}
                                .st92{fill:url(#SVGID_85_);}
                                .st93{fill:url(#SVGID_86_);}
                                .st94{fill:url(#SVGID_87_);}
                                .st95{fill:url(#SVGID_88_);}
                                .st96{fill:url(#SVGID_89_);}
                                .st97{fill:url(#SVGID_90_);}
                                .st98{fill:url(#SVGID_91_);}
                                .st99{fill:url(#SVGID_92_);}
                                .st100{fill:url(#SVGID_93_);}
                                .st101{fill:url(#SVGID_94_);}
                                .st102{fill:url(#SVGID_95_);}
                                .st103{fill:url(#SVGID_96_);}
                                .st104{fill:url(#SVGID_97_);}
                                .st105{fill:url(#SVGID_98_);}
                                .st106{fill:url(#SVGID_99_);}
                                .st107{fill:url(#SVGID_100_);}
                                .st108{fill:url(#SVGID_101_);}
                                .st109{fill:url(#SVGID_102_);}
                                .st110{fill:url(#SVGID_103_);}
                                .st111{fill:url(#SVGID_104_);}
                                .st112{fill:url(#SVGID_105_);}
                                .st113{fill:url(#SVGID_106_);}
                                .st114{fill:url(#SVGID_107_);}
                                .st115{fill:url(#SVGID_108_);}
                                .st116{fill:none;stroke:#F7F8F8;stroke-width:5;stroke-linecap:round;stroke-miterlimit:10;}
                                .st117{fill:none;stroke:#F7F8F8;stroke-width:5;stroke-linecap:round;stroke-miterlimit:10;stroke-dasharray:7.6796,11.5194;}
                                .st118{fill:none;stroke:#F7F8F8;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
                                .st119{fill:url(#SVGID_109_);}
                                .st120{fill:url(#SVGID_110_);}
                                .st121{fill:url(#SVGID_111_);}
                                .st122{fill:url(#SVGID_112_);}
                                .st123{fill:url(#SVGID_113_);}
                                .st124{fill:url(#SVGID_114_);}
                                .st125{fill:url(#SVGID_115_);}
                                .st126{fill:url(#SVGID_116_);}
                                .st127{fill:url(#SVGID_117_);}
                                .st128{fill:url(#SVGID_118_);}
                                .st129{fill:url(#SVGID_119_);}
                                .st130{fill:url(#SVGID_120_);}
                                .st131{fill:url(#SVGID_121_);}
                                .st132{fill:url(#SVGID_122_);}
                                .st133{fill:url(#SVGID_123_);}
                                .st134{fill:url(#SVGID_124_);}
                                .st135{fill:url(#SVGID_125_);}
                                .st136{fill:url(#SVGID_126_);}
                                .st137{fill:url(#SVGID_127_);}
                                .st138{fill:url(#SVGID_128_);}
                                .st139{fill:url(#SVGID_129_);}
                                .st140{fill:url(#SVGID_130_);}
                                .st141{fill:url(#SVGID_131_);}
                                .st142{fill:url(#SVGID_132_);}
                                .st143{fill:url(#SVGID_133_);}
                                .st144{fill:url(#SVGID_134_);}
                                .st145{fill:url(#SVGID_135_);}
                                .st146{fill:url(#SVGID_136_);}
                                .st147{fill:url(#SVGID_137_);}
                                .st148{fill:url(#SVGID_138_);}
                                .st149{fill:url(#SVGID_139_);}
                                .st150{fill:#F4F8FA;}
                                .st151{fill:url(#SVGID_140_);}
                                .st152{fill:url(#SVGID_141_);}
                                .st153{fill:#F9CAAA;}
                                .st154{fill:url(#SVGID_142_);}
                                .st155{fill:url(#SVGID_143_);}
                                .st156{fill:url(#SVGID_144_);}
                                .st157{fill:#D4DFEC;}
                                .st158{fill:url(#SVGID_145_);}
                                .st159{fill:url(#SVGID_146_);}
                                .st160{fill:url(#SVGID_147_);}
                                .st161{fill:url(#SVGID_148_);}
                                .st162{fill:url(#SVGID_149_);}
                                .st163{fill:url(#SVGID_150_);}
                                .st164{fill:url(#SVGID_151_);}
                                .st165{fill:url(#SVGID_152_);}
                                .st166{fill:url(#SVGID_153_);}
                                .st167{fill:url(#SVGID_154_);}
                                .st168{fill:url(#SVGID_155_);}
                                .st169{fill:url(#SVGID_156_);}
                                .st170{fill:url(#SVGID_157_);}
                                .st171{fill:url(#SVGID_158_);}
                                .st172{fill:url(#SVGID_159_);}
                                .st173{fill:url(#SVGID_160_);}
                                .st174{fill:url(#SVGID_161_);}
                                .st175{fill:url(#SVGID_162_);}
                                .st176{fill:url(#SVGID_163_);}
                                .st177{fill:url(#SVGID_164_);}
                                .st178{fill:url(#SVGID_165_);}
                                .st179{fill:url(#SVGID_166_);}
                                .st180{fill:url(#SVGID_167_);}
                                .st181{fill:#FFFFFF;}
                                .st182{fill:url(#SVGID_168_);}
                                .st183{fill:url(#SVGID_169_);}
                                .st184{fill:url(#SVGID_170_);}
                                .st185{fill:url(#SVGID_171_);}
                                .st186{fill:#75BCEF;}
                                .st187{fill:url(#SVGID_172_);}
                                .st188{fill:url(#SVGID_173_);}
                                .st189{fill:url(#SVGID_174_);}
                                .st190{fill:url(#SVGID_175_);}
                                .st191{fill:url(#SVGID_176_);}
                                .st192{fill:url(#SVGID_177_);}
                                .st193{fill:url(#SVGID_178_);}
                                .st194{fill:url(#SVGID_179_);}
                                .st195{fill:url(#SVGID_180_);}
                                .st196{fill:url(#SVGID_181_);}
                                .st197{fill:url(#SVGID_182_);}
                                .st198{fill:url(#SVGID_183_);}
                                .st199{fill:url(#SVGID_184_);}
                                .st200{fill:url(#SVGID_185_);}
                                .st201{fill:url(#SVGID_186_);}
                                .st202{fill:url(#SVGID_187_);}
                                .st203{fill:url(#SVGID_188_);}
                                .st204{fill:url(#SVGID_189_);}
                                .st205{fill:url(#SVGID_190_);}
                                .st206{fill:url(#SVGID_191_);}
                                .st207{fill:url(#SVGID_192_);}
                                .st208{fill:url(#SVGID_193_);}
                                .st209{fill:url(#SVGID_194_);}
                                .st210{fill:url(#SVGID_195_);}
                                .st211{fill:url(#SVGID_196_);}
                                .st212{fill:url(#SVGID_197_);}
                                .st213{fill:url(#SVGID_198_);}
                                .st214{fill:url(#SVGID_199_);}
                                .st215{fill:url(#SVGID_200_);}
                                .st216{fill:url(#SVGID_201_);}
                                .st217{fill:url(#SVGID_202_);}
                                .st218{fill:url(#SVGID_203_);}
                                .st219{fill:url(#SVGID_204_);}
                                .st220{fill:url(#SVGID_205_);}
                                .st221{fill:url(#SVGID_206_);}
                                .st222{fill:url(#SVGID_207_);}
                                .st223{fill:url(#SVGID_208_);}
                                .st224{fill:url(#SVGID_209_);}
                                .st225{fill:url(#SVGID_210_);}
                                .st226{fill:url(#SVGID_211_);}
                                .st227{fill:url(#SVGID_212_);}
                                .st228{fill:url(#SVGID_213_);}
                                .st229{fill:url(#SVGID_214_);}
                                .st230{fill:url(#SVGID_215_);}
                                .st231{fill:url(#SVGID_216_);}
                                .st232{fill:url(#SVGID_217_);}
                                .st233{fill:url(#SVGID_218_);}
                                .st234{fill:url(#SVGID_219_);}
                                .st235{fill:url(#SVGID_220_);}
                                .st236{fill:url(#SVGID_221_);}
                                .st237{fill:url(#SVGID_222_);}
                                .st238{fill:url(#SVGID_223_);}
                                .st239{fill:url(#SVGID_224_);}
                                .st240{fill:url(#SVGID_225_);}
                                .st241{fill:url(#SVGID_226_);}
                                .st242{fill:url(#SVGID_227_);}
                                .st243{fill:url(#SVGID_228_);}
                                .st244{fill:url(#SVGID_229_);}
                                .st245{fill:url(#SVGID_230_);}
                                .st246{fill:url(#SVGID_231_);}
                                .st247{fill:url(#SVGID_232_);}
                                .st248{fill:url(#SVGID_233_);}
                                .st249{fill:url(#SVGID_234_);}
                                .st250{fill:url(#SVGID_235_);}
                                .st251{fill:url(#SVGID_236_);}
                                .st252{fill:url(#SVGID_237_);}
                                .st253{fill:url(#SVGID_238_);}
                                .st254{fill:url(#SVGID_239_);}
                                .st255{fill:url(#SVGID_240_);}
                                .st256{fill:url(#SVGID_241_);}
                                .st257{fill:url(#SVGID_242_);}
                                .st258{fill:url(#SVGID_243_);}
                                .st259{fill:url(#SVGID_244_);}
                                .st260{fill:url(#SVGID_245_);}
                                .st261{fill:url(#SVGID_246_);}
                                .st262{fill:url(#SVGID_247_);}
                                .st263{fill:url(#SVGID_248_);}
                                .st264{fill:url(#SVGID_249_);}
                                .st265{fill:url(#SVGID_250_);}
                                .st266{fill:url(#SVGID_251_);}
                                .st267{fill:url(#SVGID_252_);}
                                .st268{fill:url(#SVGID_253_);}
                                .st269{fill:url(#SVGID_254_);}
                                .st270{fill:url(#SVGID_255_);}
                                .st271{fill:url(#SVGID_256_);}
                                .st272{fill:url(#SVGID_257_);}
                                .st273{fill:url(#SVGID_258_);}
                                .st274{fill:url(#SVGID_259_);}
                                .st275{fill:url(#SVGID_260_);}
                                .st276{fill:url(#SVGID_261_);}
                                .st277{fill:url(#SVGID_262_);}
                                .st278{fill:url(#SVGID_263_);}
                                .st279{fill:url(#SVGID_264_);}
                                .st280{fill:url(#SVGID_265_);}
                                .st281{fill:url(#SVGID_266_);}
                                .st282{fill:url(#SVGID_267_);}
                                .st283{fill:url(#SVGID_268_);}
                                .st284{fill:url(#SVGID_269_);}
                                .st285{fill:url(#SVGID_270_);}
                                .st286{fill:url(#SVGID_271_);}
                                .st287{fill:url(#SVGID_272_);}
                                .st288{fill:#AEC1D6;}
                                .st289{fill:url(#SVGID_273_);}
                                .st290{fill:url(#SVGID_274_);}
                                .st291{fill:url(#SVGID_275_);}
                                .st292{fill:url(#SVGID_276_);}
                                .st293{fill:url(#SVGID_277_);}
                                .st294{fill:url(#SVGID_278_);}
                                .st295{fill:url(#SVGID_279_);}
                                .st296{fill:url(#SVGID_280_);}
                                .st297{fill:url(#SVGID_281_);}
                                .st298{fill:url(#SVGID_282_);}
                                .st299{fill:url(#SVGID_283_);}
                                .st300{fill:url(#SVGID_284_);}
                                .st301{fill:url(#SVGID_285_);}
                                .st302{fill:url(#SVGID_286_);}
                                .st303{fill:url(#SVGID_287_);}
                                .st304{fill:url(#SVGID_288_);}
                                .st305{fill:url(#SVGID_289_);}
                                .st306{fill:url(#SVGID_290_);}
                                .st307{fill:url(#SVGID_291_);}
                                .st308{fill:url(#SVGID_292_);}
                                .st309{fill:url(#SVGID_293_);}
                                .st310{fill:url(#SVGID_294_);}
                                .st311{fill:url(#SVGID_295_);}
                                .st312{fill:url(#SVGID_296_);}
                                .st313{fill:url(#SVGID_297_);}
                                .st314{fill:url(#SVGID_298_);}
                                .st315{fill:url(#SVGID_299_);}
                                .st316{fill:url(#SVGID_300_);}
                                .st317{fill:url(#SVGID_301_);}
                                .st318{fill:url(#SVGID_302_);}
                                .st319{fill:url(#SVGID_303_);}
                                .st320{fill:url(#SVGID_304_);}
                                .st321{fill:url(#SVGID_305_);}
                                .st322{fill:url(#SVGID_306_);}
                                .st323{fill:url(#SVGID_307_);}
                                .st324{fill:url(#SVGID_308_);}
                                .st325{fill:url(#SVGID_309_);}
                                .st326{fill:url(#SVGID_310_);}
                                .st327{fill:url(#SVGID_311_);}
                                .st328{fill:url(#SVGID_312_);}
                                .st329{fill:url(#SVGID_313_);}
                                .st330{fill:url(#SVGID_314_);}
                                .st331{fill:url(#SVGID_315_);}
                                .st332{fill:url(#SVGID_316_);}
                                .st333{fill:url(#SVGID_317_);}
                                .st334{fill:url(#SVGID_318_);}
                                .st335{fill:url(#SVGID_319_);}
                                .st336{fill:url(#SVGID_320_);}
                                .st337{fill:url(#SVGID_321_);}
                                .st338{fill:url(#SVGID_322_);}
                                .st339{fill:url(#SVGID_323_);}
                                .st340{fill:url(#SVGID_324_);}
                                .st341{fill:url(#SVGID_325_);}
                                .st342{fill:url(#SVGID_326_);}
                                .st343{fill:url(#SVGID_327_);}
                                .st344{fill:url(#SVGID_328_);}
                                .st345{fill:url(#SVGID_329_);}
                                .st346{fill:url(#SVGID_330_);}
                                .st347{fill:url(#SVGID_331_);}
                                .st348{fill:url(#SVGID_332_);}
                                .st349{fill:url(#SVGID_333_);}
                                .st350{fill:url(#SVGID_334_);}
                                .st351{fill:url(#SVGID_335_);}
                                .st352{fill:url(#SVGID_336_);}
                                .st353{fill:url(#SVGID_337_);}
                                .st354{fill:url(#SVGID_338_);}
                                .st355{fill:url(#SVGID_339_);}
                                .st356{fill:url(#SVGID_340_);}
                                .st357{fill:url(#SVGID_341_);}
                                .st358{fill:url(#SVGID_342_);}
                                .st359{fill:url(#SVGID_343_);}
                                .st360{fill:url(#SVGID_344_);}
                                .st361{fill:url(#SVGID_345_);}
                                .st362{fill:url(#SVGID_346_);}
                                .st363{fill:url(#SVGID_347_);}
                                .st364{fill:url(#SVGID_348_);}
                                .st365{fill:url(#SVGID_349_);}
                                .st366{fill:url(#SVGID_350_);}
                                .st367{fill:url(#SVGID_351_);}
                                .st368{fill:url(#SVGID_352_);}
                                .st369{fill:url(#SVGID_353_);}
                                .st370{fill:url(#SVGID_354_);}
                                .st371{fill:url(#SVGID_355_);}
                                .st372{fill:url(#SVGID_356_);}
                                .st373{fill:url(#SVGID_357_);}
                                .st374{fill:url(#SVGID_358_);}
                                .st375{fill:url(#SVGID_359_);}
                                .st376{fill:url(#SVGID_360_);}
                                .st377{fill:url(#SVGID_361_);}
                                .st378{fill:url(#SVGID_362_);}
                                .st379{fill:url(#SVGID_363_);}
                                .st380{fill:url(#SVGID_364_);}
                                .st381{fill:url(#SVGID_365_);}
                                .st382{fill:url(#SVGID_366_);}
                                .st383{fill:url(#SVGID_367_);}
                                .st384{fill:url(#SVGID_368_);}
                                .st385{fill:url(#SVGID_369_);}
                                .st386{fill:url(#SVGID_370_);}
                                .st387{fill:url(#SVGID_371_);}
                                .st388{fill:url(#SVGID_372_);}
                                .st389{fill:url(#SVGID_373_);}
                                .st390{fill:url(#SVGID_374_);}
                                .st391{fill:url(#SVGID_375_);}
                                .st392{fill:url(#SVGID_376_);}
                                .st393{fill:url(#SVGID_377_);}
                                .st394{fill:url(#SVGID_378_);}
                                .st395{fill:url(#SVGID_379_);}
                                .st396{fill:url(#SVGID_380_);}
                                .st397{fill:url(#SVGID_381_);}
                                .st398{fill:url(#SVGID_382_);}
                                .st399{fill:url(#SVGID_383_);}
                                .st400{fill:url(#SVGID_384_);}
                                .st401{fill:url(#SVGID_385_);}
                                .st402{fill:url(#SVGID_386_);}
                                .st403{fill:url(#SVGID_387_);}
                                .st404{fill:url(#SVGID_388_);}
                                .st405{fill:url(#SVGID_389_);}
                                .st406{fill:url(#SVGID_390_);}
                                .st407{fill:url(#SVGID_391_);}
                                .st408{fill:url(#SVGID_392_);}
                                .st409{fill:url(#SVGID_393_);}
                                .st410{fill:url(#SVGID_394_);}
                                .st411{fill:url(#SVGID_395_);}
                                .st412{fill:url(#SVGID_396_);}
                                .st413{fill:url(#SVGID_397_);}
                                .st414{fill:url(#SVGID_398_);}
                                .st415{fill:url(#SVGID_399_);}
                                .st416{fill:url(#SVGID_400_);}
                                .st417{fill:url(#SVGID_401_);}
                                .st418{fill:url(#SVGID_402_);}
                                .st419{fill:url(#SVGID_403_);}
                                .st420{fill:url(#SVGID_404_);}
                                .st421{fill:url(#SVGID_405_);}
                                .st422{fill:url(#SVGID_406_);}
                                .st423{fill:url(#SVGID_407_);}
                                .st424{fill:url(#SVGID_408_);}
                                .st425{fill:url(#SVGID_409_);}
                                .st426{fill:url(#SVGID_410_);}
                                .st427{fill:url(#SVGID_411_);}
                                .st428{fill:url(#SVGID_412_);}
                                .st429{fill:url(#SVGID_413_);}
                                .st430{fill:url(#SVGID_414_);}
                                .st431{fill:url(#SVGID_415_);}
                                .st432{fill:url(#SVGID_416_);}
                                .st433{fill:url(#SVGID_417_);}
                                .st434{fill:url(#SVGID_418_);}
                                .st435{fill:url(#SVGID_419_);}
                                .st436{fill:url(#SVGID_420_);}
                                .st437{fill:url(#SVGID_421_);}
                                .st438{fill:url(#SVGID_422_);}
                                .st439{fill:url(#SVGID_423_);}
                                .st440{fill:url(#SVGID_424_);}
                                .st441{fill:url(#SVGID_425_);}
                                .st442{fill:url(#SVGID_426_);}
                                .st443{fill:url(#SVGID_427_);}
                                .st444{fill:url(#SVGID_428_);}
                                .st445{fill:url(#SVGID_429_);}
                                .st446{fill:url(#SVGID_430_);}
                                .st447{fill:url(#SVGID_431_);}
                                .st448{fill:url(#SVGID_432_);}
                                .st449{fill:url(#SVGID_433_);}
                                .st450{fill:url(#SVGID_434_);}
                                .st451{fill:url(#SVGID_435_);}
                                .st452{fill:url(#SVGID_436_);}
                                .st453{fill:url(#SVGID_437_);}
                                .st454{fill:url(#SVGID_438_);}
                                .st455{fill:url(#SVGID_439_);}
                                .st456{fill:url(#SVGID_440_);}
                                .st457{fill:url(#SVGID_441_);}
                                .st458{fill:url(#SVGID_442_);}
                                .st459{fill:url(#SVGID_443_);}
                                .st460{fill:url(#SVGID_444_);}
                                .st461{fill:url(#SVGID_445_);}
                                .st462{fill:url(#SVGID_446_);}
                                .st463{fill:url(#SVGID_447_);}
                                .st464{fill:url(#SVGID_448_);}
                                .st465{fill:url(#SVGID_449_);}
                                .st466{fill:url(#SVGID_450_);}
                                .st467{fill:url(#SVGID_451_);}
                                .st468{fill:url(#SVGID_452_);}
                                .st469{fill:url(#SVGID_453_);}
                                .st470{fill:url(#SVGID_454_);}
                                .st471{fill:url(#SVGID_455_);}
                                .st472{fill:url(#SVGID_456_);}
                                .st473{fill:url(#SVGID_457_);}
                                .st474{fill:#F2AD7E;}
                                .st475{fill:url(#SVGID_458_);}
                                .st476{fill:url(#SVGID_459_);}
                                .st477{fill:#4286E7;}
                                .st478{fill:url(#SVGID_460_);}
                                .st479{fill:url(#SVGID_461_);}
                                .st480{fill:url(#SVGID_462_);}
                                .st481{fill:url(#SVGID_463_);}
                                .st482{fill:url(#SVGID_464_);}
                                .st483{fill:url(#SVGID_465_);}
                                .st484{fill:url(#SVGID_466_);}
                                .st485{fill:url(#SVGID_467_);}
                                .st486{fill:url(#SVGID_468_);}
                                .st487{fill:url(#SVGID_469_);}
                                .st488{fill:url(#SVGID_470_);}
                                .st489{fill:url(#SVGID_471_);}
                                .st490{fill:url(#SVGID_472_);}
                                .st491{fill:url(#SVGID_473_);}
                                .st492{fill:url(#SVGID_474_);}
                                .st493{fill:url(#SVGID_475_);}
                                .st494{fill:url(#SVGID_476_);}
                                .st495{fill:url(#SVGID_477_);}
                                .st496{fill:url(#SVGID_478_);}
                                .st497{fill:url(#SVGID_479_);}
                                .st498{fill:url(#SVGID_480_);}
                                .st499{fill:url(#SVGID_481_);}
                                .st500{fill:url(#SVGID_482_);}
                                .st501{fill:url(#SVGID_483_);}
                                .st502{fill:url(#SVGID_484_);}
                                .st503{fill:url(#SVGID_485_);}
                                .st504{fill:url(#SVGID_486_);}
                                .st505{fill:url(#SVGID_487_);}
                                .st506{fill:url(#SVGID_488_);}
                                .st507{fill:url(#SVGID_489_);}
                                .st508{fill:url(#SVGID_490_);}
                                .st509{fill:url(#SVGID_491_);}
                                .st510{fill:url(#SVGID_492_);}
                                .st511{fill:url(#SVGID_493_);}
                                .st512{fill:url(#SVGID_494_);}
                                .st513{fill:url(#SVGID_495_);}
                                .st514{fill:url(#SVGID_496_);}
                                .st515{fill:url(#SVGID_497_);}
                                .st516{fill:url(#SVGID_498_);}
                                .st517{fill:url(#SVGID_499_);}
                                .st518{fill:url(#SVGID_500_);}
                                .st519{fill:url(#SVGID_501_);}
                                .st520{fill:url(#SVGID_502_);}
                                .st521{fill:url(#SVGID_503_);}
                                .st522{fill:url(#SVGID_504_);}
                                .st523{fill:url(#SVGID_505_);}
                                .st524{fill:url(#SVGID_506_);}
                                .st525{fill:#EFAB7D;}
                                .st526{fill:url(#SVGID_507_);}
                                .st527{fill:url(#SVGID_508_);}
                                .st528{fill:url(#SVGID_509_);}
                                .st529{fill:url(#SVGID_510_);}
                                .st530{fill:url(#SVGID_511_);}
                                .st531{fill:url(#SVGID_512_);}
                                .st532{fill:url(#SVGID_513_);}
                                .st533{fill:url(#SVGID_514_);}
                                .st534{fill:url(#SVGID_515_);}
                                .st535{fill:url(#SVGID_516_);}
                                .st536{fill:url(#SVGID_517_);}
                                .st537{fill:url(#SVGID_518_);}
                                .st538{fill:url(#SVGID_519_);}
                                .st539{fill:url(#SVGID_520_);}
                                .st540{fill:url(#SVGID_521_);}
                                .st541{fill:url(#SVGID_522_);}
                                .st542{fill:url(#SVGID_523_);}
                                .st543{fill:url(#SVGID_524_);}
                                .st544{fill:url(#SVGID_525_);}
                                .st545{fill:url(#SVGID_526_);}
                                .st546{fill:url(#SVGID_527_);}
                                .st547{fill:url(#SVGID_528_);}
                                .st548{fill:url(#SVGID_529_);}
                                .st549{fill:url(#SVGID_530_);}
                                .st550{fill:url(#SVGID_531_);}
                                .st551{fill:url(#SVGID_532_);}
                                .st552{fill:url(#SVGID_533_);}
                                .st553{fill:url(#SVGID_534_);}
                                .st554{fill:url(#SVGID_535_);}
                                .st555{fill:url(#SVGID_536_);}
                                .st556{fill:url(#SVGID_537_);}
                                .st557{fill:url(#SVGID_538_);}
                                .st558{fill:url(#SVGID_539_);}
                                .st559{fill:url(#SVGID_540_);}
                                .st560{fill:url(#SVGID_541_);}
                                .st561{fill:url(#SVGID_542_);}
                                .st562{fill:url(#SVGID_543_);}
                                .st563{fill:url(#SVGID_544_);}
                                .st564{fill:url(#SVGID_545_);}
                                .st565{fill:url(#SVGID_546_);}
                                .st566{fill:url(#SVGID_547_);}
                                .st567{fill:url(#SVGID_548_);}
                                .st568{fill:url(#SVGID_549_);}
                                .st569{fill:url(#SVGID_550_);}
                                .st570{fill:url(#SVGID_551_);}
                                .st571{fill:url(#SVGID_552_);}
                                .st572{fill:url(#SVGID_553_);}
                                .st573{fill:url(#SVGID_554_);}
                                .st574{fill:url(#SVGID_555_);}
                                .st575{fill:url(#SVGID_556_);}
                                .st576{fill:url(#SVGID_557_);}
                                .st577{fill:url(#SVGID_558_);}
                                .st578{fill:url(#SVGID_559_);}
                                .st579{fill:url(#SVGID_560_);}
                                .st580{fill:url(#SVGID_561_);}
                                .st581{fill:url(#SVGID_562_);}
                                .st582{fill:url(#SVGID_563_);}
                                .st583{fill:url(#SVGID_564_);}
                                .st584{fill:url(#SVGID_565_);}
                                .st585{fill:url(#SVGID_566_);}
                                .st586{fill:url(#SVGID_567_);}
                                .st587{fill:url(#SVGID_568_);}
                                .st588{fill:url(#SVGID_569_);}
                                .st589{fill:url(#SVGID_570_);}
                                .st590{fill:url(#SVGID_571_);}
                                .st591{fill:url(#SVGID_572_);}
                                .st592{fill:url(#SVGID_573_);}
                                .st593{fill:#A4B8D0;}
                                .st594{fill:url(#SVGID_574_);}
                                .st595{fill:url(#SVGID_575_);}
                                .st596{fill:url(#SVGID_576_);}
                                .st597{fill:url(#SVGID_577_);}
                                .st598{fill:url(#SVGID_578_);}
                                .st599{fill:url(#SVGID_579_);}
                                .st600{fill:url(#SVGID_580_);}
                                .st601{fill:url(#SVGID_581_);}
                                .st602{fill:url(#SVGID_582_);}
                                .st603{fill:url(#SVGID_583_);}
                                .st604{fill:url(#SVGID_584_);}
                                .st605{fill:url(#SVGID_585_);}
                                .st606{fill:url(#SVGID_586_);}
                                .st607{fill:url(#SVGID_587_);}
                                .st608{fill:url(#SVGID_588_);}
                                .st609{fill:url(#SVGID_589_);}
                                .st610{fill:url(#SVGID_590_);}
                                .st611{fill:url(#SVGID_591_);}
                                .st612{fill:url(#SVGID_592_);}
                                .st613{fill:url(#SVGID_593_);}
                                .st614{fill:url(#SVGID_594_);}
                                .st615{fill:url(#SVGID_595_);}
                                .st616{fill:url(#SVGID_596_);}
                                .st617{fill:url(#SVGID_597_);}
                                .st618{fill:url(#SVGID_598_);}
                                .st619{fill:url(#SVGID_599_);}
                                .st620{fill:url(#SVGID_600_);}
                                .st621{fill:#ECF0F7;}
                                .st622{fill:url(#SVGID_601_);}
                                .st623{fill:url(#SVGID_602_);}
                                .st624{fill:url(#SVGID_603_);}
                                .st625{fill:url(#SVGID_604_);}
                                .st626{fill:url(#SVGID_605_);}
                                .st627{fill:url(#SVGID_606_);}
                                .st628{fill:url(#SVGID_607_);}
                                .st629{fill:url(#SVGID_608_);}
                                .st630{fill:url(#SVGID_609_);}
                                .st631{fill:url(#SVGID_610_);}
                                .st632{fill:url(#SVGID_611_);}
                                .st633{fill:url(#SVGID_612_);}
                                .st634{fill:url(#SVGID_613_);}
                                .st635{fill:url(#SVGID_614_);}
                                .st636{fill:url(#SVGID_615_);}
                                .st637{fill:url(#SVGID_616_);}
                                .st638{fill:url(#SVGID_617_);}
                                .st639{fill:url(#SVGID_618_);}
                                .st640{fill:url(#SVGID_619_);}
                                .st641{fill:url(#SVGID_620_);}
                                .st642{fill:url(#SVGID_621_);}
                                .st643{fill:url(#SVGID_622_);}
                                .st644{fill:url(#SVGID_623_);}
                                .st645{fill:url(#SVGID_624_);}
                                .st646{fill:url(#SVGID_625_);}
                                .st647{fill:url(#SVGID_626_);}
                                .st648{fill:url(#SVGID_627_);}
                                .st649{fill:url(#SVGID_628_);}
                                .st650{fill:url(#SVGID_629_);}
                                .st651{fill:url(#SVGID_630_);}
                                .st652{fill:url(#SVGID_631_);}
                                .st653{fill:url(#SVGID_632_);}
                                .st654{fill:url(#SVGID_633_);}
                                .st655{fill:url(#SVGID_634_);}
                                .st656{fill:url(#SVGID_635_);}
                                .st657{fill:url(#SVGID_636_);}
                                .st658{fill:url(#SVGID_637_);}
                                .st659{fill:url(#SVGID_638_);}
                                .st660{fill:url(#SVGID_639_);}
                                .st661{fill:url(#SVGID_640_);}
                                .st662{fill:url(#SVGID_641_);}
                                .st663{fill:url(#SVGID_642_);}
                                .st664{fill:url(#SVGID_643_);}
                                .st665{fill:url(#SVGID_644_);}
                                .st666{fill:url(#SVGID_645_);}
                                .st667{fill:url(#SVGID_646_);}
                                .st668{fill:url(#SVGID_647_);}
                                .st669{fill:url(#SVGID_648_);}
                                .st670{fill:url(#SVGID_649_);}
                                .st671{fill:url(#SVGID_650_);}
                                .st672{fill:#D4DDEC;}
                                .st673{fill:url(#SVGID_651_);}
                                .st674{fill:url(#SVGID_652_);}
                                .st675{fill:url(#SVGID_653_);}
                                .st676{fill:url(#SVGID_654_);}
                                .st677{fill:url(#SVGID_655_);}
                                .st678{fill:url(#SVGID_656_);}
                                .st679{fill:url(#SVGID_657_);}
                                .st680{fill:url(#SVGID_658_);}
                                .st681{fill:url(#SVGID_659_);}
                                .st682{fill:url(#SVGID_660_);}
                                .st683{fill:url(#SVGID_661_);}
                                .st684{fill:url(#SVGID_662_);}
                                .st685{fill:url(#SVGID_663_);}
                                .st686{fill:url(#SVGID_664_);}
                                .st687{fill:url(#SVGID_665_);}
                                .st688{fill:url(#SVGID_666_);}
                                .st689{fill:url(#SVGID_667_);}
                                .st690{fill:url(#SVGID_668_);}
                                .st691{fill:url(#SVGID_669_);}
                                .st692{fill:url(#SVGID_670_);}
                                .st693{fill:url(#SVGID_671_);}
                                .st694{fill:url(#SVGID_672_);}
                                .st695{fill:url(#SVGID_673_);}
                                .st696{fill:url(#SVGID_674_);}
                                .st697{fill:url(#SVGID_675_);}
                                .st698{fill:url(#SVGID_676_);}
                                .st699{fill:url(#SVGID_677_);}
                                .st700{fill:url(#SVGID_678_);}
                                .st701{fill:url(#SVGID_679_);}
                                .st702{fill:url(#SVGID_680_);}
                                .st703{fill:url(#SVGID_681_);}
                                .st704{fill:url(#SVGID_682_);}
                                .st705{fill:url(#SVGID_683_);}
                                .st706{fill:url(#SVGID_684_);}
                                .st707{fill:url(#SVGID_685_);}
                                .st708{fill:url(#SVGID_686_);}
                                .st709{fill:url(#SVGID_687_);}
                                .st710{fill:url(#SVGID_688_);}
                                .st711{fill:url(#SVGID_689_);}
                                .st712{fill:url(#SVGID_690_);}
                                .st713{fill:url(#SVGID_691_);}
                                .st714{fill:url(#SVGID_692_);}
                                .st715{fill:url(#SVGID_693_);}
                                .st716{fill:url(#SVGID_694_);}
                                .st717{fill:url(#SVGID_695_);}
                                .st718{fill:url(#SVGID_696_);}
                                .st719{fill:url(#SVGID_697_);}
                                .st720{fill:url(#SVGID_698_);}
                                .st721{fill:url(#SVGID_699_);}
                                .st722{fill:url(#SVGID_700_);}
                                .st723{fill:url(#SVGID_701_);}
                                .st724{fill:url(#SVGID_702_);}
                                .st725{fill:url(#SVGID_703_);}
                                .st726{fill:#E3F0FC;}
                                .st727{fill:url(#SVGID_704_);}
                                .st728{fill:url(#SVGID_705_);}
                                .st729{fill:url(#SVGID_706_);}
                                .st730{fill:url(#SVGID_707_);}
                                .st731{fill:url(#SVGID_708_);}
                                .st732{fill:url(#SVGID_709_);}
                                .st733{fill:url(#SVGID_710_);}
                                .st734{fill:url(#SVGID_711_);}
                                .st735{fill:url(#SVGID_712_);}
                                .st736{fill:url(#SVGID_713_);}
                                .st737{fill:url(#SVGID_714_);}
                                .st738{fill:url(#SVGID_715_);}
                                .st739{fill:url(#SVGID_716_);}
                                .st740{fill:url(#SVGID_717_);}
                                .st741{fill:url(#SVGID_718_);}
                                .st742{fill:url(#SVGID_719_);}
                                .st743{fill:url(#SVGID_720_);}
                                .st744{fill:url(#SVGID_721_);}
                                .st745{fill:url(#SVGID_722_);}
                                .st746{fill:url(#SVGID_723_);}
                                .st747{fill:url(#SVGID_724_);}
                                .st748{fill:url(#SVGID_725_);}
                                .st749{fill:url(#SVGID_726_);}
                                .st750{fill:url(#SVGID_727_);}
                                .st751{fill:url(#SVGID_728_);}
                                .st752{fill:url(#SVGID_729_);}
                                .st753{fill:url(#SVGID_730_);}
                                .st754{fill:url(#SVGID_731_);}
                                .st755{fill:url(#SVGID_732_);}
                                .st756{fill:url(#SVGID_733_);}
                                .st757{fill:url(#SVGID_734_);}
                                .st758{fill:url(#SVGID_735_);}
                                .st759{fill:url(#SVGID_736_);}
                                .st760{fill:url(#SVGID_737_);}
                                .st761{fill:url(#SVGID_738_);}
                                .st762{fill:url(#SVGID_739_);}
                                .st763{fill:url(#SVGID_740_);}
                                .st764{fill:url(#SVGID_741_);}
                                .st765{fill:url(#SVGID_742_);}
                                .st766{fill:url(#SVGID_743_);}
                                .st767{fill:url(#SVGID_744_);}
                                .st768{fill:url(#SVGID_745_);}
                                .st769{fill:url(#SVGID_746_);}
                                .st770{fill:url(#SVGID_747_);}
                                .st771{fill:url(#SVGID_748_);}
                                .st772{fill:url(#SVGID_749_);}
                                .st773{fill:url(#SVGID_750_);}
                                .st774{fill:url(#SVGID_751_);}
                                .st775{fill:url(#SVGID_752_);}
                                .st776{fill:url(#SVGID_753_);}
                                .st777{fill:url(#SVGID_754_);}
                                .st778{fill:#A3B9D1;}
                                .st779{fill:url(#SVGID_755_);}
                                .st780{fill:#FBFCFD;}
                                .st781{fill:url(#SVGID_756_);}
                                .st782{fill:url(#SVGID_757_);}
                                .st783{fill:url(#SVGID_758_);}
                                .st784{fill:url(#SVGID_759_);}
                                .st785{fill:url(#SVGID_760_);}
                                .st786{fill:url(#SVGID_761_);}
                                .st787{fill:url(#SVGID_762_);}
                                .st788{fill:url(#SVGID_763_);}
                                .st789{fill:url(#SVGID_764_);}
                                .st790{fill:url(#SVGID_765_);}
                                .st791{fill:url(#SVGID_766_);}
                                .st792{fill:url(#SVGID_767_);}
                                .st793{fill:url(#SVGID_768_);}
                                .st794{fill:url(#SVGID_769_);}
                                .st795{fill:url(#SVGID_770_);}
                                .st796{fill:url(#SVGID_771_);}
                                .st797{fill:url(#SVGID_772_);}
                                .st798{fill:url(#SVGID_773_);}
                                .st799{fill:url(#SVGID_774_);}
                                .st800{fill:url(#SVGID_775_);}
                                .st801{fill:url(#SVGID_776_);}
                                .st802{fill:url(#SVGID_777_);}
                                .st803{fill:url(#SVGID_778_);}
                                .st804{fill:url(#SVGID_779_);}
                                .st805{fill:url(#SVGID_780_);}
                                .st806{fill:url(#SVGID_781_);}
                                .st807{fill:url(#SVGID_782_);}
                                .st808{fill:url(#SVGID_783_);}
                                .st809{fill:url(#SVGID_784_);}
                                .st810{fill:url(#SVGID_785_);}
                                .st811{fill:url(#SVGID_786_);}
                                .st812{fill:url(#SVGID_787_);}
                                .st813{fill:url(#SVGID_788_);}
                                .st814{fill:url(#SVGID_789_);}
                                .st815{fill:url(#SVGID_790_);}
                                .st816{fill:url(#SVGID_791_);}
                                .st817{fill:url(#SVGID_792_);}
                                .st818{fill:url(#SVGID_793_);}
                                .st819{fill:url(#SVGID_794_);}
                                .st820{fill:url(#SVGID_795_);}
                                .st821{fill:url(#SVGID_796_);}
                                .st822{fill:url(#SVGID_797_);}
                                .st823{fill:url(#SVGID_798_);}
                                .st824{fill:url(#SVGID_799_);}
                                .st825{fill:url(#SVGID_800_);}
                                .st826{fill:url(#SVGID_801_);}
                                .st827{fill:url(#SVGID_802_);}
                                .st828{fill:url(#SVGID_803_);}
                                .st829{fill:url(#SVGID_804_);}
                                .st830{fill:url(#SVGID_805_);}
                                .st831{fill:url(#SVGID_806_);}
                                .st832{fill:url(#SVGID_807_);}
                                .st833{fill:url(#SVGID_808_);}
                                .st834{fill:url(#SVGID_809_);}
                                .st835{fill:url(#SVGID_810_);}
                                .st836{fill:url(#SVGID_811_);}
                                .st837{fill:url(#SVGID_812_);}
                                .st838{fill:url(#SVGID_813_);}
                                .st839{fill:url(#SVGID_814_);}
                                .st840{fill:url(#SVGID_815_);}
                                .st841{fill:url(#SVGID_816_);}
                                .st842{fill:#036EB8;}
                                .st843{fill:url(#SVGID_817_);}
                                .st844{fill:url(#SVGID_818_);}
                                .st845{fill:url(#SVGID_819_);}
                                .st846{fill:url(#SVGID_820_);}
                                .st847{fill:url(#SVGID_821_);}
                                .st848{fill:url(#SVGID_822_);}
                                .st849{fill:url(#SVGID_823_);}
                                .st850{fill:url(#SVGID_824_);}
                                .st851{fill:url(#SVGID_825_);}
                                .st852{fill:url(#SVGID_826_);}
                                .st853{fill:url(#SVGID_827_);}
                                .st854{fill:url(#SVGID_828_);}
                                .st855{fill:url(#SVGID_829_);}
                                .st856{fill:url(#SVGID_830_);}
                                .st857{fill:url(#SVGID_831_);}
                                .st858{fill:url(#SVGID_832_);}
                                .st859{fill:url(#SVGID_833_);}
                                .st860{fill:url(#SVGID_834_);}
                                .st861{fill:url(#SVGID_835_);}
                                .st862{fill:url(#SVGID_836_);}
                                .st863{fill:url(#SVGID_837_);}
                                .st864{fill:url(#SVGID_838_);}
                                .st865{fill:url(#SVGID_839_);}
                                .st866{fill:url(#SVGID_840_);}
                                .st867{fill:url(#SVGID_841_);}
                                .st868{fill:url(#SVGID_842_);}
                                .st869{fill:url(#SVGID_843_);}
                                .st870{fill:url(#SVGID_844_);}
                                .st871{fill:url(#SVGID_845_);}
                                .st872{fill:url(#SVGID_846_);}
                                .st873{fill:url(#SVGID_847_);}
                                .st874{fill:url(#SVGID_848_);}
                                .st875{fill:url(#SVGID_849_);}
                                .st876{fill:url(#SVGID_850_);}
                                .st877{fill:url(#SVGID_851_);}
                                .st878{fill:url(#SVGID_852_);}
                                .st879{fill:url(#SVGID_853_);}
                                .st880{fill:#FCB788;}
                                .st881{fill:url(#SVGID_854_);}
                                .st882{fill:url(#SVGID_855_);}
                                .st883{fill:url(#SVGID_856_);}
                                .st884{fill:url(#SVGID_857_);}
                                .st885{fill:url(#SVGID_858_);}
                                .st886{fill:url(#SVGID_859_);}
                                .st887{fill:url(#SVGID_860_);}
                                .st888{fill:url(#SVGID_861_);}
                                .st889{fill:url(#SVGID_862_);}
                                .st890{fill:url(#SVGID_863_);}
                                .st891{fill:url(#SVGID_864_);}
                                .st892{fill:url(#SVGID_865_);}
                                .st893{fill:url(#SVGID_866_);}
                                .st894{fill:url(#SVGID_867_);}
                                .st895{fill:url(#SVGID_868_);}
                                .st896{fill:url(#SVGID_869_);}
                                .st897{fill:url(#SVGID_870_);}
                                .st898{fill:url(#SVGID_871_);}
                                .st899{fill:url(#SVGID_872_);}
                                .st900{fill:url(#SVGID_873_);}
                                .st901{fill:#A1B8CF;}
                                .st902{fill:url(#SVGID_874_);}
                                .st903{fill:url(#SVGID_875_);}
                                .st904{fill:url(#SVGID_876_);}
                                .st905{fill:url(#SVGID_877_);}
                                .st906{fill:url(#SVGID_878_);}
                                .st907{fill:url(#SVGID_879_);}
                                .st908{fill:url(#SVGID_880_);}
                                .st909{fill:url(#SVGID_881_);}
                                .st910{fill:url(#SVGID_882_);}
                                .st911{fill:url(#SVGID_883_);}
                                .st912{fill:url(#SVGID_884_);}
                                .st913{fill:url(#SVGID_885_);}
                                .st914{fill:url(#SVGID_886_);}
                                .st915{fill:url(#SVGID_887_);}
                                .st916{fill:url(#SVGID_888_);}
                                .st917{fill:url(#SVGID_889_);}
                                .st918{fill:url(#SVGID_890_);}
                                .st919{fill:url(#SVGID_891_);}
                                .st920{fill:url(#SVGID_892_);}
                                .st921{fill:url(#SVGID_893_);}
                                .st922{fill:url(#SVGID_894_);}
                                .st923{fill:url(#SVGID_895_);}
                                .st924{fill:url(#SVGID_896_);}
                                .st925{fill:url(#SVGID_897_);}
                                .st926{fill:url(#SVGID_898_);}
                                .st927{fill:url(#SVGID_899_);}
                                .st928{fill:url(#SVGID_900_);}
                                .st929{fill:url(#SVGID_901_);}
                                .st930{fill:url(#SVGID_902_);}
                                .st931{fill:url(#SVGID_903_);}
                                .st932{fill:url(#SVGID_904_);}
                                .st933{fill:url(#SVGID_905_);}
                                .st934{fill:url(#SVGID_906_);}
                                .st935{fill:url(#SVGID_907_);}
                                .st936{fill:url(#SVGID_908_);}
                                .st937{fill:url(#SVGID_909_);}
                                .st938{fill:url(#SVGID_910_);}
                                .st939{fill:url(#SVGID_911_);}
                                .st940{fill:url(#SVGID_912_);}
                                .st941{fill:url(#SVGID_913_);}
                                .st942{fill:url(#SVGID_914_);}
                                .st943{fill:url(#SVGID_915_);}
                                .st944{fill:url(#SVGID_916_);}
                                .st945{fill:url(#SVGID_917_);}
                                .st946{fill:url(#SVGID_918_);}
                                .st947{fill:url(#SVGID_919_);}
                                .st948{fill:url(#SVGID_920_);}
                                .st949{fill:url(#SVGID_921_);}
                                .st950{fill:url(#SVGID_922_);}
                                .st951{fill:url(#SVGID_923_);}
                                .st952{fill:url(#SVGID_924_);}
                                .st953{fill:url(#SVGID_925_);}
                                .st954{fill:url(#SVGID_926_);}
                                .st955{fill:url(#SVGID_927_);}
                                .st956{fill:url(#SVGID_928_);}
                                .st957{fill:url(#SVGID_929_);}
                                .st958{fill:url(#SVGID_930_);}
                                .st959{fill:url(#SVGID_931_);}
                                .st960{fill:url(#SVGID_932_);}
                                .st961{fill:#AABFD4;}
                                .st962{fill:url(#SVGID_933_);}
                                .st963{fill:url(#SVGID_934_);}
                                .st964{fill:url(#SVGID_935_);}
                                .st965{fill:url(#SVGID_936_);}
                                .st966{fill:url(#SVGID_937_);}
                                .st967{fill:url(#SVGID_938_);}
                                .st968{fill:url(#SVGID_939_);}
                                .st969{fill:url(#SVGID_940_);}
                                .st970{fill:url(#SVGID_941_);}
                                .st971{fill:url(#SVGID_942_);}
                                .st972{fill:url(#SVGID_943_);}
                                .st973{fill:url(#SVGID_944_);}
                                .st974{fill:url(#SVGID_945_);}
                                .st975{fill:url(#SVGID_946_);}
                                .st976{fill:url(#SVGID_947_);}
                                .st977{fill:url(#SVGID_948_);}
                                .st978{fill:url(#SVGID_949_);}
                                .st979{fill:url(#SVGID_950_);}
                                .st980{fill:url(#SVGID_951_);}
                                .st981{fill:url(#SVGID_952_);}
                                .st982{fill:url(#SVGID_953_);}
                                .st983{fill:url(#SVGID_954_);}
                                .st984{fill:url(#SVGID_955_);}
                                .st985{fill:url(#SVGID_956_);}
                                .st986{fill:url(#SVGID_957_);}
                                .st987{fill:url(#SVGID_958_);}
                                .st988{fill:url(#SVGID_959_);}
                                .st989{fill:url(#SVGID_960_);}
                                .st990{fill:url(#SVGID_961_);}
                                .st991{fill:url(#SVGID_962_);}
                                .st992{fill:url(#SVGID_963_);}
                                .st993{fill:url(#SVGID_964_);}
                                .st994{fill:url(#SVGID_965_);}
                                .st995{fill:url(#SVGID_966_);}
                                .st996{fill:#A0B8CF;}
                                .st997{fill:url(#SVGID_967_);}
                                .st998{fill:url(#SVGID_968_);}
                                .st999{fill:url(#SVGID_969_);}
                                .st1000{fill:url(#SVGID_970_);}
                                .st1001{fill:url(#SVGID_971_);}
                                .st1002{fill:url(#SVGID_972_);}
                                .st1003{fill:url(#SVGID_973_);}
                                .st1004{fill:url(#SVGID_974_);}
                                .st1005{fill:url(#SVGID_975_);}
                                .st1006{fill:url(#SVGID_976_);}
                                .st1007{fill:url(#SVGID_977_);}
                                .st1008{fill:url(#SVGID_978_);}
                                .st1009{fill:url(#SVGID_979_);}
                                .st1010{fill:url(#SVGID_980_);}
                                .st1011{fill:url(#SVGID_981_);}
                                .st1012{fill:url(#SVGID_982_);}
                                .st1013{fill:url(#SVGID_983_);}
                                .st1014{fill:url(#SVGID_984_);}
                                .st1015{fill:url(#SVGID_985_);}
                                .st1016{fill:url(#SVGID_986_);}
                                .st1017{fill:url(#SVGID_987_);}
                                .st1018{fill:url(#SVGID_988_);}
                                .st1019{fill:url(#SVGID_989_);}
                                .st1020{fill:url(#SVGID_990_);}
                                .st1021{fill:url(#SVGID_991_);}
                                .st1022{fill:url(#SVGID_992_);}
                                .st1023{fill:url(#SVGID_993_);}
                                .st1024{fill:url(#SVGID_994_);}
                                .st1025{fill:url(#SVGID_995_);}
                                .st1026{fill:url(#SVGID_996_);}
                                .st1027{fill:url(#SVGID_997_);}
                                .st1028{fill:url(#SVGID_998_);}
                                .st1029{fill:url(#SVGID_999_);}
                                .st1030{fill:url(#SVGID_1000_);}
                                .st1031{fill:url(#SVGID_1001_);}
                                .st1032{fill:url(#SVGID_1002_);}
                                .st1033{fill:url(#SVGID_1003_);}
                                .st1034{fill:url(#SVGID_1004_);}
                                .st1035{fill:url(#SVGID_1005_);}
                                .st1036{fill:url(#SVGID_1006_);}
                                .st1037{fill:url(#SVGID_1007_);}
                                .st1038{fill:url(#SVGID_1008_);}
                                .st1039{fill:url(#SVGID_1009_);}
                                .st1040{fill:url(#SVGID_1010_);}
                                .st1041{fill:url(#SVGID_1011_);}
                                .st1042{fill:url(#SVGID_1012_);}
                                .st1043{fill:url(#SVGID_1013_);}
                                .st1044{fill:url(#SVGID_1014_);}
                                .st1045{fill:url(#SVGID_1015_);}
                                .st1046{fill:url(#SVGID_1016_);}
                                .st1047{fill:url(#SVGID_1017_);}
                                .st1048{fill:url(#SVGID_1018_);}
                                .st1049{fill:url(#SVGID_1019_);}
                                .st1050{fill:url(#SVGID_1020_);}
                                .st1051{fill:url(#SVGID_1021_);}
                                .st1052{fill:url(#SVGID_1022_);}
                                .st1053{fill:url(#SVGID_1023_);}
                                .st1054{fill:url(#SVGID_1024_);}
                                .st1055{fill:url(#SVGID_1025_);}
                                .st1056{fill:url(#SVGID_1026_);}
                                .st1057{fill:url(#SVGID_1027_);}
                                .st1058{fill:url(#SVGID_1028_);}
                                .st1059{fill:url(#SVGID_1029_);}
                                .st1060{fill:url(#SVGID_1030_);}
                                .st1061{fill:url(#SVGID_1031_);}
                                .st1062{fill:url(#SVGID_1032_);}
                                .st1063{fill:url(#SVGID_1033_);}
                                .st1064{fill:url(#SVGID_1034_);}
                                .st1065{fill:url(#SVGID_1035_);}
                                .st1066{fill:url(#SVGID_1036_);}
                                .st1067{fill:url(#SVGID_1037_);}
                                .st1068{fill:url(#SVGID_1038_);}
                                .st1069{fill:url(#SVGID_1039_);}
                                .st1070{fill:url(#SVGID_1040_);}
                                .st1071{fill:url(#SVGID_1041_);}
                                .st1072{fill:url(#SVGID_1042_);}
                                .st1073{fill:url(#SVGID_1043_);}
                                .st1074{fill:url(#SVGID_1044_);}
                                .st1075{fill:url(#SVGID_1045_);}
                                .st1076{fill:url(#SVGID_1046_);}
                                .st1077{fill:url(#SVGID_1047_);}
                                .st1078{fill:url(#SVGID_1048_);}
                                .st1079{fill:url(#SVGID_1049_);}
                                .st1080{fill:url(#SVGID_1050_);}
                                .st1081{fill:url(#SVGID_1051_);}
                                .st1082{fill:url(#SVGID_1052_);}
                                .st1083{fill:url(#SVGID_1053_);}
                                .st1084{fill:url(#SVGID_1054_);}
                                .st1085{fill:url(#SVGID_1055_);}
                                .st1086{fill:url(#SVGID_1056_);}
                                .st1087{fill:url(#SVGID_1057_);}
                                .st1088{fill:url(#SVGID_1058_);}
                                .st1089{fill:url(#SVGID_1059_);}
                                .st1090{fill:url(#SVGID_1060_);}
                                .st1091{fill:url(#SVGID_1061_);}
                                .st1092{fill:url(#SVGID_1062_);}
                                .st1093{fill:url(#SVGID_1063_);}
                                .st1094{fill:url(#SVGID_1064_);}
                                .st1095{fill:url(#SVGID_1065_);}
                                .st1096{fill:url(#SVGID_1066_);}
                                .st1097{fill:url(#SVGID_1067_);}
                                .st1098{fill:url(#SVGID_1068_);}
                                .st1099{fill:url(#SVGID_1069_);}
                                .st1100{fill:url(#SVGID_1070_);}
                                .st1101{fill:url(#SVGID_1071_);}
                                .st1102{fill:url(#SVGID_1072_);}
                                .st1103{fill:url(#SVGID_1073_);}
                                .st1104{fill:url(#SVGID_1074_);}
                                .st1105{fill:url(#SVGID_1075_);}
                                .st1106{fill:url(#SVGID_1076_);}
                                .st1107{fill:url(#SVGID_1077_);}
                                .st1108{fill:url(#SVGID_1078_);}
                                .st1109{fill:url(#SVGID_1079_);}
                                .st1110{fill:url(#SVGID_1080_);}
                                .st1111{fill:url(#SVGID_1081_);}
                                .st1112{fill:url(#SVGID_1082_);}
                                .st1113{fill:url(#SVGID_1083_);}
                                .st1114{fill:url(#SVGID_1084_);}
                                .st1115{fill:url(#SVGID_1085_);}
                                .st1116{fill:url(#SVGID_1086_);}
                                .st1117{fill:url(#SVGID_1087_);}
                                .st1118{fill:url(#SVGID_1088_);}
                                .st1119{fill:url(#SVGID_1089_);}
                                .st1120{fill:url(#SVGID_1090_);}
                                .st1121{fill:url(#SVGID_1091_);}
                                .st1122{fill:url(#SVGID_1092_);}
                                .st1123{fill:url(#SVGID_1093_);}
                                .st1124{fill:url(#SVGID_1094_);}
                                .st1125{fill:url(#SVGID_1095_);}
                                .st1126{fill:url(#SVGID_1096_);}
                                .st1127{fill:url(#SVGID_1097_);}
                                .st1128{fill:url(#SVGID_1098_);}
                                .st1129{fill:url(#SVGID_1099_);}
                                .st1130{fill:url(#SVGID_1100_);}
                                .st1131{fill:url(#SVGID_1101_);}
                                .st1132{fill:url(#SVGID_1102_);}
                                .st1133{fill:url(#SVGID_1103_);}
                                .st1134{fill:url(#SVGID_1104_);}
                                .st1135{fill:url(#SVGID_1105_);}
                                .st1136{fill:url(#SVGID_1106_);}
                                .st1137{fill:url(#SVGID_1107_);}
                                .st1138{fill:url(#SVGID_1108_);}
                                .st1139{fill:url(#SVGID_1109_);}
                                .st1140{fill:url(#SVGID_1110_);}
                                .st1141{fill:url(#SVGID_1111_);}
                                .st1142{fill:url(#SVGID_1112_);}
                                .st1143{fill:url(#SVGID_1113_);}
                                .st1144{fill:url(#SVGID_1114_);}
                                .st1145{fill:url(#SVGID_1115_);}
                                .st1146{fill:url(#SVGID_1116_);}
                                .st1147{fill:url(#SVGID_1117_);}
                                .st1148{fill:url(#SVGID_1118_);}
                                .st1149{fill:url(#SVGID_1119_);}
                                .st1150{fill:url(#SVGID_1120_);}
                                .st1151{fill:url(#SVGID_1121_);}
                                .st1152{fill:url(#SVGID_1122_);}
                                .st1153{fill:url(#SVGID_1123_);}
                                .st1154{fill:url(#SVGID_1124_);}
                                .st1155{fill:url(#SVGID_1125_);}
                                .st1156{fill:url(#SVGID_1126_);}
                                .st1157{fill:url(#SVGID_1127_);}
                                .st1158{fill:url(#SVGID_1128_);}
                                .st1159{fill:url(#SVGID_1129_);}
                                .st1160{fill:url(#SVGID_1130_);}
                                .st1161{fill:url(#SVGID_1131_);}
                                .st1162{fill:url(#SVGID_1132_);}
                                .st1163{fill:url(#SVGID_1133_);}
                                .st1164{fill:url(#SVGID_1134_);}
                                .st1165{fill:url(#SVGID_1135_);}
                                .st1166{fill:url(#SVGID_1136_);}
                                .st1167{fill:url(#SVGID_1137_);}
                                .st1168{fill:url(#SVGID_1138_);}
                                .st1169{fill:url(#SVGID_1139_);}
                                .st1170{fill:url(#SVGID_1140_);}
                                .st1171{fill:url(#SVGID_1141_);}
                                .st1172{fill:url(#SVGID_1142_);}
                                .st1173{fill:url(#SVGID_1143_);}
                                .st1174{fill:url(#SVGID_1144_);}
                                .st1175{fill:url(#SVGID_1145_);}
                                .st1176{fill:url(#SVGID_1146_);}
                                .st1177{fill:url(#SVGID_1147_);}
                                .st1178{fill:url(#SVGID_1148_);}
                                .st1179{fill:url(#SVGID_1149_);}
                                .st1180{fill:url(#SVGID_1150_);}
                                .st1181{fill:url(#SVGID_1151_);}
                                .st1182{fill:url(#SVGID_1152_);}
                                .st1183{fill:url(#SVGID_1153_);}
                                .st1184{fill:url(#SVGID_1154_);}
                                .st1185{fill:url(#SVGID_1155_);}
                                .st1186{fill:url(#SVGID_1156_);}
                                .st1187{fill:url(#SVGID_1157_);}
                                .st1188{fill:url(#SVGID_1158_);}
                                .st1189{fill:url(#SVGID_1159_);}
                                .st1190{fill:url(#SVGID_1160_);}
                                .st1191{fill:url(#SVGID_1161_);}
                                .st1192{fill:url(#SVGID_1162_);}
                                .st1193{fill:url(#SVGID_1163_);}
                                .st1194{fill:url(#SVGID_1164_);}
                                .st1195{fill:url(#SVGID_1165_);}
                                .st1196{fill:url(#SVGID_1166_);}
                                .st1197{fill:url(#SVGID_1167_);}
                                .st1198{fill:url(#SVGID_1168_);}
                                .st1199{fill:url(#SVGID_1169_);}
                                .st1200{fill:url(#SVGID_1170_);}
                                .st1201{fill:url(#SVGID_1171_);}
                                .st1202{fill:url(#SVGID_1172_);}
                                .st1203{fill:url(#SVGID_1173_);}
                                .st1204{fill:url(#SVGID_1174_);}
                                .st1205{fill:url(#SVGID_1175_);}
                                .st1206{fill:url(#SVGID_1176_);}
                                .st1207{fill:url(#SVGID_1177_);}
                                .st1208{fill:url(#SVGID_1178_);}
                                .st1209{fill:url(#SVGID_1179_);}
                                .st1210{fill:url(#SVGID_1180_);}
                                .st1211{fill:url(#SVGID_1181_);}
                                .st1212{fill:url(#SVGID_1182_);}
                                .st1213{fill:url(#SVGID_1183_);}
                                .st1214{fill:url(#SVGID_1184_);}
                                .st1215{fill:url(#SVGID_1185_);}
                                .st1216{fill:url(#SVGID_1186_);}
                                .st1217{fill:url(#SVGID_1187_);}
                                .st1218{fill:url(#SVGID_1188_);}
                                .st1219{fill:url(#SVGID_1189_);}
                                .st1220{fill:url(#SVGID_1190_);}
                                .st1221{fill:url(#SVGID_1191_);}
                                .st1222{fill:url(#SVGID_1192_);}
                                .st1223{fill:url(#SVGID_1193_);}
                                .st1224{fill:url(#SVGID_1194_);}
                                .st1225{fill:url(#SVGID_1195_);}
                                .st1226{fill:url(#SVGID_1196_);}
                                .st1227{fill:url(#SVGID_1197_);}
                                .st1228{fill:url(#SVGID_1198_);}
                                .st1229{fill:url(#SVGID_1199_);}
                                .st1230{fill:url(#SVGID_1200_);}
                                .st1231{fill:url(#SVGID_1201_);}
                                .st1232{fill:url(#SVGID_1202_);}
                                .st1233{fill:url(#SVGID_1203_);}
                                .st1234{fill:url(#SVGID_1204_);}
                                .st1235{fill:url(#SVGID_1205_);}
                                .st1236{fill:url(#SVGID_1206_);}
                                .st1237{fill:url(#SVGID_1207_);}
                                .st1238{fill:url(#SVGID_1208_);}
                                .st1239{fill:url(#SVGID_1209_);}
                                .st1240{fill:url(#SVGID_1210_);}
                                .st1241{fill:url(#SVGID_1211_);}
                                .st1242{fill:url(#SVGID_1212_);}
                                .st1243{fill:url(#SVGID_1213_);}
                                .st1244{fill:url(#SVGID_1214_);}
                                .st1245{fill:url(#SVGID_1215_);}
                                .st1246{fill:url(#SVGID_1216_);}
                                .st1247{fill:url(#SVGID_1217_);}
                                .st1248{fill:url(#SVGID_1218_);}
                            </style>
                            <g id="暂无内容">
                                <g id="背景">
                                    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="256.1428" y1="427.0489" x2="256.1428" y2="330.2607">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#DBE3EE"/>
                                    </linearGradient>
                                    <path class="st0" d="M270.6,333.67v-3.41h-29.5v3.96h-6.48v92.83h43.05v-93.38H270.6z M273.94,416.4H237.9v-2.75h36.04V416.4z
                                         M273.94,403.73H237.9v-2.75h36.04V403.73z M273.94,391.05H237.9v-2.75h36.04V391.05z M273.94,378.71H237.9v-2.75h36.04V378.71z
                                         M273.94,366.39H237.9v-2.75h36.04V366.39z M273.94,353.72H237.9v-2.75h36.04V353.72z M273.94,341.38H237.9v-2.75h36.04V341.38z"
                                        />
                                    <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="191.5258" y1="485.0408" x2="191.5258" y2="268.5518">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#DBE3EE"/>
                                    </linearGradient>
                                    <path class="st1" d="M212.62,385.48V277.29h-32.75v-8.74H166v53.33h-3.73v163.16h58.51v-99.56H212.62z M188.12,417.29h-8.26v-8.01
                                        h8.26V417.29z M188.12,404.76h-8.26v-8.01h8.26V404.76z M188.12,392.28h-8.26v-8.01h8.26V392.28z M188.12,379.85h-8.26v-8.01h8.26
                                        V379.85z M188.12,367.31h-8.26v-8.01h8.26V367.31z M188.12,342.31h-8.26v-8.01h8.26V342.31z M188.12,329.78h-8.26v-8.01h8.26
                                        V329.78z M188.12,317.31h-8.26v-8.01h8.26V317.31z M188.12,304.87h-8.26v-8.01h8.26V304.87z M188.12,292.34h-8.26v-8.01h8.26
                                        V292.34z M200.47,417.29h-8.26v-8.01h8.26V417.29z M200.47,404.76h-8.26v-8.01h8.26V404.76z M200.47,392.28h-8.26v-8.01h8.26
                                        V392.28z M200.47,379.85h-8.26v-8.01h8.26V379.85z M200.47,367.31h-8.26v-8.01h8.26V367.31z M200.47,342.31h-8.26v-8.01h8.26
                                        V342.31z M200.47,329.78h-8.26v-8.01h8.26V329.78z M200.47,317.31h-8.26v-8.01h8.26V317.31z M200.47,304.87h-8.26v-8.01h8.26
                                        V304.87z M200.47,292.34h-8.26v-8.01h8.26V292.34z"/>
                                    <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="567.3074" y1="442.3619" x2="567.3074" y2="285.8811">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#DBE3EE"/>
                                    </linearGradient>
                                    <path class="st2" d="M534.92,442.36c0.36-4.65,0-156.48,0-156.48h18.53v33.71h29.5v70.45h16.73v52.32H534.92z"/>
                                    <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="629.8322" y1="465.0319" x2="629.8322" y2="295.2913">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#DBE3EE"/>
                                    </linearGradient>
                                    <path class="st3" d="M656.14,374.22v-4.85h-5v-42.33h-12.2v-4.7h-8.23v-6.91h-4.29v-20.14h-3.09v20.28h-3.94v6.91h-12.2v11.32
                                        h-7.05v131.23h59.38v-90.82H656.14z M610.63,427h-4.02v-15.24h4.02V427z M610.63,408.35h-4.02v-15.24h4.02V408.35z M610.63,389.7
                                        h-4.02v-15.24h4.02V389.7z M610.63,370.71h-4.02v-15.24h4.02V370.71z M610.63,351.73h-4.02v-15.24h4.02V351.73z M618.91,427h-4.02
                                        v-15.24h4.02V427z M618.91,408.35h-4.02v-15.24h4.02V408.35z M618.91,389.7h-4.02v-15.24h4.02V389.7z M618.91,370.71h-4.02v-15.24
                                        h4.02V370.71z M618.91,351.73h-4.02v-15.24h4.02V351.73z M627.19,427h-4.02v-15.24h4.02V427z M627.19,408.35h-4.02v-15.24h4.02
                                        V408.35z M627.19,389.7h-4.02v-15.24h4.02V389.7z M627.19,370.71h-4.02v-15.24h4.02V370.71z M627.19,351.73h-4.02v-15.24h4.02
                                        V351.73z M635.47,427h-4.02v-15.24h4.02V427z M635.47,408.35h-4.02v-15.24h4.02V408.35z M635.47,389.7h-4.02v-15.24h4.02V389.7z
                                         M635.47,370.71h-4.02v-15.24h4.02V370.71z M635.47,351.73h-4.02v-15.24h4.02V351.73z M643.75,427h-4.02v-15.24h4.02V427z
                                         M643.75,408.35h-4.02v-15.24h4.02V408.35z M643.75,389.7h-4.02v-15.24h4.02V389.7z M643.75,370.71h-4.02v-15.24h4.02V370.71z
                                         M643.75,351.73h-4.02v-15.24h4.02V351.73z"/>
                                    <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="121.1197" y1="507.1104" x2="121.1197" y2="356.597">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#EDF1F9"/>
                                    </linearGradient>
                                    <polygon class="st4" points="94.49,507.11 94.49,417.57 104.75,417.57 104.75,371.87 140.01,356.6 140.01,416.85 147.75,416.85 
                                        147.75,507.11 		"/>
                                    <linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="683.7928" y1="490.505" x2="683.7928" y2="367.3728">
                                        <stop  offset="5.358273e-07" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#EDF1F9"/>
                                    </linearGradient>
                                    <polygon class="st5" points="699.26,490.51 668.32,490.51 668.32,367.37 699.26,382.34 		"/>
                                    <linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="127.0833" y1="234.8031" x2="127.0833" y2="170.2619">
                                        <stop  offset="0.2332" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#D3DFEE"/>
                                    </linearGradient>
                                    <path class="st6" d="M89.31,193.69c0,0,9.34-25.48,32.3-15.48c5.3-5.38,11.86-9.29,20.73-7.53c8.87,1.77,14.59,8.41,16.53,12.83
                                        c2.78-0.13,25.04,0.61,25.04,23.7s-26.94,22.65-28.89,20.82c-2.4,2.14-13.94,13.75-27.94,0.5c-3.03,2.59-12.93,13.56-28.58-1.58
                                        c-7.25,3.03-24.48,5.36-27.82-12.43S84.48,191.72,89.31,193.69z"/>
                                    <linearGradient id="SVGID_8_" gradientUnits="userSpaceOnUse" x1="644.1518" y1="197.9827" x2="644.1518" y2="133.4415">
                                        <stop  offset="0.2332" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#D3DFEE"/>
                                    </linearGradient>
                                    <path class="st7" d="M606.38,156.87c0,0,9.34-25.48,32.3-15.48c5.3-5.38,11.86-9.29,20.73-7.53c8.87,1.77,14.59,8.41,16.53,12.83
                                        c2.78-0.13,25.04,0.61,25.04,23.7s-26.94,22.65-28.89,20.82c-2.4,2.14-13.94,13.75-27.94,0.5c-3.03,2.59-12.93,13.56-28.58-1.58
                                        c-7.25,3.03-24.48,5.36-27.82-12.43C584.41,159.92,601.54,154.9,606.38,156.87z"/>
                                    <linearGradient id="SVGID_9_" gradientUnits="userSpaceOnUse" x1="514.3809" y1="241.1562" x2="514.3809" y2="194.4389">
                                        <stop  offset="0.2332" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#D3DFEE"/>
                                    </linearGradient>
                                    <path class="st8" d="M487.04,211.4c0,0,6.76-18.45,23.38-11.2c3.84-3.9,8.58-6.73,15.01-5.45c6.42,1.28,10.56,6.09,11.96,9.28
                                        c2.01-0.09,18.13,0.44,18.13,17.15s-19.5,16.39-20.91,15.07c-1.74,1.55-10.09,9.95-20.23,0.37c-2.19,1.87-9.36,9.82-20.68-1.14
                                        c-5.25,2.19-17.72,3.88-20.14-9C471.14,213.61,483.54,209.97,487.04,211.4z"/>
                                    <linearGradient id="SVGID_10_" gradientUnits="userSpaceOnUse" x1="400.5981" y1="756.681" x2="400.5981" y2="404.5521">
                                        <stop  offset="0.4065" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#DAE4EF"/>
                                    </linearGradient>
                                    <ellipse class="st9" cx="400.6" cy="580.62" rx="370.98" ry="176.06"/>
                                </g>
                                <g id="箱子">
                                    <linearGradient id="SVGID_11_" gradientUnits="userSpaceOnUse" x1="514.17" y1="646.2693" x2="476.6381" y2="409.3021">
                                        <stop  offset="0.1468" style="stop-color:#FFFFFF"/>
                                        <stop  offset="1" style="stop-color:#BBCBE0"/>
                                    </linearGradient>
                                    <polygon class="st10" points="273.53,441.47 405.52,663.48 713.83,592.36 524.51,439.38 		"/>
                                    <linearGradient id="SVGID_12_" gradientUnits="userSpaceOnUse" x1="273.527" y1="358.7491" x2="387.3339" y2="358.7491">
                                        <stop  offset="5.309115e-07" style="stop-color:#E5ECF3"/>
                                        <stop  offset="1" style="stop-color:#BECFE0"/>
                                    </linearGradient>
                                    <polygon class="st11" points="273.53,434.34 387.33,434.34 387.33,283.16 273.53,313.02 		"/>
                                    <linearGradient id="SVGID_13_" gradientUnits="userSpaceOnUse" x1="387.3339" y1="333.3335" x2="524.6158" y2="333.3335">
                                        <stop  offset="0" style="stop-color:#D9E3ED"/>
                                        <stop  offset="1" style="stop-color:#ACC2DB"/>
                                    </linearGradient>
                                    <polygon class="st12" points="524.62,383.51 387.33,383.51 387.33,283.16 524.62,314.52 		"/>
                                    <linearGradient id="SVGID_14_" gradientUnits="userSpaceOnUse" x1="253.7835" y1="377.7169" x2="253.7835" y2="313.0197">
                                        <stop  offset="0" style="stop-color:#EFF3F9"/>
                                        <stop  offset="0.9705" style="stop-color:#9CB6D2"/>
                                    </linearGradient>
                                    <polygon class="st13" points="273.53,313.02 234.04,360.07 273.53,377.72 		"/>
                                    <linearGradient id="SVGID_15_" gradientUnits="userSpaceOnUse" x1="273.527" y1="404.4785" x2="407.8041" y2="404.4785">
                                        <stop  offset="0" style="stop-color:#EFF3F9"/>
                                        <stop  offset="1" style="stop-color:#B4C7DC"/>
                                    </linearGradient>
                                    <polygon class="st14" points="407.8,495.94 273.53,441.48 273.53,313.02 407.8,347.2 		"/>
                                    <linearGradient id="SVGID_16_" gradientUnits="userSpaceOnUse" x1="381.4455" y1="464.5241" x2="539.3229" y2="332.0493">
                                        <stop  offset="0" style="stop-color:#EFF3F9"/>
                                        <stop  offset="0.9705" style="stop-color:#9CB6D2"/>
                                    </linearGradient>
                                    <polygon class="st15" points="407.8,495.94 524.62,439.6 524.62,314.52 407.8,347.2 		"/>
                                    <linearGradient id="SVGID_17_" gradientUnits="userSpaceOnUse" x1="407.8041" y1="363.7258" x2="564.1791" y2="363.7258">
                                        <stop  offset="0" style="stop-color:#D5E0EE"/>
                                        <stop  offset="1" style="stop-color:#F5F9FA"/>
                                    </linearGradient>
                                    <polygon class="st16" points="524.62,314.52 564.18,367.48 449.62,412.93 407.8,347.2 		"/>
                                    <linearGradient id="SVGID_18_" gradientUnits="userSpaceOnUse" x1="238.0327" y1="365.6977" x2="407.8041" y2="365.6977">
                                        <stop  offset="4.424263e-07" style="stop-color:#F7FAFB"/>
                                        <stop  offset="1" style="stop-color:#D5E0EE"/>
                                    </linearGradient>
                                    <polygon class="st17" points="273.53,313.02 238.03,372.36 377.38,418.38 407.8,347.2 		"/>
                                </g>
                                <g id="树苗">
                                    <g>
                                        <linearGradient id="SVGID_19_" gradientUnits="userSpaceOnUse" x1="191.5277" y1="580.1368" x2="140.0915" y2="518.8375">
                                            <stop  offset="0.4034" style="stop-color:#EFF4F8"/>
                                            <stop  offset="1" style="stop-color:#D4DFEC"/>
                                        </linearGradient>
                                        <path class="st18" d="M146.55,559.08c0,0-3.53,5.01,2.37,12.47c5.26,6.64,13.57,5.35,16.33,3.22
                                            c0.85,5.78,7.94,17.96,19.16,11.07c10.55-6.47,5.47-16.31,2.1-20.18c6.59-1.86,11.5-17.65-3.62-23.1
                                            c2.24-6.52,2.64-9.47-0.64-15.33c-3.16-5.64-8.35-6.54-16.63-3.11l-11.98,5.05l-7.63-14.24l-4.08,2.36l8.8,13.6l-11.66,5.85
                                            c0,0-9.97,3.9-5.67,14.6C137.39,561.26,146.55,559.08,146.55,559.08z"/>
                                        <linearGradient id="SVGID_20_" gradientUnits="userSpaceOnUse" x1="112.4799" y1="459.8465" x2="176.6667" y2="459.8465">
                                            <stop  offset="0.1022" style="stop-color:#F0F5F8"/>
                                            <stop  offset="1" style="stop-color:#B4C7DC"/>
                                        </linearGradient>
                                        <path class="st19" d="M126.25,498.37h36.06c0,0,11.65,0.33,13.97-12.98c2.55-14.61-8.08-16.62-8.08-16.62s6.4-2.94,5.01-13.99
                                            s-11.12-12.44-15.17-11.93c0.66-6.55,2.04-21.38-13.36-21.53c-14.87-0.15-14.78,14.82-13.67,20.72
                                            c-5.3,0.06-21.31,8.01-10.05,25.45c-6.13,5.25-8.72,8.28-8.45,15.85C112.78,490.91,117.41,498.37,126.25,498.37z"/>
                                        <polygon class="st20" points="161.42,478.13 146.04,488.25 145.62,478.47 155.35,467.01 145.47,474.99 144.19,445.09 
                                            143.25,475.18 132.87,466.92 143.15,478.25 142.84,488.32 127.02,476.7 142.72,491.95 141.93,517.31 147.29,517.31 146.21,492.1 
                                                        "/>
                                    </g>
                                    <g>
                                        <linearGradient id="SVGID_21_" gradientUnits="userSpaceOnUse" x1="710.3898" y1="560.1642" x2="663.0244" y2="503.7163">
                                            <stop  offset="0.4034" style="stop-color:#EFF4F8"/>
                                            <stop  offset="1" style="stop-color:#D4DFEC"/>
                                        </linearGradient>
                                        <path class="st21" d="M668.97,540.78c0,0-3.25,4.62,2.18,11.48c4.84,6.12,12.5,4.93,15.04,2.96c0.78,5.32,7.32,16.53,17.65,10.2
                                            c9.71-5.96,5.04-15.02,1.93-18.58c6.07-1.71,10.59-16.26-3.33-21.27c2.07-6,2.44-8.72-0.59-14.11
                                            c-2.91-5.19-7.69-6.03-15.31-2.86l-11.04,4.65l-7.03-13.11l-3.75,2.17l8.1,12.52l-10.73,5.39c0,0-9.18,3.59-5.22,13.45
                                            C660.53,542.78,668.97,540.78,668.97,540.78z"/>
                                        <linearGradient id="SVGID_22_" gradientUnits="userSpaceOnUse" x1="637.5981" y1="449.394" x2="696.705" y2="449.394">
                                            <stop  offset="0.1022" style="stop-color:#F0F5F8"/>
                                            <stop  offset="1" style="stop-color:#B4C7DC"/>
                                        </linearGradient>
                                        <path class="st22" d="M650.28,484.87h33.2c0,0,10.73,0.31,12.86-11.95c2.34-13.45-7.44-15.3-7.44-15.3s5.9-2.71,4.61-12.88
                                            c-1.29-10.17-10.24-11.46-13.97-10.98c0.61-6.03,1.88-19.69-12.3-19.83c-13.69-0.14-13.61,13.64-12.59,19.08
                                            c-4.88,0.05-19.63,7.37-9.25,23.44c-5.64,4.83-8.03,7.63-7.78,14.59S642.14,484.87,650.28,484.87z"/>
                                        <polygon class="st20" points="682.66,466.23 668.5,475.55 668.12,466.54 677.07,455.99 667.98,463.34 666.8,435.8 665.93,463.52 
                                            656.38,455.91 665.84,466.34 665.55,475.61 650.99,464.91 665.45,478.96 664.72,502.31 669.65,502.31 668.66,479.1 			"/>
                                    </g>
                                    <g>
                                        <linearGradient id="SVGID_23_" gradientUnits="userSpaceOnUse" x1="251.7272" y1="460.9935" x2="226.2859" y2="430.6737">
                                            <stop  offset="1.438503e-07" style="stop-color:#EAEFF6"/>
                                            <stop  offset="1" style="stop-color:#CDDAE9"/>
                                        </linearGradient>
                                        <path class="st23" d="M229.48,450.58c0,0-1.75,2.48,1.17,6.17c2.6,3.29,6.71,2.65,8.08,1.59c0.42,2.86,3.93,8.88,9.48,5.48
                                            c5.22-3.2,2.71-8.07,1.04-9.98c3.26-0.92,5.69-8.73-1.79-11.42c1.11-3.22,1.31-4.68-0.32-7.58c-1.56-2.79-4.13-3.24-8.22-1.54
                                            l-5.93,2.5l-3.77-7.04l-2.02,1.17l4.35,6.72l-5.77,2.89c0,0-4.93,1.93-2.8,7.22C224.95,451.66,229.48,450.58,229.48,450.58z"/>
                                        <linearGradient id="SVGID_24_" gradientUnits="userSpaceOnUse" x1="212.6287" y1="401.4957" x2="244.3767" y2="401.4957">
                                            <stop  offset="0.1022" style="stop-color:#F0F5F8"/>
                                            <stop  offset="1" style="stop-color:#B4C7DC"/>
                                        </linearGradient>
                                        <path class="st24" d="M219.44,420.55h17.83c0,0,5.76,0.16,6.91-6.42c1.26-7.23-4-8.22-4-8.22s3.17-1.46,2.48-6.92
                                            s-5.5-6.15-7.5-5.9c0.33-3.24,1.01-10.58-6.61-10.65c-7.36-0.07-7.31,7.33-6.76,10.25c-2.62,0.03-10.54,3.96-4.97,12.59
                                            c-3.03,2.59-4.32,4.1-4.18,7.84C212.78,416.86,215.07,420.55,219.44,420.55z"/>
                                        <polygon class="st20" points="236.84,410.54 229.23,415.55 229.02,410.71 233.83,405.04 228.95,408.99 228.31,394.19 
                                            227.85,409.08 222.72,405 227.8,410.6 227.64,415.58 219.82,409.83 227.59,417.38 227.19,429.92 229.84,429.92 229.31,417.45 			
                                            "/>
                                    </g>
                                </g>
                                <g id="发送">
                                    <g>
                                        <g>
                                            <linearGradient id="SVGID_25_" gradientUnits="userSpaceOnUse" x1="478.348" y1="344.3563" x2="478.348" y2="156.6276">
                                                <stop  offset="5.358273e-07" style="stop-color:#F3F6F9"/>
                                                <stop  offset="1" style="stop-color:#D0DAE8"/>
                                            </linearGradient>
                                            <path class="st25" d="M477.43,159.39c-0.39,0-0.76-0.23-0.92-0.61c-0.22-0.51,0.02-1.1,0.52-1.31c1.22-0.52,1.88-0.78,1.88-0.78
                                                c0.52-0.2,1.09,0.05,1.29,0.57c0.2,0.51-0.05,1.09-0.57,1.29c-0.01,0-0.64,0.25-1.81,0.75
                                                C477.69,159.37,477.56,159.39,477.43,159.39z"/>
                                        </g>
                                        <g>
                                            <linearGradient id="SVGID_26_" gradientUnits="userSpaceOnUse" x1="422.0042" y1="342.4409" x2="422.0042" y2="156.652">
                                                <stop  offset="5.358273e-07" style="stop-color:#F3F6F9"/>
                                                <stop  offset="1" style="stop-color:#D0DAE8"/>
                                            </linearGradient>
                                            <path class="st26" d="M408.55,339.08c-0.4,0-0.79-0.25-0.94-0.65c-0.48-1.29-0.86-2.64-1.13-4.01c-0.1-0.54,0.25-1.07,0.79-1.17
                                                c0.54-0.11,1.07,0.25,1.17,0.79c0.24,1.26,0.59,2.5,1.04,3.68c0.19,0.52-0.07,1.09-0.58,1.29
                                                C408.79,339.06,408.67,339.08,408.55,339.08z M421.97,331.39c-0.01,0-0.02,0-0.02,0c-1.37-0.03-2.74-0.12-4.07-0.26
                                                c-0.55-0.06-0.95-0.55-0.89-1.1s0.55-0.95,1.1-0.89c1.28,0.14,2.59,0.22,3.91,0.25c0.55,0.01,0.99,0.47,0.98,1.02
                                                C422.96,330.96,422.51,331.39,421.97,331.39z M425.97,331.33c-0.53,0-0.97-0.41-1-0.95c-0.03-0.55,0.39-1.02,0.94-1.05
                                                c1.29-0.07,2.6-0.19,3.91-0.36c0.55-0.07,1.05,0.32,1.12,0.87s-0.32,1.05-0.87,1.12c-1.36,0.17-2.72,0.3-4.06,0.37
                                                C426.01,331.33,425.99,331.33,425.97,331.33z M407.04,331.26c-0.54,0-0.98-0.43-1-0.97c-0.01-0.23-0.01-0.47-0.01-0.71
                                                c0-0.44,0.01-0.88,0.03-1.32c-0.02-0.01-0.03-0.01-0.05-0.02c-1.28-0.47-2.54-0.99-3.76-1.53c-0.5-0.23-0.73-0.82-0.51-1.32
                                                c0.23-0.5,0.82-0.73,1.32-0.51c1.03,0.46,2.1,0.9,3.18,1.31c0-0.02,0-0.03,0.01-0.05c0.07-0.55,0.57-0.93,1.12-0.87
                                                c0.55,0.07,0.94,0.57,0.87,1.12c-0.14,1.07-0.2,2.14-0.2,3.19c0,0.22,0,0.44,0.01,0.65c0.01,0.55-0.42,1.01-0.97,1.03
                                                C407.06,331.26,407.05,331.26,407.04,331.26z M414.03,330.53c-0.07,0-0.13-0.01-0.2-0.02c-1.1-0.22-2.19-0.48-3.24-0.78
                                                l-0.73-0.21c-0.53-0.16-0.83-0.71-0.67-1.24c0.16-0.53,0.71-0.83,1.24-0.67l0.7,0.21c1,0.29,2.04,0.54,3.09,0.75
                                                c0.54,0.11,0.89,0.64,0.78,1.18C414.91,330.21,414.5,330.53,414.03,330.53z M433.91,330.32c-0.47,0-0.89-0.33-0.98-0.81
                                                c-0.11-0.54,0.24-1.07,0.79-1.18c1.28-0.25,2.56-0.55,3.83-0.89c0.53-0.14,1.08,0.17,1.23,0.71s-0.17,1.08-0.71,1.23
                                                c-1.31,0.35-2.64,0.66-3.96,0.92C434.04,330.31,433.97,330.32,433.91,330.32z M441.63,328.25c-0.42,0-0.81-0.26-0.95-0.68
                                                c-0.18-0.52,0.1-1.09,0.62-1.27c1.24-0.42,2.48-0.89,3.68-1.39c0.51-0.21,1.1,0.03,1.31,0.54c0.21,0.51-0.03,1.1-0.54,1.31
                                                c-1.24,0.52-2.52,1-3.8,1.44C441.85,328.23,441.74,328.25,441.63,328.25z M449.01,325.17c-0.37,0-0.72-0.2-0.89-0.55
                                                c-0.25-0.49-0.05-1.09,0.44-1.34c1.19-0.6,2.34-1.24,3.43-1.9c0.47-0.29,1.09-0.13,1.37,0.34s0.13,1.09-0.34,1.37
                                                c-1.14,0.69-2.34,1.35-3.57,1.97C449.31,325.13,449.16,325.17,449.01,325.17z M399.07,325.04c-0.16,0-0.32-0.04-0.47-0.12
                                                c-1.2-0.64-2.38-1.33-3.52-2.05c-0.47-0.29-0.61-0.91-0.31-1.38c0.29-0.47,0.91-0.61,1.38-0.31c1.09,0.69,2.24,1.36,3.39,1.97
                                                c0.49,0.26,0.67,0.87,0.41,1.35C399.77,324.85,399.42,325.04,399.07,325.04z M408.02,323.35c-0.09,0-0.17-0.01-0.26-0.03
                                                c-0.53-0.14-0.85-0.69-0.71-1.23c0.35-1.29,0.79-2.6,1.32-3.9c0.21-0.51,0.79-0.76,1.3-0.55c0.51,0.21,0.76,0.79,0.55,1.3
                                                c-0.49,1.22-0.91,2.46-1.24,3.67C408.87,323.05,408.46,323.35,408.02,323.35z M455.84,321.01c-0.31,0-0.61-0.14-0.8-0.41
                                                c-0.33-0.44-0.23-1.07,0.21-1.4c1.09-0.8,2.09-1.64,2.99-2.48c0.4-0.38,1.04-0.36,1.41,0.04c0.38,0.4,0.36,1.04-0.04,1.41
                                                c-0.95,0.89-2.02,1.78-3.17,2.63C456.25,320.95,456.04,321.01,455.84,321.01z M392.31,320.77c-0.21,0-0.42-0.06-0.59-0.2
                                                c-1.09-0.81-2.16-1.66-3.18-2.55c-0.42-0.36-0.46-0.99-0.1-1.41c0.36-0.42,0.99-0.46,1.41-0.1c0.98,0.85,2.01,1.68,3.06,2.45
                                                c0.44,0.33,0.54,0.96,0.21,1.4C392.92,320.63,392.62,320.77,392.31,320.77z M410.99,315.94c-0.16,0-0.32-0.04-0.47-0.12
                                                c-0.49-0.26-0.67-0.86-0.41-1.35c0.63-1.18,1.35-2.36,2.15-3.51c0.31-0.45,0.94-0.57,1.39-0.25c0.45,0.31,0.57,0.94,0.25,1.39
                                                c-0.75,1.08-1.43,2.2-2.02,3.31C411.69,315.75,411.35,315.94,410.99,315.94z M386.28,315.54c-0.26,0-0.51-0.1-0.71-0.3
                                                c-0.95-0.96-1.88-1.97-2.76-3c-0.36-0.42-0.31-1.05,0.11-1.41c0.42-0.36,1.05-0.31,1.41,0.11c0.85,0.99,1.74,1.96,2.65,2.89
                                                c0.39,0.39,0.39,1.03-0.01,1.41C386.79,315.44,386.53,315.54,386.28,315.54z M461.6,315.5c-0.21,0-0.42-0.07-0.61-0.2
                                                c-0.44-0.33-0.52-0.96-0.19-1.4c0.12-0.16,0.24-0.32,0.36-0.49c0.65-0.92,1.24-1.84,1.75-2.75c0.27-0.48,0.88-0.65,1.36-0.38
                                                c0.48,0.27,0.65,0.88,0.38,1.36c-0.54,0.97-1.17,1.95-1.86,2.93c-0.13,0.18-0.26,0.36-0.4,0.54
                                                C462.2,315.37,461.9,315.5,461.6,315.5z M381.1,309.46c-0.31,0-0.61-0.14-0.81-0.41c-0.79-1.09-1.56-2.22-2.28-3.37
                                                c-0.29-0.47-0.15-1.09,0.32-1.38c0.47-0.29,1.09-0.15,1.38,0.32c0.69,1.11,1.43,2.2,2.2,3.25c0.33,0.45,0.23,1.07-0.22,1.4
                                                C381.51,309.4,381.3,309.46,381.1,309.46z M415.52,309.37c-0.23,0-0.46-0.08-0.65-0.24c-0.42-0.36-0.47-0.99-0.11-1.41
                                                c0.87-1.01,1.81-2.01,2.81-2.98c0.4-0.38,1.03-0.38,1.41,0.02s0.38,1.03-0.02,1.41c-0.95,0.92-1.85,1.88-2.68,2.84
                                                C416.09,309.25,415.81,309.37,415.52,309.37z M465.45,308.52c-0.11,0-0.22-0.02-0.33-0.06c-0.52-0.18-0.79-0.76-0.61-1.28
                                                c0.45-1.26,0.73-2.48,0.85-3.65c0.05-0.55,0.54-0.95,1.09-0.9c0.55,0.05,0.95,0.54,0.9,1.09c-0.13,1.33-0.45,2.71-0.95,4.12
                                                C466.25,308.27,465.86,308.52,465.45,308.52z M421.25,303.79c-0.29,0-0.57-0.12-0.77-0.36c-0.35-0.43-0.29-1.06,0.13-1.41
                                                c1.03-0.85,2.12-1.68,3.24-2.48c0.45-0.32,1.07-0.21,1.39,0.24c0.32,0.45,0.21,1.07-0.24,1.39c-1.08,0.77-2.13,1.57-3.12,2.39
                                                C421.7,303.72,421.47,303.79,421.25,303.79z M376.87,302.68c-0.36,0-0.71-0.19-0.89-0.53c-0.63-1.19-1.22-2.43-1.77-3.66
                                                c-0.22-0.51,0.01-1.1,0.51-1.32c0.51-0.22,1.1,0.01,1.32,0.51c0.53,1.2,1.1,2.39,1.71,3.54c0.26,0.49,0.07,1.09-0.42,1.35
                                                C377.18,302.64,377.02,302.68,376.87,302.68z M466.11,300.66c-0.45,0-0.86-0.31-0.97-0.77c-0.28-1.18-0.79-2.28-1.49-3.26
                                                c-0.32-0.45-0.22-1.07,0.23-1.4c0.45-0.32,1.07-0.22,1.4,0.23c0.86,1.2,1.47,2.53,1.81,3.96c0.13,0.54-0.2,1.08-0.74,1.21
                                                C466.26,300.65,466.18,300.66,466.11,300.66z M427.77,299.16c-0.34,0-0.67-0.17-0.85-0.48c-0.29-0.47-0.14-1.09,0.33-1.37
                                                c1.15-0.7,2.34-1.38,3.54-2.01c0.49-0.26,1.09-0.07,1.35,0.42c0.26,0.49,0.07,1.09-0.42,1.35c-1.16,0.61-2.31,1.26-3.42,1.94
                                                C428.13,299.11,427.95,299.16,427.77,299.16z M434.85,295.44c-0.38,0-0.75-0.22-0.91-0.59c-0.22-0.5,0-1.1,0.51-1.32
                                                c1.25-0.55,2.52-1.07,3.77-1.52c0.52-0.19,1.09,0.08,1.28,0.6c0.19,0.52-0.08,1.09-0.6,1.28c-1.21,0.44-2.44,0.94-3.65,1.47
                                                C435.12,295.41,434.99,295.44,434.85,295.44z M373.64,295.36c-0.41,0-0.79-0.25-0.94-0.66c-0.46-1.27-0.88-2.57-1.25-3.87
                                                c-0.15-0.53,0.16-1.08,0.69-1.24c0.53-0.15,1.08,0.16,1.24,0.69c0.36,1.26,0.76,2.52,1.2,3.74c0.19,0.52-0.08,1.09-0.6,1.28
                                                C373.87,295.35,373.75,295.36,373.64,295.36z M461.6,294.27c-0.2,0-0.4-0.06-0.58-0.18c-0.96-0.68-2.07-1.27-3.31-1.76
                                                c-0.51-0.2-0.77-0.78-0.56-1.3c0.2-0.51,0.78-0.77,1.3-0.56c1.39,0.55,2.65,1.21,3.73,1.98c0.45,0.32,0.56,0.94,0.24,1.39
                                                C462.23,294.12,461.92,294.27,461.6,294.27z M442.37,292.71c-0.44,0-0.84-0.29-0.96-0.73c-0.15-0.53,0.16-1.08,0.69-1.23
                                                c1.36-0.38,2.7-0.69,3.98-0.93c0.54-0.1,1.06,0.26,1.17,0.8c0.1,0.54-0.26,1.06-0.8,1.17c-1.23,0.23-2.51,0.53-3.81,0.89
                                                C442.55,292.7,442.46,292.71,442.37,292.71z M454.23,291.38c-0.04,0-0.08,0-0.12-0.01c-0.71-0.09-1.47-0.13-2.27-0.13
                                                c-0.48-0.02-1.01,0.02-1.54,0.05c-0.55,0.03-1.03-0.38-1.06-0.94c-0.03-0.55,0.38-1.03,0.94-1.06c0.57-0.04,1.12-0.05,1.66-0.05
                                                c0,0,0,0,0.01,0c0.88,0,1.72,0.05,2.51,0.15c0.55,0.07,0.94,0.57,0.87,1.11C455.16,291.01,454.72,291.38,454.23,291.38z
                                                 M371.45,287.67c-0.46,0-0.88-0.32-0.98-0.79c-0.28-1.33-0.52-2.67-0.7-4.01c-0.08-0.55,0.3-1.05,0.85-1.13
                                                c0.55-0.08,1.05,0.3,1.13,0.85c0.18,1.29,0.41,2.59,0.68,3.87c0.11,0.54-0.23,1.07-0.77,1.19
                                                C371.59,287.67,371.52,287.67,371.45,287.67z M370.35,279.75c-0.52,0-0.96-0.4-1-0.93c-0.08-1.22-0.12-2.44-0.12-3.64l0-0.44
                                                c0-0.55,0.46-1.02,1.01-0.99c0.55,0,1,0.46,0.99,1.01l0,0.42c0,1.15,0.04,2.33,0.12,3.5c0.04,0.55-0.38,1.03-0.93,1.07
                                                C370.39,279.75,370.37,279.75,370.35,279.75z M370.43,271.76c-0.03,0-0.06,0-0.09,0c-0.55-0.05-0.96-0.54-0.91-1.09
                                                c0.11-1.25,0.28-2.49,0.49-3.67l0.04-0.16l0.13-0.36c0.18-0.52,0.75-0.79,1.27-0.61c0.52,0.18,0.8,0.75,0.61,1.27l-0.1,0.28
                                                c-0.18,1.05-0.34,2.23-0.45,3.42C371.37,271.37,370.94,271.76,370.43,271.76z M372.4,264.06c-0.12,0-0.24-0.02-0.36-0.07
                                                c-0.52-0.2-0.78-0.77-0.58-1.29c0.48-1.26,0.97-2.51,1.48-3.74c0.21-0.51,0.79-0.76,1.3-0.55s0.76,0.79,0.55,1.3
                                                c-0.5,1.22-0.99,2.45-1.46,3.7C373.18,263.81,372.8,264.06,372.4,264.06z M375.43,256.66c-0.13,0-0.27-0.03-0.4-0.08
                                                c-0.51-0.22-0.73-0.81-0.51-1.32c0.54-1.23,1.1-2.45,1.67-3.66c0.24-0.5,0.83-0.71,1.33-0.48c0.5,0.24,0.71,0.83,0.48,1.33
                                                c-0.56,1.19-1.11,2.4-1.65,3.62C376.18,256.44,375.82,256.66,375.43,256.66z M378.84,249.43c-0.15,0-0.3-0.03-0.45-0.11
                                                c-0.49-0.25-0.69-0.85-0.44-1.34c0.6-1.2,1.22-2.39,1.85-3.57c0.26-0.49,0.87-0.67,1.35-0.41c0.49,0.26,0.67,0.87,0.41,1.35
                                                c-0.62,1.16-1.23,2.34-1.83,3.53C379.56,249.22,379.21,249.43,378.84,249.43z M382.61,242.37c-0.17,0-0.34-0.04-0.49-0.13
                                                c-0.48-0.27-0.65-0.88-0.38-1.36c0.66-1.17,1.34-2.33,2.03-3.48c0.28-0.47,0.9-0.63,1.37-0.34c0.47,0.28,0.63,0.9,0.34,1.37
                                                c-0.68,1.13-1.35,2.28-2,3.43C383.3,242.19,382.96,242.37,382.61,242.37z M386.72,235.51c-0.18,0-0.37-0.05-0.53-0.16
                                                c-0.47-0.3-0.61-0.91-0.31-1.38c0.72-1.14,1.45-2.26,2.19-3.37c0.31-0.46,0.93-0.58,1.39-0.28c0.46,0.31,0.58,0.93,0.28,1.39
                                                c-0.73,1.1-1.45,2.21-2.17,3.33C387.38,235.35,387.05,235.51,386.72,235.51z M391.16,228.86c-0.2,0-0.4-0.06-0.57-0.18
                                                c-0.45-0.32-0.56-0.94-0.24-1.39c0.77-1.1,1.56-2.19,2.35-3.27c0.33-0.45,0.95-0.54,1.4-0.21c0.44,0.33,0.54,0.95,0.21,1.4
                                                c-0.78,1.06-1.56,2.14-2.32,3.23C391.78,228.71,391.47,228.86,391.16,228.86z M395.9,222.41c-0.21,0-0.43-0.07-0.61-0.21
                                                c-0.44-0.34-0.52-0.97-0.18-1.4c0.82-1.07,1.65-2.12,2.49-3.16c0.35-0.43,0.98-0.5,1.41-0.15c0.43,0.35,0.5,0.98,0.15,1.41
                                                c-0.83,1.03-1.65,2.07-2.47,3.12C396.5,222.28,396.2,222.41,395.9,222.41z M400.93,216.19c-0.23,0-0.46-0.08-0.64-0.24
                                                c-0.42-0.36-0.48-0.99-0.12-1.41c0.87-1.03,1.75-2.04,2.63-3.04c0.36-0.41,1-0.45,1.41-0.09c0.41,0.37,0.45,1,0.09,1.41
                                                c-0.87,0.99-1.74,1.99-2.6,3.01C401.49,216.07,401.21,216.19,400.93,216.19z M406.22,210.19c-0.24,0-0.48-0.09-0.68-0.26
                                                c-0.41-0.37-0.43-1.01-0.06-1.41c0.91-0.99,1.83-1.97,2.75-2.93c0.38-0.4,1.02-0.41,1.41-0.03c0.4,0.38,0.41,1.02,0.03,1.41
                                                c-0.91,0.95-1.82,1.92-2.73,2.9C406.76,210.08,406.49,210.19,406.22,210.19z M411.76,204.42c-0.26,0-0.51-0.1-0.71-0.29
                                                c-0.39-0.39-0.39-1.02,0-1.41c0.95-0.95,1.91-1.89,2.87-2.82c0.4-0.38,1.03-0.37,1.41,0.03c0.38,0.4,0.37,1.03-0.03,1.41
                                                c-0.95,0.91-1.9,1.84-2.84,2.79C412.27,204.32,412.02,204.42,411.76,204.42z M417.53,198.87c-0.27,0-0.54-0.11-0.73-0.32
                                                c-0.37-0.41-0.35-1.04,0.06-1.41c0.99-0.92,1.98-1.82,2.98-2.7c0.41-0.37,1.04-0.33,1.41,0.08c0.37,0.41,0.33,1.04-0.08,1.41
                                                c-0.98,0.88-1.97,1.77-2.95,2.68C418.01,198.78,417.77,198.87,417.53,198.87z M423.51,193.55c-0.28,0-0.56-0.12-0.76-0.35
                                                c-0.36-0.42-0.31-1.05,0.11-1.41c1.03-0.88,2.05-1.74,3.08-2.59c0.43-0.35,1.06-0.29,1.41,0.14c0.35,0.43,0.29,1.06-0.14,1.41
                                                c-1.01,0.84-2.03,1.69-3.05,2.56C423.97,193.47,423.74,193.55,423.51,193.55z M429.68,188.46c-0.29,0-0.59-0.13-0.78-0.38
                                                c-0.34-0.43-0.27-1.06,0.16-1.41c1.06-0.84,2.12-1.67,3.17-2.47c0.44-0.34,1.07-0.25,1.4,0.19c0.34,0.44,0.25,1.07-0.19,1.4
                                                c-1.04,0.8-2.09,1.61-3.14,2.45C430.12,188.39,429.9,188.46,429.68,188.46z M436.04,183.59c-0.31,0-0.61-0.14-0.81-0.41
                                                c-0.33-0.44-0.23-1.07,0.21-1.4c1.09-0.81,2.18-1.59,3.26-2.36c0.45-0.32,1.07-0.21,1.39,0.24c0.32,0.45,0.21,1.07-0.24,1.39
                                                c-1.07,0.76-2.14,1.54-3.23,2.34C436.45,183.53,436.24,183.59,436.04,183.59z M442.56,178.96c-0.32,0-0.63-0.15-0.83-0.43
                                                c-0.31-0.46-0.2-1.08,0.26-1.39c1.13-0.77,2.24-1.52,3.34-2.24c0.46-0.3,1.08-0.18,1.39,0.28c0.3,0.46,0.18,1.08-0.28,1.39
                                                c-1.09,0.72-2.19,1.46-3.31,2.22C442.95,178.9,442.75,178.96,442.56,178.96z M449.24,174.55c-0.33,0-0.65-0.16-0.84-0.46
                                                c-0.3-0.47-0.16-1.08,0.31-1.38c1.16-0.74,2.3-1.44,3.41-2.13c0.47-0.29,1.09-0.14,1.37,0.33c0.29,0.47,0.14,1.09-0.33,1.37
                                                c-1.11,0.68-2.23,1.38-3.38,2.11C449.61,174.5,449.42,174.55,449.24,174.55z M456.07,170.37c-0.34,0-0.68-0.18-0.86-0.49
                                                c-0.28-0.48-0.12-1.09,0.35-1.37c1.19-0.7,2.36-1.37,3.48-2.01c0.48-0.27,1.09-0.1,1.36,0.38c0.27,0.48,0.1,1.09-0.38,1.36
                                                c-1.12,0.63-2.27,1.29-3.45,1.99C456.42,170.32,456.24,170.37,456.07,170.37z M463.05,166.43c-0.36,0-0.7-0.19-0.88-0.52
                                                c-0.26-0.49-0.08-1.09,0.4-1.36c1.24-0.67,2.43-1.3,3.56-1.88c0.49-0.25,1.09-0.06,1.35,0.43c0.25,0.49,0.06,1.09-0.43,1.35
                                                c-1.12,0.58-2.29,1.2-3.52,1.86C463.37,166.39,463.21,166.43,463.05,166.43z M470.16,162.75c-0.37,0-0.72-0.21-0.9-0.56
                                                c-0.24-0.5-0.04-1.09,0.46-1.34c1.34-0.66,2.56-1.24,3.64-1.74c0.5-0.23,1.1-0.01,1.33,0.49c0.23,0.5,0.01,1.1-0.49,1.33
                                                c-1.06,0.49-2.27,1.07-3.6,1.72C470.46,162.72,470.31,162.75,470.16,162.75z"/>
                                        </g>
                                        <g>
                                            <linearGradient id="SVGID_27_" gradientUnits="userSpaceOnUse" x1="410.8723" y1="344.3387" x2="410.8723" y2="156.6483">
                                                <stop  offset="5.358273e-07" style="stop-color:#F3F6F9"/>
                                                <stop  offset="1" style="stop-color:#D0DAE8"/>
                                            </linearGradient>
                                            <path class="st27" d="M411.44,344.34c-0.28,0-0.56-0.12-0.76-0.35c-0.02-0.03-0.55-0.64-1.24-1.77
                                                c-0.29-0.47-0.14-1.09,0.33-1.37c0.47-0.29,1.09-0.14,1.37,0.33c0.59,0.97,1.04,1.5,1.04,1.5c0.36,0.42,0.31,1.05-0.11,1.41
                                                C411.91,344.26,411.67,344.34,411.44,344.34z"/>
                                        </g>
                                    </g>
                                    <linearGradient id="SVGID_28_" gradientUnits="userSpaceOnUse" x1="464.4846" y1="141.2945" x2="540.3865" y2="141.2945">
                                        <stop  offset="0" style="stop-color:#F3F6F9"/>
                                        <stop  offset="1" style="stop-color:#B5C6D8"/>
                                    </linearGradient>
                                    <polygon class="st28" points="464.48,131.58 540.39,118.91 516.68,163.67 		"/>
                                    <linearGradient id="SVGID_29_" gradientUnits="userSpaceOnUse" x1="503.1624" y1="163.6749" x2="503.1624" y2="129.7113">
                                        <stop  offset="0" style="stop-color:#D5E0EE"/>
                                        <stop  offset="1" style="stop-color:#F5F9FA"/>
                                    </linearGradient>
                                    <polygon class="st29" points="522.01,129.71 493.42,148.68 489.72,163.67 484.32,143.77 		"/>
                                    <polygon class="st30" points="503.49,155.56 489.72,163.67 493.2,148.51 		"/>
                                </g>
                                <g id="_人物">
                                    <linearGradient id="SVGID_30_" gradientUnits="userSpaceOnUse" x1="276.1667" y1="326.6254" x2="351.9331" y2="360.3588">
                                        <stop  offset="0.2247" style="stop-color:#F1F5F9"/>
                                        <stop  offset="1" style="stop-color:#BBCDE1"/>
                                    </linearGradient>
                                    <path class="st31" d="M351.95,330.02l10.93,5.74c0,0-22.31,0.33-31.91,8.5s-18,25.95-48.81,15.35s-7.4-21.98,4.42-19.99
                                        s27.94-2.21,36-10.6S349.19,327.81,351.95,330.02z"/>
                                    <linearGradient id="SVGID_31_" gradientUnits="userSpaceOnUse" x1="275.2982" y1="332.6706" x2="330.1212" y2="332.6706">
                                        <stop  offset="0" style="stop-color:#61AAF3"/>
                                        <stop  offset="0.6903" style="stop-color:#448BE0"/>
                                    </linearGradient>
                                    <path class="st32" d="M320.13,318.58c0,0-9.77,0.17-16.4,9.17c-1.88,2.65-2.98,4.36-3.87,5.74s-3.37,3.81-7.01,0.83
                                        s-12.75-10.66-12.75-10.66l-4.8,6.47c0,0,15.84,17.43,22.3,16.61c6.46-0.83,13.69-0.17,22.03-10.49
                                        c8.34-10.33,10.49-12.81,10.49-12.81L320.13,318.58z"/>
                                    <path class="st33" d="M277.75,318.91l-11.71,15.76c0,0,4.14,4.28,8.56-2.07c4.42-6.35,6.82-10.13,6.82-10.13L277.75,318.91z"/>
                                    <polygon class="st34" points="276.95,317.83 271.18,324.32 272.26,325.51 265.06,334 266,334.96 279.08,319.85 		"/>
                                    <linearGradient id="SVGID_32_" gradientUnits="userSpaceOnUse" x1="282.4514" y1="347.1733" x2="335.0777" y2="326.972">
                                        <stop  offset="0" style="stop-color:#78C8FF"/>
                                        <stop  offset="0.6903" style="stop-color:#4D8FE9"/>
                                    </linearGradient>
                                    <path class="st35" d="M320.59,319.09c0,0-7.47,2.21-12.04,11.26c-4.56,9.06-5.26,12.44-10.31,9.94
                                        c-5.04-2.5-14.32-7.14-14.32-7.14l-4.09,7.21c0,0,18.26,14.76,25.36,11.52c7.1-3.24,29.01-18.04,29.01-18.04s1.55-5.52,1.29-5.78
                                        C335.24,327.82,320.59,319.09,320.59,319.09z"/>
                                    <path class="st33" d="M281.04,329.49l-11.71,15.76c0,0,4.14,4.28,8.56-2.07s6.82-10.13,6.82-10.13L281.04,329.49z"/>
                                    <polygon class="st34" points="280.24,328.41 274.47,334.9 275.55,336.09 268.36,344.58 269.3,345.54 282.37,330.43 		"/>
                                    <linearGradient id="SVGID_33_" gradientUnits="userSpaceOnUse" x1="338.3401" y1="336.3351" x2="338.3401" y2="311.2137">
                                        <stop  offset="0" style="stop-color:#F2A319"/>
                                        <stop  offset="0.4796" style="stop-color:#FFC552"/>
                                    </linearGradient>
                                    <path class="st36" d="M362.89,335.76c0,0-6.2-21.7-23.9-24.02c-17.71-2.32-24.75,3.52-25.17,5.77c-0.29,1.52,1.47,2.04,1.47,2.04
                                        s14.28,5.48,16.56,15.72c0.37,1.69,1.62,1.18,5.15-0.22c3.53-1.4,8.88-3.08,15.76-1.87C357.15,334.43,362.89,335.76,362.89,335.76
                                        z"/>
                                </g>
                            </g>
                            <g id="暂无订单">
                            </g>
                            <g id="暂无地址">
                            </g>
                            <g id="暂无优惠券">
                            </g>
                            <g id="暂无收藏">
                            </g>
                            <g id="暂无消息">
                            </g>
                            <g id="暂无评论">
                            </g>
                            <g id="暂无搜索结果">
                            </g>
                            <g id="暂无银行卡">
                            </g>
                            <g id="暂无发票">
                            </g>
                            <g id="暂无积分">
                            </g>
                            <g id="暂无网络">
                            </g>
                            <g id="页面不存在">
                            </g>
                            <g id="暂无礼物">
                            </g>
                            <g id="暂无数据">
                            </g>
                            <g id="暂无图片">
                            </g>
                            <g id="暂无视频">
                            </g>
                            <g id="暂无问答">
                            </g>
                            <g id="购物车空空如也">
                            </g>
                            <g id="暂无活动">
                            </g>
                            <g id="系统繁忙">
                            </g>
                            <g id="禁止访问">
                            </g>
                            <g id="系统升级中">
                            </g>
                            <g id="系统异常">
                            </g>
                            <g id="暂无收藏_1_">
                            </g>
                            <g id="加载失败">
                            </g>
                            <g id="打印异常">
                            </g>
                            <g id="暂无公告">
                            </g>
                            <g id="暂无权限">
                            </g>
                            <g id="暂无组队">
                            </g>
                            <g id="暂无关注">
                            </g>
                            <g id="暂无音乐">
                            </g>
                            <g id="暂无配送">
                            </g>
                            <g id="暂无邮件">
                            </g>
                            <g id="暂无推送">
                            </g>
                            <g id="暂无店铺">
                            </g>
                            <g id="上传失败">
                            </g>
                            <g id="下载失败">
                            </g>
                            <g id="支付成功">
                            </g>
                            <g id="支付失败">
                            </g>
                            <g id="暂无收益">
                            </g>
                            <g id="暂无记录">
                            </g>
                            </svg>
                            
                            </div>
                            <div class="list-empty-description">暂无数据</div>
                        </div>
                    </div>
                    </div>
                
                
                `;
            }

            $(".fh5co-post-entry").eq(0).html(htmlStr);
            // Animations
            contentWayPoint();
            config.laypage = {
                curr: res.data.current,
                limit: res.data.size,
                count: res.data.total,
            };
            //执行一个laypage实例
            laypage.render({
                elem: "laypage", //注意，这里的 test1 是 ID，不用加 # 号
                layout: ["count", "prev", "page", "next", "limit", "refresh", "skip"],
                ...config.laypage,
                jump: (obj, first) => {
                    if (!first) {
                        // getTemplateList({current: obj.curr, size: obj.limit});
                        config.classParams.current = obj.curr;
                        config.classParams.size = obj.limit;
                        getTemplateList(config.classParams);
                    }
                },
            });
        });
    });
}

function show(id, msg) {
    layer.tips(msg, "#" + id + "", {
        tips: [1, "#009688"],
        time: 2000
    });
}

(function () {
    "use strict";

    // 获取更多分类
    function getMoreClassFn(cb) {
        getMoreClass().then((res) => {
            let htmlStr = "";
            let navItem = "";
            res.classification
                .filter((item) => item.isHot)
                .forEach((item, index) => {
                    if (item.isHot) {
                        navItem += `<li class="layui-nav-item"><a href="javascript:;">${item.name}</a></li>`;
                    }
                });
            $("#layui-nav").html(navItem);

            setTimeout(() => {
                layui.use("element", function () {
                    var element = layui.element;
                    element.render("nav");
                    element.on("nav(headerNav)", function (data) {
                        setTimeout(() => {
                            $(".classification .class-span").each((inde, item) => {
                                item.style.color = "";
                            });
                            const classificationId = config.classification.filter(
                                (item) => item.name == data[0].innerText
                            )[0].id;
                            config.classParams.classificationId = classificationId;
                            config.classParams.current = 1;
                            getTemplateList(config.classParams);
                        });
                    });
                    //…
                });
            }, 500);

            config.more.forEach((key) => {
                if (res[key]) {
                    config[key] = [...res[key]];
                    htmlStr += `
					<div class="flex">
					<span class='class-title'>${key == "classification" ? "分类" : key == "color" ? "颜色" : "Tag"}&nbsp;: </span>
					<div style='text-align: justify;' class='${key}'>
                        <p class='unlimited-class' data-key='${key}Id' >不限</p>
						${res[key]
                        .map((item) => {
                            config.classificationId =
                                !config.classificationId && item.name == "整站" ? item.id : config.classificationId;
                            return `<span class='class-span' data-key='${key}Id' data-id='${item.id}'>${item.name}</span>`;
                        })
                        .join(" ")}
					</div>
					</div>
					`;
                }
            });
            $(".more-class").eq(0).html(htmlStr);
            $(".class-span").each(function (index, item) {
                item.onclick = function () {
                    $(".class-span").each(function (i, row) {
                        if (item.getAttribute("data-key") == "classificationId") {
                            $(".layui-nav-item").removeClass("layui-this");
                        }
                        if (item.getAttribute("data-key") == row.getAttribute("data-key")) {
                            row.style.color = "";
                        }
                    });
                    item.style.color = "#3db389";
                    config.classParams[item.getAttribute("data-key")] = parseInt(item.getAttribute("data-id"));
                    config.classParams.current = 1;
                    getTemplateList(config.classParams);
                };
            });
            $(".unlimited-class").each(function (index, item) {
                item.onclick = function () {
                    $(".class-span").each(function (i, row) {
                        if (item.getAttribute("data-key") == row.getAttribute("data-key")) {
                            row.style.color = "";
                        }
                    });
                    config.classParams[item.getAttribute("data-key")] = null;
                    getTemplateList(config.classParams);
                };
            });
            cb && cb();
        });
    }


    $(".more").click(function () {
        if ($(".more-class")[0].style.display == "none") {
            $(".more-class").addClass("animate__zoomIn");
            $(".more-class").removeClass("animate__zoomOut");
        } else {
            $(".more-class").addClass("animate__zoomOut");
            $(".more-class").removeClass("animate__zoomIn");
        }
        $(".more-class").toggle("fast");
    });
    $(".search_btn").click(function () {
        config.classParams.current = 1;
        config.classParams.size = 20;
        config.classParams.name = $("#searchInput").val();
        getTemplateList(config.classParams);
    });

    function formValidator(form, cb) {
        const feedbackIcons = {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh",
        };
        $(form)
            .bootstrapValidator({
                message: "This value is not valid",
                feedbackIcons: form == "#topUp-form" ? {} : feedbackIcons,
                fields: {
                    captcha: {
                        validators: {
                            notEmpty: {
                                message: "图片验证不可为空！",
                            },
                            regexp: {
                                regexp: /^.{5}$/,
                                message: "请输入验证码！",
                            },
                        },
                    },
                    email: {
                        validators: {
                            regexp: {
                                regexp: /[1-9]\d{7,10}@qq\.com/,
                                message: "请输入QQ邮箱！",
                            },
                            notEmpty: {
                                message: "邮箱不可为空！",
                            },
                        },
                    },
                    password: {
                        validators: {
                            regexp: {
                                regexp: /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/,
                                message: "密码必须长度为6-20位包含数字和字母",
                            },
                            notEmpty: {
                                message: "密码不可为空！",
                            },
                        },
                    },
                    code: {
                        validators: {
                            notEmpty: {
                                message: "邮箱验证不可为空！",
                            },
                        },
                    },
                    setMealId: {
                        validators: {
                            notEmpty: {
                                message: "请选择套餐！",
                            },
                        },
                    },
                    payType: {
                        validators: {
                            notEmpty: {
                                message: "请选择支付方式！",
                            },
                        },
                    },
                },
            })
            .on("success.form.bv", function (e) {
                // Prevent form submission
                e.preventDefault();
                // Get the form instance
                var $form = $(e.target);
                // Get the BootstrapValidator instance
                var bv = $form.data("bootstrapValidator");
                let params = {};
                $form.serializeArray().forEach((item) => {
                    if (item.name == "email") {
                        params.username = item.value;
                    } else {
                        params[item.name] = item.value;
                    }
                });
                cb && cb(params, $form);
            });
    }

    // Document on load.
    $(document).ready(function () {

        // 注册验证
        formValidator("#register-form", function (params, $form) {
            delete params.captcha;
            registerApi(params).then((res) => {
                if (res.code == 500) {
                    layer.msg(res.msg, {icon: 5, anim: 6});
                } else {
                    dialoghide();
                    localStorage.setItem("user", JSON.stringify(res));
                    isLogin();
                }
                $form.data("bootstrapValidator").resetForm();
                $form[0].reset();
            });
        });
        // 登录验证
        formValidator("#login-form", function (params, $form) {
            loginApi(params).then((res) => {
                if (res.code == 500) {
                    layer.msg(res.msg, {icon: 5, anim: 6});
                } else {
                    dialoghide();
                    layer.msg("登录成功！", {icon: 1});
                    localStorage.setItem("user", JSON.stringify(res));
                    isLogin();
                }
                $form.data("bootstrapValidator").resetForm();
                $form[0].reset();
            });
        });
        // 充值验证
        formValidator("#topUp-form", function (params, $form) {
            var index = layer.load(1, {
                shade: [0.5, '#000']
            })
            createOrderApi(params).then((res) => {
                if (res.code == 0) {
                    $("#fh5co-dialog").hide();
                    $("#topUp-form").hide();
                    layer.open({
                        type: 2,
                        area: [`${$("body").width() > 1200 ? "700px" : "80vw"}`, "80vh"],
                        content: res.msg,
                        scrollbar: true,
                        end: function () {
                            location.reload();
                            // getUserInfo();
                        },
                    });
                }
                layer.close(index);
                $form.data("bootstrapValidator").resetForm();
                $form[0].reset();
            });
        });
        setMealApi().then((res) => {
            $("#meal-select").html(
                `${res.data
                    .map((item) => `<option value='${item.id}'>${item.remark}</option>`)
                    .join(" ")}`
            );
        });
    });

    function laynav() {
        if ($("body").width() > 1200) {
            $("#layui-nav").css("display", "block");
            $("#layui-nav").removeClass("layui-nav-side layui-nav-tree");
        } else {
            $("#layui-nav").css("display", "none");

            $("#layui-nav").addClass("layui-nav-side layui-nav-tree");
        }
    }


    $(".collection").click(function () {
        config.classParams.collection = !config.classParams.collection;
        if (config.classParams.collection) {
            this.style.color = "#3db389";
        } else {
            this.style.color = "#333";
        }
        config.classParams.userId = config.loginInfo.userInfo.userId;
        getTemplateList(config.classParams);
    });
    window.addEventListener("resize", laynav);
    $(function () {
        laynav();
        getMoreClassFn(function () {
            if (GetRequest().id) {
                if (GetRequest().key == "classificationId") {
                    $(".layui-nav-item").each(function (index, item) {
                        if (item.innerText == config.classification.find((row) => row.id == GetRequest().id).name) {
                            $(".layui-nav-item").removeClass("layui-this");
                            $(item).addClass("layui-this");
                        }
                    });
                    config.classParams.classificationId = GetRequest().id;
                } else if (GetRequest().key == "colorId") {
                    config.classParams.colorId = GetRequest().id;
                } else if (GetRequest().key == "tagId") {
                    config.classParams.tagId = GetRequest().id;
                }
                const dom = GetRequest().key.substring(GetRequest().key.length - 2, 0);
                $(`.${dom} .class-span`).each(function (index, item) {
                    if (GetRequest().id == item.getAttribute("data-id")) {
                        $(".class-span").css("color", "");
                        item.style.color = "#3db389";
                    }
                });
                getTemplateList({[GetRequest().key]: GetRequest().id});
            } else {
                getTemplateList();
            }
        });
        getUserInfo();
    });
})();
