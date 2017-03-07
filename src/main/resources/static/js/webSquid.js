/**
 * Created by ShiXu on 2016/11/15.
 */
var webSquid = webSquid || {
        basePath: $("base").attr("href"),
        page: { // 保存不同页块的
            params: [], // 参数信息，key=页块名称 value=参数表[]
            modules: [] // 方法信息，key=页面名称 value=模块对象
        }
    };

/**
 * 根据传入的子路径解析返回完整URL
 * @returns {*}
 */
webSquid.resolve = function () {
    var paths = Array.prototype.slice.call(arguments);
    return this.basePath + paths.join("/");
};

/**
 * 获取单页跳转时的携带的参数，通常为 ws-action 属性中?之后的数据，如 task?id=1&type=sample
 * @param page
 * @returns {*}
 */
webSquid.getPageParams = function (page) {
    var paramArr = webSquid.page.params[page];
    if (!paramArr || (paramArr.length == 0))
        return null;
    var paramString = paramArr[paramArr.length - 1];
    if (typeof paramString != "string")
        return null;
    var segments = paramString.split("&");
    var ret = {};
    for (var idx in segments) {
        var kvPair = segments[idx].split("=");
        if (kvPair.length != 2)
            continue;
        ret[kvPair[0]] = kvPair[1];
    }
    return ret;
};

webSquid.putPageParams = function (url) {
    var data = webSquid.extractParams(url);
    webSquid.page.params[data.url] = webSquid.page.params[data.url] || [];
    webSquid.page.params[data.url].push(data.params);
    return data;
};

/**
 * 弹出警告对话框
 * @param message
 * @param title
 * @param callback
 * @param theme
 */
webSquid.alert = function (message, title, callback, theme) {
    title = title || "警告";
    theme = theme || "modal-danger";
    $("#dialog-alert .modal-title").text(title);
    $("#dialog-alert .modal-body").html(message);
    $("#dialog-alert").removeClass("modal-info modal-danger modal-primary modal-default modal-info modal-warning modal-success").addClass(theme);
    $("#dialog-alert .close, #dialog-alert .btn").unbind("click").click(function () {
        $("#dialog-alert").modal('hide');
        if (typeof callback == "function")
            (callback());
    });

    $("#dialog-alert").modal();
};

webSquid.confirm = function (message, title, callback) {
    title = title || "确认";
    $("#dialog-confirm .modal-title").text(title);
    $("#dialog-confirm .modal-body").html(message);

    $("#dialog-confirm .close, #dialog-confirm .btn[data-dismiss]").unbind("click").click(function () {
        $("#dialog-confirm").modal('hide');
    });
    $("#dialog-confirm .btn-ok").unbind("click").click(function () {
        $("#dialog-confirm").modal('hide');
        if (typeof callback == "function")
            (callback());
    });

    $("#dialog-confirm").modal();
};

webSquid.popup = function (url, title, apply, cancel) {
    title = title || "";

    $("#dialog-popup .modal-title").text(title);

    $("#dialog-popup .close, #dialog-popup .btn[data-dismiss]").unbind("click").click(function () {
        $("#dialog-popup").modal('hide');
    });
    $("#dialog-popup .btn-apply").unbind("click").click(function () {
        $("#dialog-popup").modal('hide');
        if (typeof apply == "function")
            (apply());
    });
    $("#dialog-popup .btn-cancel").unbind("click").click(function () {
        $("#dialog-popup").modal('hide');
        if (typeof cancel == "function")
            (cancel());
    });

    webSquid.loadPage("#dialog-popup .modal-body", url).done(function () {
        $("#dialog-popup").modal();
    });

};

webSquid.showErrorMessage = function (xhr, status, error, url) {

    if (xhr.status == 401) {
        webSquid.alert(xhr.responseJSON.data.message, "会话超时", function () {
            window.location = xhr.responseJSON.data.login;
        });
        return;
    }

    var message = "";
    if (xhr.responseJSON) {
        message = xhr.responseJSON.data || xhr.responseJSON.message;
    }

    webSquid.alert("<p>" + message + "</p> <p style='color:#ccc; font-size:0.8em;'>操作失败，" + error + "(" + xhr.status + ")<br/>访问地址：" + url + "</p>");
};

/**
 * Ajax载入单页
 * @param selector
 * @param page
 * @param data
 * @param success
 * @param fail
 * @returns {*}
 */
webSquid.load = function (selector, page, data, success, fail) {
    if (typeof data == 'function') {
        data = (data());
    }
    var url = webSquid.resolve("admin/page?p=" + page);

    return $.ajax({
        cache: false,
        method: "GET",
        url: url,
        data: data,
        error: function (xhr, status, error) {
            webSquid.showErrorMessage(xhr, status, error, url);
            if (typeof fail == "function")
                (fail(status, error));
            return true;
        },
        success: function (data, status, xhr) {
            switch (xhr.status) {
                case 200:
                    if (selector != null)
                        $(selector).html(data);
                    if (typeof success == "function")
                        (success(data));
                    break;
                default:
                    webSquid.showErrorMessage(xhr, status, error, url);
                    break;
            }
            return true;
        }
    });
};

