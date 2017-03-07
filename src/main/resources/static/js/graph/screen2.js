/**
 * 转关贸易国别统计
 * Created by xcp on 2016/11/23.
 */

webSquid.page.modules["graph/screen2"] = webSquid.page.modules["graph/screen2"] || {

        screen2_totalMoney: '',
        //柱状图数据
        bar_title: '主要出口国家',
        bar_data_x: [],
        bar_colors: ['#3E9EDA', '#7CCA62', '#FFC000', '#4F81C0', '#A28BC2', '#A3CFED', '#59B052', '#F19545', '#3D94BA', '#8064A2', '#C0504D'],
        bar_legend_data: [{name: '出口'}],
        bar_data: [
            {
                name: '出口',
                type: 'bar',
                dataLabels: {enabled: true},
                data: []
            }
        ],

        //折线图数据
        line_title: '主要出口国家',
        line_data_x: [],
        line_colors: ['#206BBC', '#32BFC8'],
        line_legend_data: [{name: '出口'}],
        line1_data: [],
        line2_data: [],
        line_xAxis_data: ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00'],

        //地图数据
        map_geoCoordMap: {
            '郑州': [113.4668, 34.6234],
            '安道尔': [1.5, 42.5],
            '阿拉伯联合酋长国': [54, 24],
            '阿富汗': [65, 33],
            '安提瓜和巴布达': [-61.8, 17.05],
            '安圭拉': [-63.1667, 18.25],
            '阿尔巴尼亚': [20, 41],
            '亚美尼亚': [45, 40],
            '荷属安地列斯': [-68.75, 12.25],
            '安哥拉': [18.5, -12.5],
            '南极洲': [0, -90],
            '阿根廷': [-64, -34],
            '美属萨摩亚': [-170, -14.3333],
            '奥地利': [13.3333, 47.3333],
            '澳大利亚': [133, -27],
            '阿鲁巴': [-69.9667, 12.5],
            '阿塞拜疆': [47.5, 40.5],
            '波斯尼亚和黑塞哥维那': [18, 44],
            '巴巴多斯': [-59.5333, 13.1667],
            '孟加拉': [90, 24],
            '比利时': [4, 50.8333],
            '布基纳法索': [-2, 13],
            '保加利亚': [25, 43],
            '巴林': [50.55, 26],
            '布隆迪': [30, -3.5],
            '贝宁': [2.25, 9.5],
            '百慕大': [-64.75, 32.3333],
            '文莱': [114.6667, 4.5],
            '玻利维亚': [-65, -17],
            '巴西': [-55, -10],
            '巴哈马': [-76, 24.25],
            '不丹': [90.5, 27.5],
            '布维岛': [3.4, -54.4333],
            '博茨瓦纳': [24, -22],
            '白俄罗斯': [28, 53],
            '伯利兹': [-88.75, 17.25],
            '加拿大': [-95, 60],
            '科科斯（基林）群岛': [96.8333, -12.5],
            '刚果': [25, 0],
            '中非共和国': [21, 7],
            '瑞士': [8, 47],
            '科特迪瓦': [-5, 8],
            '库克群岛': [-159.7667, -21.2333],
            '智利': [-71, -30],
            '喀麦隆': [12, 6],
            '哥伦比亚': [-72, 4],
            '哥斯达黎加': [-84, 10],
            '古巴': [-80, 21.5],
            '佛得角': [-24, 16],
            '圣诞岛': [105.6667, -10.5],
            '塞浦路斯': [33, 35],
            '捷克共和国': [15.5, 49.75],
            '德国': [9, 51],
            '吉布提': [43, 11.5],
            '丹麦': [10, 56],
            '多米尼克': [-61.3333, 15.4167],
            '多米尼加共和国': [-70.6667, 19],
            '阿尔及利亚': [3, 28],
            '厄瓜多尔': [-77.5, -2],
            '爱沙尼亚': [26, 59],
            '埃及': [30, 27],
            '西撒哈拉': [-13, 24.5],
            '厄立特里亚': [39, 15],
            '西班牙': [-4, 40],
            '埃塞俄比亚': [38, 8],
            '芬兰': [26, 64],
            '斐济': [175, -18],
            '马尔维纳斯群岛': [-59, -51.75],
            '密克罗尼西亚': [158.25, 6.9167],
            '法罗群岛': [-7, 62],
            '法国': [2, 46],
            '加蓬': [11.75, -1],
            '英国': [-2, 54],
            '格林纳达': [-61.6667, 12.1167],
            '格鲁吉亚': [43.5, 42],
            '法属圭亚那': [-53, 4],
            '加纳': [-2, 8],
            '直布罗陀': [-5.3667, 36.1833],
            '格陵兰岛': [-40, 72],
            '冈比亚': [-16.5667, 13.4667],
            '几内亚': [-10, 11],
            '瓜德罗普岛': [-61.5833, 16.25],
            '赤道几内亚': [10, 2],
            '希腊': [22, 39],
            '南乔治亚岛和南桑威奇群岛': [-37, -54.5],
            '危地马拉': [-90.25, 15.5],
            '关岛': [144.7833, 13.4667],
            '几内亚比绍': [-15, 12],
            '圭亚那': [-59, 5],
            '赫德岛和麦当劳群岛': [72.5167, -53.1],
            '洪都拉斯': [-86.5, 15],
            '克罗地亚': [15.5, 45.1667],
            '海地': [-72.4167, 19],
            '匈牙利': [20, 47],
            '印度尼西亚': [120, -5],
            '爱尔兰': [-8, 53],
            '以色列': [34.75, 31.5],
            '印度': [77, 20],
            '英属印度洋领地': [71.5, -6],
            '伊拉克': [44, 33],
            '伊朗': [53, 32],
            '冰岛': [-18, 65],
            '意大利': [12.8333, 42.8333],
            '牙买加': [-77.5, 18.25],
            '乔丹': [36, 31],
            '日本': [138, 36],
            '肯尼亚': [38, 1],
            '吉尔吉斯斯坦': [75, 41],
            '柬埔寨': [105, 13],
            '基里巴斯': [173, 1.4167],
            '科摩罗': [44.25, -12.1667],
            '圣基茨和尼维斯': [-62.75, 17.3333],
            '朝鲜': [127, 40],
            '韩国': [127.5, 37],
            '科威特': [47.6581, 29.3375],
            '开曼群岛': [-80.5, 19.5],
            '哈萨克斯坦': [68, 48],
            '老挝': [105, 18],
            '黎巴嫩': [35.8333, 33.8333],
            '圣露西亚': [-61.1333, 13.8833],
            '列支敦士登': [9.5333, 47.1667],
            '斯里兰卡': [81, 7],
            '利比里亚': [-9.5, 6.5],
            '莱索托': [28.5, -29.5],
            '立陶宛': [24, 56],
            '卢森堡': [6.1667, 49.75],
            '拉脱维亚': [25, 57],
            '阿拉伯利比亚民众国': [17, 25],
            '摩洛哥': [-5, 32],
            '摩纳哥': [7.4, 43.7333],
            '摩尔多瓦': [29, 47],
            '黑山': [19, 42],
            '马达加斯加': [47, -20],
            '马绍尔群岛': [168, 9],
            '马其顿': [22, 41.8333],
            '马里': [-4, 17],
            '缅甸': [98, 22],
            '蒙古': [105, 46],
            '北马里亚纳群岛': [145.75, 15.2],
            '马提尼克岛': [-61, 14.6667],
            '毛里塔尼亚': [-12, 20],
            '蒙特塞拉特': [-62.2, 16.75],
            '马耳他': [14.5833, 35.8333],
            '毛里求斯': [57.55, -20.2833],
            '马尔代夫': [73, 3.25],
            '马拉维': [34, -13.5],
            '墨西哥': [-102, 23],
            '马来西亚': [112.5, 2.5],
            '莫桑比克': [35, -18.25],
            '纳米比亚': [17, -22],
            '新喀里多尼亚': [165.5, -21.5],
            '尼日尔': [8, 16],
            '诺福克岛': [167.95, -29.0333],
            '尼日利亚': [8, 10],
            '尼加拉瓜': [-85, 13],
            '荷兰': [5.75, 52.5],
            '挪威': [10, 62],
            '尼泊尔': [84, 28],
            '瑙鲁': [166.9167, -0.5333],
            '纽埃': [-169.8667, -19.0333],
            '新西兰': [174, -41],
            '阿曼': [57, 21],
            '巴拿马': [-80, 9],
            '秘鲁': [-76, -10],
            '法属波利尼西亚': [-140, -15],
            '巴布亚新几内亚': [147, -6],
            '菲律宾': [122, 13],
            '巴基斯坦': [70, 30],
            '波兰': [20, 52],
            '圣皮埃尔和密克隆岛': [-56.3333, 46.8333],
            '波多黎各': [-66.5, 18.25],
            '葡萄牙': [-8, 39.5],
            '帕劳': [134.5, 7.5],
            '巴拉圭': [-58, -23],
            '卡塔尔': [51.25, 25.5],
            '留尼旺岛': [55.6, -21.1],
            '罗马尼亚': [25, 46],
            '塞尔维亚': [21, 44],
            '俄罗斯': [100, 60],
            '卢旺达': [30, -2],
            '沙特阿拉伯': [45, 25],
            '所罗门群岛': [159, -8],
            '塞舌尔': [55.6667, -4.5833],
            '苏丹': [30, 15],
            '瑞典': [15, 62],
            '新加坡': [103.8, 1.3667],
            '斯洛文尼亚': [15, 46],
            '斯洛伐克': [19.5, 48.6667],
            '塞拉利昂': [-11.5, 8.5],
            '圣马力诺': [12.4167, 43.7667],
            '塞内加尔': [-14, 14],
            '索马里': [49, 10],
            '苏里南': [-56, 4],
            '圣多美和普林西比': [7, 1],
            '萨尔瓦多': [-88.9167, 13.8333],
            '叙利亚': [38, 35],
            '斯威士兰': [31.5, -26.5],
            '特克斯和凯科斯群岛': [-71.5833, 21.75],
            '乍得': [19, 15],
            '多哥': [1.1667, 8],
            '泰国': [100, 15],
            '塔吉克斯坦': [71, 39],
            '托克劳': [-172, -9],
            '土库曼斯坦': [60, 40],
            '突尼斯': [9, 34],
            '汤加': [-175, -20],
            '土耳其': [35, 39],
            '特立尼达和多巴哥': [-61, 11],
            '图瓦卢': [178, -8],
            '坦桑尼亚': [35, -6],
            '乌克兰': [32, 49],
            '乌干达': [32, 1],
            '美国': [-97, 38],
            '乌拉圭': [-56, -33],
            '乌兹别克斯坦': [64, 41],
            '委内瑞拉': [-66, 8],
            '越南': [106, 16],
            '瓦努阿图': [167, -16],
            '瓦利斯和富图纳群岛': [-176.2, -13.3],
            '萨摩亚': [-172.3333, -13.5833],
            '也门': [48, 15],
            '马约特': [45.1667, -12.8333],
            '南非': [24, -29],
            '赞比亚': [30, -15],
            '津巴布韦': [30, -20]
        },
        map_color: ['#a6c84c', '#ffa022', '#46bee9'],
        planePath: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
        map_data: [
            [{name: '郑州'}, {name: '美国', value: 95}]
        ],
        convertData: function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = this.map_geoCoordMap[dataItem[0].name];
                var toCoord = this.map_geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        },
        makeSeries: function () {
            var ser = [];
            [['郑州', this.map_data]].forEach(function (item, i) {

                var screen2 = webSquid.page.modules["graph/screen2"];
                ser.push({
                        name: item[0] + ' Top10',
                        type: 'lines',
                        zlevel: 1,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0.7,
                            color: '#fff',
                            symbolSize: 3
                        },
                        lineStyle: {
                            normal: {
                                color: '#a6c84c',
                                width: 0,
                                curveness: 0.2
                            }
                        },
                        data: screen2.convertData(item[1])
                    },
                    {
                        name: item[0] + ' Top10',
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0,
                            symbol: screen2.planePath,
                            symbolSize: 15
                        },
                        lineStyle: {
                            normal: {
                                color: screen2.map_color[i],
                                width: 1,
                                opacity: 0.4,
                                curveness: 0.2
                            }
                        },
                        data: screen2.convertData(item[1])
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: '{b}',
                                color: '#fff',
                                textStyle: {
                                    fontSize: 14,
                                    color: '#fff'
                                }
                            }
                        },
                        symbolSize: function (val) {
                            return val[2] / (webSquid.pageModule("graph/screen2").mapValueSum) * 50;
                        },
                        itemStyle: {
                            normal: {
                                color: '#a6c84c'
                            }
                        },
                        data: item[1].map(function (dataItem) {
                            return {
                                name: dataItem[1].name,
                                value: screen2.map_geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                            };
                        })
                    });
            });
            return ser;
        },


        /**
         * 初始化
         */
        init: function () {
            var m = webSquid.pageModule("graph/screen2");
            webSquid.currentPage = m;
            var year = moment().year();
            $("#year").text(year);

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen2_money_MH",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31 23:59:59"
            }, function (rsp) {
                $("#screen1_eMoney").html((rsp.data[0].total / 10000).toFixed(2));

                var total = parseFloat($("#screen1_eMoney").html());
                $("#screen2_totalMoney").html(total + "万");
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen2_map",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31 23:59:59"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen2");
                m.mheData = [];
                var mapData = [];
                var sum = 0;
                for (var idx in rsp.data) {
                    var item = rsp.data[idx];
                    var countryName = webSquid.getCountryName(item.name);
                    if (countryName == null) continue;
                    countryName = webSquid.translateCountry(countryName);
                    if (countryName == null) continue;
                    if (m.map_geoCoordMap[countryName] == null) continue;

                    mapData.push([{name: '郑州'}, {name: countryName, value: item.value}]);
                    m.mheData.push({name: countryName, value: item.value});
                    sum += item.value;
                }
                m.map_data = mapData;
                m.mapValueSum = sum;

                // 地图
                var mapCharts = echarts.init(document.getElementById('map_screen2'));

                var option = {
                    geo: {
                        map: 'world',
                        type: 'map',
                        zoom: 1.2,
                        left: 30,
                        right: 50,
                        top: 90,
                        bottom: 70,
                        roam: false,
                        label: {
                            normal: {
                                show: false,
                                formatter: function (params) {
                                    return webSquid.translateCountry(params.name);
                                }
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#3BA7DC',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#3BA7DC',
                                color: '#3BA7DC'
                            }
                        }
                    },
                    tooltip: {
                        formatter: function (param) {
                            var seriesName = param.seriesName;
                            var area = param.name;
                            var values = param.value;
                            var label = area;
                            if (typeof(values) == "undefined") return;
                            if (values.length >= 3) {
                                var value = values[2];
                                label += " : " + value + "单";
                            }
                            return label;
                        }
                    },
                    series: m.makeSeries()
                };
                webSquid.graph(mapCharts, option);


                ///////////////////////////////////

                var mheData = m.mheData;
                mheData.sort(function (a, b) {
                    return b.value - a.value;
                });

                var impObj = {};
                for (var idx in rsp.data) {
                    var item = rsp.data[idx];
                    var countryName = webSquid.getCountryName(item.name);
                    if (countryName == null) continue;
                    countryName = webSquid.translateCountry(countryName);
                    if (countryName == null) continue;
                    if (m.map_geoCoordMap[countryName] == null) continue;

                    impObj[countryName] = item.value;
                }

                var expObj = {};
                var xData = [];
                var xObj = {};
                for (var idx in mheData) {
                    var item = mheData[idx];

                    expObj[item.name] = item.value;
                    if (impObj[item.name]) {
                        if (xObj[item.name] == null) {
                            xData.push(item.name);
                            xObj[item.name] = 1;
                        }
                    }
                }

                var expData = [], impData = [], names = [];
                for (var name in expObj) {
                    names.push(name);
                    expData.push(expObj[name]);
                    impData.push(impObj[name] == null ? 0 : impObj[name]);
                }

                m.bar_data_x = names;
                m.bar_data = [
                    {
                        name: "出口", type: "bar", label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }, data: expData
                    }
                ];

                // 主要进出口国家
                var barCharts = echarts.init(document.getElementById('bar_screen2'));
                m.graph_bar(barCharts);

            });


            this.line_xAxis_data = [];

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen2_line_HG",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31 23:59:59"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen2");
                m.hgshixiao = rsp.data;

                webSquid.ajax("data/s/HJ", "GET", {
                    sid: "screen2_line_GJ",
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    start: year + "-1-1",
                    end: year + "-12-31 23:59:59"
                }, function (rsp) {
                    var m = webSquid.pageModule("graph/screen2");
                    var hg = m.hgshixiao;
                    var gj = rsp.data;

                    var hgObj = {};
                    var gjObj = {};
                    for (var i in hg) {
                        var item = hg[i];
                        item.hour_name = parseInt(item.hour_name) + "";
                        hgObj[item.hour_name] = item.total;
                    }
                    for (var i in gj) {
                        var item = gj[i];
                        item.hour_name = parseInt(item.hour_name) + "";
                        gjObj[item.hour_name] = item.total;
                    }

                    m.line_xAxis_data = [];
                    m.line1_data = [];
                    m.line2_data = [];
                    for (var i = 1; i <= 24; i++) {
                        m.line_xAxis_data.push(i + ":00");
                        if (hgObj[i + ""])
                            m.line1_data.push(hgObj[i + ""]);
                        else
                            m.line1_data.push(0);
                        if (gjObj[i + ""])
                            m.line2_data.push(gjObj[i + ""]);
                        else
                            m.line2_data.push(0);
                    }

                    // 放行时间分布
                    var lineCharts = echarts.init(document.getElementById('line_screen2'));
                    m.graph_line(lineCharts);
                });
            });

        },

        graph_bar: function (barCharts) {
            var option = {
                color: ['#3E9EDA'],
                grid: {
                    left: '3%',
                    right: '0%',
                    bottom: '3%',
                    containLabel: true
                },
                title: {
                    text: this.bar_title,
                    show: true,
                    left: 'left',
                    textStyle: {
                        color: '#D49F3F'
                    }
                },
                tooltip: {
                    show: true,
                    formatter: function (v) {
                        return v.name + "<br/>" + v.seriesName + ":" + v.value + "单";
                    }
                },
                legend: {
                    data: this.bar_legend_data,
                    left: 'right',
                    textStyle: {
                        color: '#FFF'
                    },
                    show: false
                },
                xAxis: {
                    data: this.bar_data_x,
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        textStyle: {
                        }
                    }
                },
                yAxis: {
                    name: '订单量（单）',
                    splitLine: false,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        show: true
                    }
                },
                series: this.bar_data
            };
            webSquid.graph(barCharts, option);
        },

        graph_line: function (lineCharts) {
            var option = {
                color: ["#f60", "#6295D1"],
                title: {
                    text: '放行时间分布',
                    left: 'left',
                    textStyle: {
                        color: '#D49F3F'
                    }
                },
                legend: {
                    data: ['海关', '检疫检验'],
                    left: 'right',
                    textStyle: {
                        color: '#FFF'
                    }
                },
                grid: {
                    left: '5%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: this.line_xAxis_data,
                        axisLine: {
                            lineStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '订单量（单）',
                        splitLine: true,
                        splitNumber: 4,
                        offset: 10,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff'
                            }
                        },
                        axisLabel: {
                            show: true
                        }
                    }
                ],
                series: [
                    {
                        name: '海关',
                        type: 'bar',
                        data: this.line1_data
                    },
                    {
                        name: '检疫检验',
                        type: 'bar',
                        data: this.line2_data
                    }
                ]
            };
            webSquid.graph(lineCharts, option);
        }

    };
