/**
 * 转关消费者交易统计
 * Created by xcp on 2016/11/23.
 */
webSquid.page.modules["graph/screen1"] = webSquid.page.modules["graph/screen1"] || {

        //本月跨境进出口量
        screen1_iCount: 0,
        screen1_iMoney: 0,
        screen1_eCount: 0,
        screen1_eMoney: 0,
        screen1_totalMoney: 0,
        //今日订单数
        today_orders: 0,
        //电商企业
        online: [],
        //物流企业
        logistics: [],
        //地图数据
        map_title: '区域分布',
        map_data: [],
        map_geoCoordMap: webSquid.getProvinceMap(),

        //柱状图数据
        bar_data_x: [],
        bar_colors: ['#E9733B', '#F5BA28'],
        bar_data: [],

        //左下柱状图数据
        bar2_data_x: ['保税物流中心', '郑州综保区', '快件中心', '郑州机场', '跨境园区'],
        bar2_colors: ['#E9733B', '#F5BA28'],
        bar2_data: [],
        //环形图1数据
        pie1_colors: ['#4A85C9', '#E16726', '#A28BC2', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4'],
        pie1_data: [],

        //环形图2数据
        pie2_colors: ['#4A85C9', '#E16726', '#A28BC2', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4'],
        pie2_legend_data: [],
        pie2_data: [],

        //环形图3数据
        pie3_colors: ['#4A85C9', '#E16726', '#A28BC2', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4'],
        pie3_legend_data: [],
        pie3_data: [],

        //折线图数据
        line_data_x: [],
        line_colors: ['#EB023B', '#27DDDB'],
        line_data1: [],
        line_data2: [],
        app1: {},
        app2: {},
        app3: {},


        convertData: function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = this.map_geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        },

        /**
         * 初始化
         */
        init: function () {
            var m = webSquid.pageModule("graph/screen1");
            m.app1 = {};
            m.app2 = {};
            m.app3 = {};
            m.app1.currentIndex = -1;
            m.app2.currentIndex = -1;
            m.app3.currentIndex = -1;
            var year = moment().year();
            $("#year").text(year);

            // 性别占比
            webSquid.ajax("data/s/WT", "GET", {
                    sid: "screen1_pie2",
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    start: year + "-1-1",
                    end: year + "-12-31"
                },
                function (rsp) {
                    var m = webSquid.pageModule("graph/screen1");
                    webSquid.currentPage = m;
                    var arr = m.pie2_data;
                    for (var idx in rsp.data) {
                        var rd = {name: "", value: 0};
                        rd.name = rsp.data[idx].fumal == 1 ? "男性购物者" : "女性购物者";
                        rd.value = rsp.data[idx].value;
                        arr[idx] = rd;
                    }

                    // 性别
                    m.graph_pie2(echarts.init($('#pie2_screen1')[0]));

                });

            // 商品大类柱状图
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_bar",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                m.bar_data_x = [];
                m.bar_data = [];
                var cnt = 0;
                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    m.bar_data_x.push(item.gcode);
                    m.bar_data.push(item.value);
                }

                // 柱状图
                var barCharts = echarts.init(document.getElementById('bar_screen1'));
                m.graph_bar(barCharts);

            });


            // 商品大类饼状图
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_pie1",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                m.pie1_data = [];
                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    m.pie1_data.push({name: item.gcode, value: item.value});
                }

                // 饼图1
                var pieCharts1 = echarts.init(document.getElementById('pie1_screen1'));
                m.graph_pie1(pieCharts1);
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_iCount",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                $("#screen1_iCount").html(rsp.data[0].value);
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_eCount",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                $("#screen1_eCount").html(rsp.data[0].value);
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_iMoney",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                $("#screen1_iMoney").html((rsp.data[0].total / 10000).toFixed(2));

                var total = 0;// parseFloat($("#screen1_eMoney").html());
                total += parseFloat($("#screen1_iMoney").html());
                total = total.toFixed(2);
                $("#screen1_totalMoney").html(total + "万");
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_eMoney",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                $("#screen1_eMoney").html((rsp.data[0].total / 10000).toFixed(2));

            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_orders",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                $("#s1_today_orders").html(rsp.data[0].value);
            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_DSOrder",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                var allObj = {};
                for (var ir in rsp.data) {
                    var iitem = rsp.data[ir];
                    if (allObj[iitem.name]) {
                        allObj[iitem.name] += iitem.value;
                        continue;
                    }
                    allObj[iitem.name] = iitem.value;
                }

                var allArr = [];
                for (var i in allObj) {
                    allArr.push({name: i, value: allObj[i]});
                }

                allArr.sort(function (x, y) {
                    if (x.value == y.value)
                        return 0;
                    if (x.value > y.value)
                        return -1;
                    return 1;
                });

                for (var i = 0; i < allArr.length && i < 5; i++) {
                    var item = allArr[i];
                    $("#s1_row" + (i + 1) + "_left1").html("<a style='cursor:pointer;color:#03a9F4;' title=\"" + item.name + "\">" + item.name.substring(0, 4) + "</a>");
                    $("#s1_row" + (i + 1) + "_left2").html(item.value);
                }

            });


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_WLOrder",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                var allObj = {};
                for (var ir in rsp.data) {
                    var iitem = rsp.data[ir];
                    if (allObj[iitem.name]) {
                        allObj[iitem.name] += iitem.value;
                        continue;
                    }
                    allObj[iitem.name] = iitem.value;
                }

                var allArr = [];
                for (var i in allObj) {
                    allArr.push({name: i, value: allObj[i]});
                }

                allArr.sort(function (x, y) {
                    if (x.value == y.value)
                        return 0;
                    if (x.value > y.value)
                        return -1;
                    return 1;
                });

                for (var i = 0; i < allArr.length && i < 5; i++) {
                    var item = allArr[i];
                    $("#s1_row" + (i + 1) + "_right1").html("<a style='cursor:pointer;color:#03A9F4' title=\"" + item.name + "\">" + item.name.substring(0, 4) + "</a>");
                    $("#s1_row" + (i + 1) + "_right2").html(item.value);
                }
            });


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_bar2_query1",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp11) {
                var m = webSquid.pageModule("graph/screen1");
                m.areaCode = {};
                for (var idx in rsp11.data) {
                    var item = rsp11.data[idx];
                    m.areaCode[item.code] = item.name;
                }

                webSquid.ajax("data/s/HJ", "GET", {
                    sid: "screen1_bar2_query2",
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    start: year + "-1-1",
                    end: year + "-12-31"
                }, function (rsp) {
                    var m = webSquid.pageModule("graph/screen1");

                    var allObj = {};
                    for (var idx in rsp.data) {
                        var item = rsp.data[idx];
                        if (allObj[item.name]) {
                            allObj[item.name] += item.value;
                            continue;
                        }
                        allObj[item.name] = item.value;
                    }

                    var allArr = [];
                    var total = 0;
                    for (var i in allObj) {
                        allArr.push({name: i, value: allObj[i]});
                        total += allObj[i];
                    }
                    for (var i in allArr) {
                        allArr[i].value = Math.round(allArr[i].value / total * 100);
                    }

                    allArr.sort(function (x, y) {
                        if (x.value == y.value)
                            return 0;
                        if (x.value > y.value)
                            return -1;
                        return 1;
                    });

                    m.bar2_data = [];
                    m.bar2_data_x = [];
                    for (idx = 0; idx < 5; idx++) {
                        var it = allArr[idx];
                        if (!it) break;
                        if (m.areaCode[allArr[idx].name] == null) continue;
                        allArr[idx].name = m.areaCode[allArr[idx].name];
                        var name = allArr[idx].name;
                        if (name.length > 5)
                            name = name.replace("海关", "");
                        m.bar2_data.push(allArr[idx].value);
                        m.bar2_data_x.push(name);
                    }

                    // 柱状图 左下
                    var barCharts2 = echarts.init(document.getElementById('bar2_screen1'));
                    m.graph_bar2(barCharts2);

                });

            });


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_map",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");
                var allProv = {
                    '北京': 1,
                    '天津': 1,
                    '上海': 1,
                    '重庆': 1,
                    '河北': 1,
                    '河南': 1,
                    '云南': 1,
                    '辽宁': 1,
                    '黑龙江': 1,
                    '湖南': 1,
                    '安徽': 1,
                    '山东': 1,
                    '新疆': 1,
                    '江苏': 1,
                    '浙江': 1,
                    '江西': 1,
                    '湖北': 1,
                    '广西': 1,
                    '甘肃': 1,
                    '山西': 1,
                    '内蒙古': 1,
                    '陕西': 1,
                    '吉林': 1,
                    '福建': 1,
                    '贵州': 1,
                    '广东': 1,
                    '青海': 1,
                    '西藏': 1,
                    '四川': 1,
                    '宁夏': 1,
                    '海南': 1,
                    '台湾': 1,
                    '香港': 1,
                    '澳门': 1
                };
                var map = {};
                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    var province = (function (name) {

                        for (var i = name.length; i >= 2; i--) {
                            var tmp = name.substring(0, i);
                            if (allProv[tmp] == 1) {
                                return tmp;
                            }
                        }

                    })(item.name);
                    if (map[province]) {
                        map[province] += item.value;
                    } else {
                        map[province] = item.value;
                    }
                }

                var mapData = [];
                m.map_total = 0;
                for (var key in map) {
                    mapData.push({name: key, value: map[key]});
                    m.map_total += parseInt(map[key]);
                }
                m.map_data = mapData;

                // 地图
                var mapCharts = echarts.init(document.getElementById('map_screen1'));
                m.graph_map(mapCharts);
            });


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_pie3",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: year + "-1-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                var obj = {};
                for (var idx in rsp.data) {
                    var item = rsp.data[idx];
                    // var name = webSquid.getGoodsLevel2(item.name);
                    var name = item.name;
                    if (name == null) continue;

                    if (obj[name]) obj[name] += item.value;
                    else obj[name] = item.value;
                }

                m.pie3_data = [];
                m.pie3_legend_data = [];
                for (var name in obj) {
                    var value = obj[name];
                    m.pie3_data.push({name: name, value: value});
                    m.pie3_legend_data.push(name);
                }

                // 饼图3
                var pieCharts3 = echarts.init(document.getElementById('pie3_screen1'));
                m.graph_pie3(pieCharts3);
            });


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "screen1_line_i",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: moment(new Date()).subtract(6, 'M').format("YYYY-MM") + "-1",
                end: year + "-12-31"
            }, function (rsp) {
                var m = webSquid.pageModule("graph/screen1");

                m.line_data1 = rsp.data;

                // 折线图
                var lineCharts = echarts.init(document.getElementById('line_screen1'));
                m.graph_line(lineCharts);
            });


        },


        graph_map: function (mapCharts) {
            var option = {
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: false,
                    top: 40,
                    zoom: 1.3,
                    itemStyle: {
                        normal: {
                            areaColor: '#3BA7DC',
                            borderColor: '#000'
                        },
                        emphasis: {
                            areaColor: '#3BA7DC',
                            color: '#3BA7DC'
                        }
                    }
                },
                tooltip: {
                    show: false,
                    formatter: function (param) {
                        var seriesName = param.seriesName;
                        var area = param.name;
                        var values = param.value;
                        var label = seriesName + '<br/>' + area;
                        if (typeof(values) == "undefined") return;
                        if (values.length >= 3) {
                            var value = values[2];
                            label += " : " + (value / 10000).toFixed(2) + " 万元";
                        }
                        return label;
                    }
                },
                series: [
                    {
                        name: '交易金额分布',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: this.convertData(this.map_data),
                        symbolSize: function (val) {
                            var size = (parseInt(val[2]) / webSquid.pageModule("graph/screen1").map_total * 300).toFixed(0);
                            return size;
                        },
                        label: {
                            normal: {
                                formatter: function (parm) {
                                    return parm.name + "\n" + ((parm.value[2] / 10000).toFixed(1)) + "万";
                                },
                                position: 'inside',
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 11,
                                    fontWeight: 'normal'
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: '#f60',
                                shadowBlur: 30,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 99
                    }, {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke',
                            period: 2,
                            scale: 3
                        },
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        symbolSize: function (val) {
                            return (parseInt(val[2]) / webSquid.pageModule("graph/screen1").map_total * 250).toFixed(0);
                        },
                        showEffectOn: 'render',
                        itemStyle: {
                            normal: {
                                color: '#eee'
                            }
                        },
                        data: this.convertData(this.map_data)
                    }
                ]
            };
            webSquid.graph(mapCharts, option);
        },

        graph_bar: function (barCharts) {
            // 指定图表的配置项和数据
            var option = {
                grid: {
                    top: 5,
                    left: 55,
                    right: 40,
                    bottom: 50
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        return params[0].name + ": " + params[0].value + "件";
                    }
                },
                //color: this.bar_colors,
                yAxis: [{
                    data: this.bar_data_x,
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#FFF',
                        fontSize: '14'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: "0",
                        margin: 10,
                        rotate: 40
                    },
                    zlevel: 99
                }],
                xAxis: {
                    splitNumber: 2,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        },
                        interval: 0,
                        margin: 4,
                        formatter: function (params) {
                            return params + "件";
                        }
                    }
                },
                series: [
                    {
                        name: '进口量',
                        type: 'bar',
                        silent: false,
                        barGap: '55%',
                        label: {
                            normal: {
                                show: true,
                                position: 'right'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 6
                            }
                        },
                        data: this.bar_data
                    }
                ]
            };
            // barCharts.setOption(option);
            webSquid.graph(barCharts, option);
        },

        graph_bar2: function (barCharts2) {
            // 指定图表的配置项和数据
            var option = {
                color: this.bar2_colors,
                grid: {
                    top: 0,
                    left: 80,
                    right: 0,
                    bottom: 0
                },
                xAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    max: 100,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    }
                },
                yAxis: [{
                    inverse: true,
                    data: this.bar2_data_x,
                    axisLabel: {
                        textStyle: {
                            color: '#03a9f4'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    // 辅助 y 轴
                    show: false,
                    data: this.bar2_data_x
                }],
                series: [
                    {
                        type: 'bar',
                        silent: true,
                        yAxisIndex: 1,
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 4,
                                color: 'transparent',
                                borderColor: '#ddd'
                            }
                        },
                        zlevel: 0,
                        data: this.bar2_data.map(function (val) {
                            return 100;
                        })
                    },
                    {
                        name: '订单占比',
                        type: 'bar',
                        silent: true,
                        zlevel: 1,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 4,
                                color: '#71C2D8',
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                shadowBlur: 4
                            }
                        },
                        barWidth: 10,
                        data: this.bar2_data.map(function (val) {
                            return val;
                        })
                    }
                ]
            };
            // barCharts2.setOption(option);
            webSquid.graph(barCharts2, option);
        },

        graph_pie1: function (pieCharts1) {
            var m = webSquid.pageModule("graph/screen1");
            var option = {
                color: this.pie1_colors,
                tooltip: {
                    //formatter: "{b} : {c} ({d}%)"
                    //formatter: function (params) {
                    //    var value = params.value / 10000;
                    //    value = value.toFixed(2) + " 万元";
                    //    return params.name + ": " + value + " (" + params.percent + "%)";
                    //}
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '85%'],
                        hoverAnimation: true,
                        avoidLabelOverlap: false,
                        data: this.pie1_data,
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'center',
                        //         formatter: '{b}\n({d}%)',
                        //         textStyle: {}
                        //     }
                        // },
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                formatter: function (params) {
                                    var value = params.value / 10000;
                                    value = value.toFixed(2) + " 万元";
                                    return params.name + "\n" + value + " \n(" + params.percent + "%)";
                                },
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            };
            // pieCharts1.setOption(option);
            webSquid.graph(pieCharts1, option);
            this.animation(option, pieCharts1, m.app1);
        },

        graph_pie2: function (pieCharts2) {
            var option = {
                color: this.pie2_colors,
                tooltip: {
                    formatter: "{b} : {c} ({d}%)"
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '85%'],
                        hoverAnimation: true,
                        avoidLabelOverlap: false,
                        data: this.pie2_data,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: '{b}\n({d}%)'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        }
                    }
                ]
            };
            // pieCharts2.setOption(option);
            webSquid.graph(pieCharts2, option);
        },

        graph_pie3: function (pieCharts3) {
            var m = webSquid.pageModule("graph/screen1");
            var option = {
                tooltip: {
                    formatter: function (params) {
                        var value = params.value;
                        return params.name + "\n" + value + " 件 \n(" + params.percent + "%)";
                    }
                },
                color: this.pie3_colors,
                series: [
                    {
                        type: 'pie',
                        roseType: 'angle',
                        radius: ['45%', '79%'],
                        avoidLabelOverlap: false,
                        data: this.pie3_data,
                        hoverAnimation: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{d}%\n{b}'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length: 1,
                                length2: 2
                            }
                        }
                    }
                ]
            };
            // pieCharts3.setOption(option);
            webSquid.graph(pieCharts3, option);
            this.animation(option, pieCharts3, m.app3);
        },


        animation: function (option, pieCharts, app) {
            var animateFunction = function () {
                var dataLen = option.series[0].data.length;
                // 取消之前高亮的图形
                pieCharts.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: app.currentIndex
                });
                app.currentIndex = (app.currentIndex + 1) % dataLen;
                // 高亮当前图形
                pieCharts.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: app.currentIndex
                });
                // 显示 tooltip
                pieCharts.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: app.currentIndex
                });
            };

            animateFunction();
            app.timeTicket = setInterval(animateFunction, 1500);
        },

        graph_line: function (lineCharts) {
            var option = {
                grid: {
                    zlevel: 999,
                    left: 100,
                    bottom: 20
                },
                color: this.line_colors,
                legend: {
                    show: false,
                    bottom: '3%',
                    left: 'center',
                    data: ["进口"],
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b0}:<br/> {c0} 单'
                },
                xAxis: {
                    show: true,
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    nameTextStyle: {
                        color: '#fff'
                    },
                    data: (function () {
                        var arr = [];
                        var m = webSquid.pageModule("graph/screen1");
                        for (var idx in m.line_data1) {
                            arr.push(m.line_data1[idx].name);
                        }
                        return arr;
                    })()
                },
                yAxis: {
                    name: '',
                    min: '1',
                    offset: 5,
                    nameLocation: 'start',
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#fff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value} 单'
                    }
                },

                series: [{
                    name: '进口',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    type: 'line',
                    data: this.line_data1,
                    lineStyle: {
                        normal: {
                            width: 3,
                            type: 'solid',
                            opacity: 0.5
                        },
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10
                    }
                }]
            };
            webSquid.graph(lineCharts, option);
        }

    }
;