webSquid.ajax = function (url, method, data, success, fail) {
    if (typeof data == 'function') {
        data = (data());
    }

    url = webSquid.resolve("api", url);

    return $.ajax({
        cache: false,
        method: method,
        url: url,
        data: data,
        error: function (xhr, status, error) {
            webSquid.showErrorMessage(xhr, status, error, url);
            if (typeof fail == "function")
                (fail(status, error, xhr.responseJSON));
        },
        success: function (data, status, xhr) {
            switch (xhr.status) {
                case 200:
                    if (typeof success == "function")
                        (success(data));
                    break;
                default:
                    webSquid.showErrorMessage(xhr, status, error, url);
                    break;
            }
            return true;
        }
    });
};

/**
 * 显示检索区，隐藏工作区
 */
webSquid.showPageQuery = function () {
    $.AdminLTE.boxWidget.expand($(".ws-query .btn[data-widget='collapse']"));
    $.AdminLTE.boxWidget.shrink($(".ws-workspace .btn[data-widget='collapse']"));
    $("html,body").animate({scrollTop: 0}, 500);
};

/**
 * 显示工作区，隐藏检索区
 */
webSquid.showWorkspace = function () {
    $.AdminLTE.boxWidget.shrink($(".ws-query .btn[data-widget='collapse']"));
    $.AdminLTE.boxWidget.expand($(".ws-workspace .btn[data-widget='collapse']"));

    $(".ws-workspace").show();
    window.setTimeout(function () {
        $("html,body").animate({scrollTop: $(".ws-workspace").offset().top - 50}, 500);
    }, 400);
};

/**
 * 绘制数据表
 * @param selector
 * @param options
 */
webSquid.datatable = function (selector, options) {
    $.fn.dataTable.ext.errMode = 'throw';

    if ($.fn.dataTable.isDataTable(selector)) {
        if (options.ajax) {
            options.paging = true;
            $(selector).DataTable().ajax.url(options.ajax).load();
            return;
        }
        $(selector).DataTable().destroy();
    }

    options.language = {url: webSquid.resolve("lib/datatables/chinese.json")};
    options.ordering = options.ordering == null ? false : options.ordering;

    var thead = $("<thead/>");
    var tr = $("<tr/>");
    $.map(options.columns, function (val, idx) {
        var column = val.label ? val.label : val.data;
        tr.append($("<th/>").html(column));
    });
    $(selector).empty().append(thead.append(tr));
    return $(selector).DataTable(options);
};

webSquid.extractParams = function (url) {
    url = url.split("?");
    var params = url.length > 1 ? url[1] : {};
    url = url[0];
    return {url: url, params: params};
};

// 在特定的页面容器中载入单页，会自动触发单页module初始化
webSquid.loadPage = function (container, page, param, success, fail) {
    return webSquid.load(container, page, param, success, fail).done(function () {
        if (webSquid.page.modules[page] && (typeof webSquid.page.modules[page]["init"] == "function")) {
            webSquid.currentPage = undefined;
            webSquid.page.modules[page].init();

            console.log("ie:" + webSquid.ie + " sign:" + webSquid.sign);
        }

        // 这里可以放入全页面通吃的按钮绑定代码，但注意得先unbind()再注册事件，防止重复绑定
    });
};

webSquid.loadWorkspace = function (action) {
    var data = webSquid.putPageParams(action);

    webSquid.loadPage("#ws-workspace", data.url, data.params, webSquid.showWorkspace, webSquid.showPageQuery);
};

webSquid.loadBlock = function (action, container) {
    var data = webSquid.putPageParams(action);

    webSquid.loadPage(container, data.url, data.params);
};

// 重新初始化 ws-action 按钮的点击事件，在有相关页面更新时都需要调用此方法
webSquid.bindActions = function () {
    $("[ws-action]").each(function () {
        $(this).unbind("click").click(function () {
            webSquid.loadWorkspace($(this).attr("ws-action"));
        });
    });
};

webSquid.serialize = function (formSelector, customAttributeConfig) {
    var formData = [];
    customAttributeConfig = customAttributeConfig || [];
    var buildFormDataFunc = function (index, element) {
        var name = $(element).attr("name");
        var attributeHandler = customAttributeConfig[name];
        var isValidAttribute;
        if (attributeHandler) {
            if (typeof attributeHandler == "function") {
                isValidAttribute = (customAttributeConfig[name])($(this).val(), this);
                if (isValidAttribute != null)
                    formData.push({k: name, v: isValidAttribute});
            } else {
                formData.push({k: name, v: $(this).attr(customAttributeConfig[name])});
            }
        } else {
            if ($(this).is("[type='radio']")) {
                if ($(this).is(":checked"))
                    formData.push({k: name, v: $(this).val()});
            } else if ($(this).is("[type='checkbox']")) {
                if ($(this).is(":checked"))
                    formData.push({k: name, v: $(this).val()});

            } else {
                formData.push({k: name, v: $(this).val()});
            }
        }
    };
    $(formSelector + " [name]").each(buildFormDataFunc);

    var params = [];
    for (var idx in formData) {
        params.push(formData[idx].k + "=" + encodeURIComponent(formData[idx].v));
    }
    if (params.length > 0)
        params = params.join("&");

    // console.log("serialize data= " + params);
    return params;
};

webSquid.serializeObjectToURL = function (url, params) {
    var result = url + "?";
    var paramArray = [];
    for (var key in params) {
        paramArray.push(key + "=" + encodeURIComponent(params[key]));
    }
    if (paramArray.length > 0)
        result += paramArray.join("&");
    return result;
};

webSquid.pageModule = function (moduleName) {
    return this.page.modules[moduleName];
};

webSquid.graph = function (container, option) {
    // var defaultColor = ['#4A85C9', '#E16726', '#929292', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C'];
    var defaultColor = ['#3E9EDA', '#7DC589', '#FFC000', '#386BBE', '#F19545', '#A28BC2', '#A3CFED', '#52A64C', '#E45A0E', '#3D94BA', '#8064A2'];
    var template = {
        color: defaultColor,
        backgroundColor: 'transparent',
        title: {
            show: true,        //是否显示标题组件
            text: '',          //主标题文本，支持使用 \n 换行
            link: '',          //主标题文本超链接
            target: 'blank',   //主标题文本超链接 指定窗口打开主标题超链接,可选：'self' 当前窗口打开,'blank' 新窗口打开
            subtext: '',        //副标题文本，支持使用 \n 换行
            sublink: '',        //副标题文本超链接
            subtarget: 'blank', //指定窗口打开副标题超链接，可选：'self' 当前窗口打开,'blank' 新窗口打开
            left: 'center',       //grid 组件离容器左侧的距离
            backgroundColor: 'transparent', //标题背景色
            borderColor: '#ccc',                //标题的边框颜色
            borderWidth: '0'                   //标题的边框线宽
        },
        legend: {
            show: true,            //是否显示图例组件
            left: 'auto',          //图例组件离容器左侧的距离 可以使用 20（像素值） 20%（百分比）
            top: 'auto',            //图例组件离容器上侧的距离
            right: 'auto',        //图例组件离容器右侧的距离
            bottom: 'auto',      //图例组件离容器下侧的距离
            width: 'auto',        //图例组件的宽度。默认自适应
            height: 'auto',      //图例组件的高度。默认自适应
            orient: 'horizontal',//图例列表的布局朝向 水平：horizontal 垂直：vertical
            selectedMode: true,   //图例选择的模式，控制是否可以通过点击图例改变系列的显示状态
            inactiveColor: '#ccc',//图例关闭时的颜色
            tooltip: false,
            padding: 3,
            itemGap: 5,
            data: [],
            backgroundColor: 'transparent',
            borderColor: '#ccc',
            borderWidth: 0,
        },
        series: [],
        grid: {
            show: false,         //是否显示直角坐标系网格
            left: '3%',       //grid 组件离容器左侧的距离
            top: 60,            //grid 组件离容器上侧的距离
            right: '10%',       //grid 组件离容器右侧的距离
            bottom: 60,         //grid 组件离容器下侧的距离
            containLabel: false,         //grid 区域是否包含坐标轴的刻度标签，
            backgroundColor: 'transparent',   //网格背景色
        },
        tooltip: {
            show: true,
            showContent: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            alwaysShowContent: false,
            showDelay: 0,
            hideDelay: 100,
            enterable: false,
            confine: false,
            transitionDuration: 0.4,
            formatter: null,
            backgroundColor: 'rgba(50,50,50,0.7)',
            borderColor: '#333',
            borderWidth: 0,
            padding: 5
        },
        toolbox: {
            show: true,
            orient: 'horizontal',
            left: 'left',
            itemSize: 10,
            itemGap: 8,
            showTitle: false
        }
    };

    var mergeOptions = function (target, templte) {
        for (var key in templte) {
            if (typeof(target[key]) == "undefined") {
                target[key] = templte[key];
                continue;
            }

            if (typeof(target[key]) == 'object') {
                // target[key] = templte[key];
                mergeOptions(target[key], template[key]);
                continue;
            }
        }
    };

    mergeOptions(option, template);

    container.setOption(option);
};

webSquid.translateTitle = function (code) {
    var nameMap = {
        'KGZY-XN': '直邮进口效能分析',
        'LGZY-XN': '直邮进口效能分析',
        'KGCK-XN': '一般出口效能分析',
        'KGBS-XN': '保税进口效能分析',
        'LGZG-XN': '转关进口效能分析',
        'KGZY-TJ': '直邮进口综合统计',
        'LGZY-TJ': '直邮进口综合统计',
        'KGCK-TJ': '一般出口综合统计',
        'KGBS-TJ': '保税进口综合统计',
        'LGZG-TJ': '转关进口综合统计'
    };
    if (nameMap[code])
        return nameMap[code];
    return null;
};

webSquid.translateCountry = function (name) {
    var nameMap = {
        'Afghanistan': '阿富汗',
        'Angola': '安哥拉',
        'Albania': '阿尔巴尼亚',
        'United Arab Emirates': '阿联酋',
        'Argentina': '阿根廷',
        'Armenia': '亚美尼亚',
        'French Southern and Antarctic Lands': '法属南半球和南极领地',
        'Australia': '澳大利亚',
        'Austria': '奥地利',
        'Azerbaijan': '阿塞拜疆',
        'Burundi': '布隆迪',
        'Belgium': '比利时',
        'Benin': '贝宁',
        'Burkina Faso': '布基纳法索',
        'Bangladesh': '孟加拉国',
        'Bulgaria': '保加利亚',
        'The Bahamas': '巴哈马',
        'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
        'Belarus': '白俄罗斯',
        'Belize': '伯利兹',
        'Bermuda': '百慕大',
        'Bolivia': '玻利维亚',
        'Brazil': '巴西',
        'Brunei': '文莱',
        'Bhutan': '不丹',
        'Botswana': '博茨瓦纳',
        'Central African Republic': '中非共和国',
        'Canada': '加拿大',
        'Switzerland': '瑞士',
        'Chile': '智利',
        'China': '中国',
        'Ivory Coast': '象牙海岸',
        'Cameroon': '喀麦隆',
        'Democratic Republic of the Congo': '刚果民主共和国',
        'Republic of the Congo': '刚果共和国',
        'Colombia': '哥伦比亚',
        'Costa Rica': '哥斯达黎加',
        'Cuba': '古巴',
        'Northern Cyprus': '北塞浦路斯',
        'Cyprus': '塞浦路斯',
        'Czech Republic': '捷克共和国',
        'Germany': '德国',
        'Djibouti': '吉布提',
        'Denmark': '丹麦',
        'Dominican Republic': '多明尼加共和国',
        'Algeria': '阿尔及利亚',
        'Ecuador': '厄瓜多尔',
        'Egypt': '埃及',
        'Eritrea': '厄立特里亚',
        'Spain': '西班牙',
        'Estonia': '爱沙尼亚',
        'Ethiopia': '埃塞俄比亚',
        'Finland': '芬兰',
        'Fiji': '斐',
        'Falkland Islands': '福克兰群岛',
        'France': '法国',
        'Gabon': '加蓬',
        'United Kingdom': '英国',
        'Georgia': '格鲁吉亚',
        'Ghana': '加纳',
        'Guinea': '几内亚',
        'Gambia': '冈比亚',
        'Guinea Bissau': '几内亚比绍',
        'Equatorial Guinea': '赤道几内亚',
        'Greece': '希腊',
        'Greenland': '格陵兰',
        'Guatemala': '危地马拉',
        'French Guiana': '法属圭亚那',
        'Guyana': '圭亚那',
        'Honduras': '洪都拉斯',
        'Croatia': '克罗地亚',
        'Haiti': '海地',
        'Hungary': '匈牙利',
        'Indonesia': '印尼',
        'India': '印度',
        'Ireland': '爱尔兰',
        'Iran': '伊朗',
        'Iraq': '伊拉克',
        'Iceland': '冰岛',
        'Israel': '以色列',
        'Italy': '意大利',
        'Jamaica': '牙买加',
        'Jordan': '约旦',
        'Japan': '日本',
        'Kazakhstan': '哈萨克斯坦',
        'Kenya': '肯尼亚',
        'Kyrgyzstan': '吉尔吉斯斯坦',
        'Cambodia': '柬埔寨',
        'South Korea': '韩国',
        'Kosovo': '科索沃',
        'Kuwait': '科威特',
        'Laos': '老挝',
        'Lebanon': '黎巴嫩',
        'Liberia': '利比里亚',
        'Libya': '利比亚',
        'Sri Lanka': '斯里兰卡',
        'Lesotho': '莱索托',
        'Lithuania': '立陶宛',
        'Luxembourg': '卢森堡',
        'Latvia': '拉脱维亚',
        'Morocco': '摩洛哥',
        'Moldova': '摩尔多瓦',
        'Madagascar': '马达加斯加',
        'Mexico': '墨西哥',
        'Macedonia': '马其顿',
        'Mali': '马里',
        'Myanmar': '缅甸',
        'Montenegro': '黑山',
        'Mongolia': '蒙古',
        'Mozambique': '莫桑比克',
        'Mauritania': '毛里塔尼亚',
        'Malawi': '马拉维',
        'Malaysia': '马来西亚',
        'Namibia': '纳米比亚',
        'New Caledonia': '新喀里多尼亚',
        'Niger': '尼日尔',
        'Nigeria': '尼日利亚',
        'Nicaragua': '尼加拉瓜',
        'Netherlands': '荷兰',
        'Norway': '挪威',
        'Nepal': '尼泊尔',
        'New Zealand': '新西兰',
        'Oman': '阿曼',
        'Pakistan': '巴基斯坦',
        'Panama': '巴拿马',
        'Peru': '秘鲁',
        'Philippines': '菲律宾',
        'Papua New Guinea': '巴布亚新几内亚',
        'Poland': '波兰',
        'Puerto Rico': '波多黎各',
        'North Korea': '北朝鲜',
        'Portugal': '葡萄牙',
        'Paraguay': '巴拉圭',
        'Qatar': '卡塔尔',
        'Romania': '罗马尼亚',
        'Russia': '俄罗斯',
        'Rwanda': '卢旺达',
        'Western Sahara': '西撒哈拉',
        'Saudi Arabia': '沙特阿拉伯',
        'Sudan': '苏丹',
        'South Sudan': '南苏丹',
        'Senegal': '塞内加尔',
        'Solomon Islands': '所罗门群岛',
        'Sierra Leone': '塞拉利昂',
        'El Salvador': '萨尔瓦多',
        'Somaliland': '索马里兰',
        'Somalia': '索马里',
        'Republic of Serbia': '塞尔维亚共和国',
        'Suriname': '苏里南',
        'Slovakia': '斯洛伐克',
        'Slovenia': '斯洛文尼亚',
        'Sweden': '瑞典',
        'Swaziland': '斯威士兰',
        'Syria': '叙利亚',
        'Chad': '乍得',
        'Togo': '多哥',
        'Thailand': '泰国',
        'Tajikistan': '塔吉克斯坦',
        'Turkmenistan': '土库曼斯坦',
        'East Timor': '东帝汶',
        'Trinidad and Tobago': '特里尼达和多巴哥',
        'Tunisia': '突尼斯',
        'Turkey': '土耳其',
        'United Republic of Tanzania': '坦桑尼亚联合共和国',
        'Uganda': '乌干达',
        'Ukraine': '乌克兰',
        'Uruguay': '乌拉圭',
        'United States of America': '美国',
        'Uzbekistan': '乌兹别克斯坦',
        'Venezuela': '委内瑞拉',
        'Vietnam': '越南',
        'Vanuatu': '瓦努阿图',
        'West Bank': '西岸',
        'Yemen': '也门',
        'South Africa': '南非',
        'Zambia': '赞比亚',
        'Zimbabwe': '津巴布韦',
        'Taiwan': '台湾',
        'Hong Kong': '香港'
    };
    if (nameMap[name])
        return nameMap[name];
    return null;
};

webSquid.parseTimeCostHour = function (total) {
    var h = total / 60;
    h = Math.floor(h);
    var m = total % 60;
    m = m.toFixed(0);
    return {h: h, m: m};
};

webSquid.parseTimeCostDay = function (total) {
    var d = total / (60 * 24);
    d = Math.floor(d);
    var hm = total - ((d == 0 ? 1 : d) * 24 * 60);
    hm = webSquid.parseTimeCostHour(hm);
    return {d: d, h: hm.h, m: hm.m};
};

webSquid.translateTimeCost = function (value) {
    var val = parseFloat(value);
    if (isNaN(val))
        return value;

    if (val < 60) return val + "分钟";

    var cost;
    var result = '';
    if (val >= 60 && val < 60 * 24) {
        cost = webSquid.parseTimeCostHour(val);
        result = cost.h + "小时";
        if (cost.m > 0) result += cost.m + "分钟";
        return result;
    }

    if (val >= 60 * 24) {
        cost = webSquid.parseTimeCostDay(val);
        result = cost.d + "天";
        if (cost.h > 0) result += cost.h + "小时";
        //else result += "零";
        if (cost.m > 0) result += cost.m + "分钟";
        return result;
    }

};

webSquid.getCountryName = function (code) {
    var codeMap = {
        "004": "Afghanistan",
        "008": "Albania",
        "010": "French Southern and Antarctic Lands",
        "012": "Algeria",
        "024": "Angola",
        "031": "Azerbaijan",
        "032": "Argentina",
        "036": "Australia",
        "040": "Austria",
        "044": "The Bahamas",
        "050": "Bangladesh",
        "051": "Armenia",
        "056": "Belgium",
        "060": "Bermuda",
        "064": "Bhutan",
        "068": "Bolivia",
        "070": "Bosnia and Herzegovina",
        "072": "Botswana",
        "076": "Brazil",
        "084": "Belize",
        "090": "Solomon Islands",
        "096": "Brunei",
        "100": "Bulgaria",
        "104": "Myanmar",
        "108": "Burundi",
        "112": "Belarus",
        "116": "Cambodia",
        "120": "Cameroon",
        "124": "Canada",
        "140": "Central African Republic",
        "144": "Sri Lanka",
        "148": "Chad",
        "152": "Chile",
        "156": "China",
        "170": "Colombia",
        "178": "Republic of the Congo",
        "180": "Democratic Republic of the Congo",
        "188": "Costa Rica",
        "191": "Croatia",
        "192": "Cuba",
        "196": "Cyprus",
        "203": "Czech Republic",
        "204": "Benin",
        "208": "Denmark",
        "214": "Dominican Republic",
        "218": "Ecuador",
        "222": "El Salvador",
        "226": "Equatorial Guinea",
        "231": "Ethiopia",
        "232": "Eritrea",
        "233": "Estonia",
        "238": "Falkland Islands",
        "242": "Fiji",
        "246": "Finland",
        "250": "France",
        "254": "French Guiana",
        "262": "Djibouti",
        "266": "Gabon",
        "268": "Georgia",
        "270": "Gambia",
        "276": "Germany",
        "288": "Ghana",
        "300": "Greece",
        "304": "Greenland",
        "320": "Guatemala",
        "324": "Guinea",
        "328": "Guyana",
        "332": "Haiti",
        "340": "Honduras",
        "348": "Hungary",
        "352": "Iceland",
        "356": "India",
        "360": "Indonesia",
        "364": "Iran",
        "368": "Iraq",
        "372": "Ireland",
        "376": "Israel",
        "380": "Italy",
        "384": "Ivory Coast",
        "388": "Jamaica",
        "392": "Japan",
        "398": "Kazakhstan",
        "400": "Jordan",
        "404": "Kenya",
        "408": "North Korea",
        "410": "South Korea",
        "414": "Kuwait",
        "417": "Kyrgyzstan",
        "418": "Laos",
        "422": "Lebanon",
        "426": "Lesotho",
        "428": "Latvia",
        "430": "Liberia",
        "434": "Libya",
        "440": "Lithuania",
        "442": "Luxembourg",
        "450": "Madagascar",
        "454": "Malawi",
        "458": "Malaysia",
        "466": "Mali",
        "478": "Mauritania",
        "484": "Mexico",
        "496": "Mongolia",
        "498": "Moldova",
        "499": "Montenegro",
        "504": "Morocco",
        "508": "Mozambique",
        "512": "Oman",
        "516": "Namibia",
        "524": "Nepal",
        "528": "Netherlands",
        "540": "New Caledonia",
        "548": "Vanuatu",
        "554": "New Zealand",
        "558": "Nicaragua",
        "562": "Niger",
        "566": "Nigeria",
        "578": "Norway",
        "586": "Pakistan",
        "591": "Panama",
        "598": "Papua New Guinea",
        "600": "Paraguay",
        "604": "Peru",
        "608": "Philippines",
        "616": "Poland",
        "620": "Portugal",
        "624": "Guinea Bissau",
        "626": "East Timor",
        "630": "Puerto Rico",
        "634": "Qatar",
        "642": "Romania",
        "643": "Russia",
        "646": "Rwanda",
        "682": "Saudi Arabia",
        "686": "Senegal",
        "688": "Republic of Serbia",
        "694": "Sierra Leone",
        "703": "Slovakia",
        "704": "Vietnam",
        "705": "Slovenia",
        "706": "Somalia",
        "710": "South Africa",
        "716": "Zimbabwe",
        "724": "Spain",
        "728": "South Sudan",
        "729": "Sudan",
        "732": "Western Sahara",
        "740": "Suriname",
        "748": "Swaziland",
        "752": "Sweden",
        "756": "Switzerland",
        "760": "Syria",
        "762": "Tajikistan",
        "764": "Thailand",
        "768": "Togo",
        "780": "Trinidad and Tobago",
        "784": "United Arab Emirates",
        "788": "Tunisia",
        "792": "Turkey",
        "795": "Turkmenistan",
        "800": "Uganda",
        "804": "Ukraine",
        "807": "Macedonia",
        "818": "Egypt",
        "826": "United Kingdom",
        "834": "United Republic of Tanzania",
        "840": "United States of America",
        "854": "Burkina Faso",
        "858": "Uruguay",
        "860": "Uzbekistan",
        "862": "Venezuela",
        "887": "Yemen",
        "894": "Zambia"
    };
    if (codeMap[code])
        return codeMap[code];
    return null;
};

webSquid.getCountryNameHG = function (code) {
    var codeMap = {
        "101": "Afghanistan",
        "103": "Bangladesh",
        "104": "Bhutan",
        "105": "Brunei",
        "106": "Myanmar",
        "107": "Cambodia",
        "108": "Cyprus",
        "109": "North Korea",
        "110": "Hong Kong",
        "111": "India",
        "112": "Indonesia",
        "113": "Iran",
        "114": "Iraq",
        "115": "Israel",
        "116": "Japan",
        "117": "Jordan",
        "118": "Kuwait",
        "119": "Laos",
        "120": "Lebanon",
        "122": "Malaysia",
        "124": "Mongolia",
        "125": "Nepal",
        "126": "Oman",
        "127": "Pakistan",
        "129": "Philippines",
        "130": "Qatar",
        "131": "Saudi Arabia",
        "133": "South Korea",
        "134": "Sri Lanka",
        "135": "Syria",
        "136": "Thailand",
        "137": "Turkey",
        "138": "United Arab Emirates",
        "139": "Yemen",
        "141": "Vietnam",
        "142": "China",
        "143": "Taiwan",
        "144": "East Timor",
        "145": "Kazakhstan",
        "146": "Kyrgyzstan",
        "147": "Tajikistan",
        "148": "Turkmenistan",
        "149": "Uzbekistan",
        "199": "Northern Cyprus",
        "201": "Algeria",
        "202": "Angola",
        "203": "Benin",
        "204": "Botswana",
        "205": "Burundi",
        "206": "Cameroon",
        "209": "Central African Republic",
        "211": "Chad",
        "213": "Republic of the Congo",
        "214": "Djibouti",
        "215": "Egypt",
        "216": "Equatorial Guinea",
        "217": "Ethiopia",
        "218": "Gabon",
        "219": "Gambia",
        "220": "Ghana",
        "221": "Guinea",
        "222": "Guinea Bissau",
        "223": "Ivory Coast",
        "224": "Kenya",
        "225": "Liberia",
        "226": "Libya",
        "227": "Madagascar",
        "228": "Malawi",
        "229": "Mali",
        "230": "Mauritania",
        "232": "Morocco",
        "233": "Mozambique",
        "234": "Namibia",
        "235": "Niger",
        "236": "Nigeria",
        "238": "Rwanda",
        "240": "Senegal",
        "242": "Sierra Leone",
        "243": "Somalia",
        "244": "South Africa",
        "245": "Western Sahara",
        "246": "Sudan",
        "247": "United Republic of Tanzania",
        "248": "Togo",
        "249": "Tunisia",
        "250": "Uganda",
        "251": "Burkina Faso",
        "252": "Democratic Republic of the Congo",
        "253": "Zambia",
        "254": "Zimbabwe",
        "255": "Lesotho",
        "257": "Swaziland",
        "258": "Eritrea",
        "301": "Belgium",
        "302": "Denmark",
        "303": "United Kingdom",
        "304": "Germany",
        "305": "France",
        "306": "Ireland",
        "307": "Italy",
        "308": "Luxembourg",
        "309": "Netherlands",
        "310": "Greece",
        "311": "Portugal",
        "312": "Spain",
        "313": "Albania",
        "315": "Austria",
        "316": "Bulgaria",
        "318": "Finland",
        "321": "Hungary",
        "322": "Iceland",
        "326": "Norway",
        "327": "Poland",
        "328": "Romania",
        "330": "Sweden",
        "331": "Switzerland",
        "334": "Estonia",
        "335": "Latvia",
        "336": "Lithuania",
        "337": "Georgia",
        "338": "Armenia",
        "339": "Azerbaijan",
        "340": "Belarus",
        "343": "Moldova",
        "344": "Russia",
        "347": "Ukraine",
        "349": "Montenegro",
        "350": "Slovenia",
        "351": "Croatia",
        "352": "Czech Republic",
        "353": "Slovakia",
        "354": "Macedonia",
        "355": "Bosnia and Herzegovina",
        "402": "Argentina",
        "404": "The Bahamas",
        "406": "Belize",
        "408": "Bolivia",
        "410": "Brazil",
        "412": "Chile",
        "413": "Colombia",
        "415": "Costa Rica",
        "416": "Cuba",
        "418": "Dominican Republic",
        "419": "Ecuador",
        "420": "French Guiana",
        "423": "Guatemala",
        "424": "Guyana",
        "425": "Haiti",
        "426": "Honduras",
        "427": "Jamaica",
        "429": "Mexico",
        "431": "Nicaragua",
        "432": "Panama",
        "433": "Paraguay",
        "434": "Peru",
        "435": "Puerto Rico",
        "440": "El Salvador",
        "441": "Suriname",
        "442": "Trinidad and Tobago",
        "444": "Uruguay",
        "445": "Venezuela",
        "501": "Canada",
        "502": "United States of America",
        "503": "Greenland",
        "504": "Bermuda",
        "601": "Australia",
        "603": "Fiji",
        "607": "New Caledonia",
        "608": "Vanuatu",
        "609": "New Zealand",
        "611": "Papua New Guinea",
        "613": "Solomon Islands",
        "699": "French Southern and Antarctic Lands"
    };
    if (codeMap[code])
        return codeMap[code];
    return null;
};

webSquid.getGoodsLevel1 = function (code) {
    if (code == null)
        return "其它";

    var topMap = [
        {name: "美妆个护", value: ["33", "960329", "9615", "9616"]},
        {
            name: "食品保健",
            value: ["24", "02", "03", "04", "05", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "21069090", "22", "25", "27", "28", "29"]
        },
        {name: "母婴用品", value: ["19011010", "19011090", "9619001"]},
        {name: "皮包饰品", value: ["41", "42", "43", "71", "91"]},
        {
            name: "服饰鞋帽",
            value: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65"]
        },
        {name: "数码家电", value: ["84", "844", "847", "85", "8516", "8510", "88"]},
        {
            name: "生活用具",
            value: ["30", "32", "36", "66", "67", "68", "69", "70", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "86", "87", "89", "900", "90", "9617", "92", "93", "94", "95", "96", "97", "35", "37", "39", "40", "44", "45", "46", "48", "49", "23"]
        },
        {name: "卫生清洁", value: ["34", "9619002", "38", "960321"]},
        {name: "工农业原料", value: ["26", "31"]}
    ];

    var resultList = [];

    for (var idx in topMap) {
        var item = topMap[idx];
        for (var jdx in item.value) {
            item.value.sort(function (a, b) {
                return (b + "").length - (a + "").length;
            });
            var c1 = item.value[jdx];
            if (code.indexOf(c1) == 0)
                resultList.push({name: item.name, value: c1});
        }
    }
    if (resultList.length == 0)
        return "其它";
    resultList.sort(function (a, b) {
        return (b.value + "").length - (a.value + "").length;
    });
    return resultList[0].name;
};

webSquid.getProvinceMap = function () {
    return {
        '台湾': [121.509062, 25.044332]
        // , '河北': [114.502461, 38.045474]
        , '河北': [115.002461, 38.045474]
        // , '山西': [112.549248, 37.857014]
        , '山西': [112.049248, 36.857014]
        , '内蒙古': [111.670801, 40.818311]
        , '辽宁': [123.429096, 41.796767]
        , '吉林': [125.3245, 43.886841]
        , '黑龙江': [126.642464, 45.756967]
        // , '江苏': [118.767413, 32.041544]
        , '江苏': [119.767413, 33.041544]
        // , '浙江': [120.153576, 30.287459]
        , '浙江': [120.153576, 29.007459]
        // , '安徽': [117.283042, 31.86119]
        , '安徽': [117.003042, 32.36119]
        // , '福建': [119.306239, 26.075302]
        , '福建': [119.006239, 26.075302]
        // , '江西': [115.892151, 28.676493]
        , '江西': [115.892151, 27.676493]
        // , '山东': [117.000923, 36.675807]
        , '山东': [118.000923, 36.075807]
        // , '河南': [113.665412, 34.757975]
        , '河南': [113.665412, 33.757975]
        // , '湖北': [114.298572, 30.584355]
        , '湖北': [113.298572, 30.984355]
        // , '湖南': [112.982279, 28.19409]
        , '湖南': [111.982279, 27.69409]
        // , '广东': [113.280637, 23.125178]
        , '广东': [113.280637, 23.825178]
        // , '广西': [108.320004, 22.82402]
        , '广西': [108.820004, 23.82402]
        , '海南': [110.33119, 20.031971]
        // , '四川': [104.065735, 30.659462]
        , '四川': [103.065735, 30.659462]
        , '贵州': [106.713478, 26.578343]
        , '云南': [102.712251, 25.040609]
        , '西藏': [91.132212, 29.660361]
        , '陕西': [108.948024, 34.263161]
        , '甘肃': [103.823557, 36.058039]
        , '青海': [101.778916, 36.623178]
        , '宁夏': [106.278179, 38.46637]
        , '新疆': [87.617733, 43.792818]
        // , '北京': [116.405285, 39.904989]
        , '北京': [116.205285, 40.904989]
        // , '天津': [117.190182, 39.125596]
        , '天津': [117.690182, 39.025596]
        , '上海': [121.472644, 31.231706]
        // , '重庆': [106.504962, 29.533155]
        , '重庆': [107.504962, 29.633155]
        , '香港': [114.173355, 22.320048]
        , '澳门': [113.54909, 22.198951]
    }
};

webSquid.getProvince = function (address, defaultReturn) {
    var map = webSquid.getProvinceMap();
    var provinces = [];
    for (var province in map) {
        provinces.push(province);
    }
    provinces.sort(function (a, b) {
        return a.length > b.length
    });

    var prov;
    for (var idx in provinces) {
        prov = provinces[idx];
        if (address.indexOf(prov) > -1)
            return prov;
    }
    return defaultReturn;
};

webSquid.formatSplitCost = function (total) {
    //var val = webSquid.parseTimeCostDay(total);
    //if (val.d > 0) {
    //    val.d += val.h > 0 ? 1 : 0;
    //    return val.d + "天";
    //}
    //if (val.h > 0) {
    //    val.h += val.m > 0 ? 1 : 0;
    //    return val.h + "小时";
    //}

    return webSquid.translateTimeCost(total);
};

webSquid.resizeAllChart = function () {
    webSquid.resizeChart = webSquid.resizeChart || {
            lastTime: new Date().getTime(),
            lastSize: 0
        };
    var timePast = new Date().getTime() - webSquid.resizeChart.lastTime;
    var size = $("#content").width();
    if ((timePast > 1000) && (size != webSquid.resizeChart.lastSize)) {
        $(".echarts").each(function () {
            var chart = echarts.getInstanceByDom($(this)[0]);
            if (chart != null) {
                chart.resize();
            }
            webSquid.resizeChart.lastTime = new Date().getTime();
            webSquid.resizeChart.lastSize = size;
        });
    }

    setTimeout(webSquid.resizeAllChart, 500);
};

$(function () {
    $(".sidebar a").each(function () {
        var menu = $(this).attr("contextmenu");
        var ie = $(this).attr("ie");
        var sign = $(this).attr("sign");
        if (!menu) return;
        if (!ie) return;
        if (!sign) return;
        $(this).click(function () {
            var ie = $(this).attr("ie");
            var sign = $(this).attr("sign");
            if (!menu) return;
            if (!ie) return;
            if (!sign) return;

            webSquid.ie = ie;
            webSquid.sign = sign;
            webSquid.loadPage("#content", menu).done(webSquid.bindActions);

            $("html,body").animate({scrollTop: 0}, 500);
        });
    });

    $(".sidebar a[contextmenu]:first").click();

    setTimeout(webSquid.resizeAllChart, 500);
});


