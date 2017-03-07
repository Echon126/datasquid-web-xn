/**
 * 海关通关环节时效
 * Created by xcp on 2016/12/07.
 */


webSquid.page.modules["chart/e4"] = webSquid.page.modules["chart/e4"] || {

        //折线图数据
        line_title: '海关放行用时',
        line_data_x: [],
        line_data: [],
        line_markLine_data: [{yAxis: 60}, {yAxis: 60 * 24}],
        line_pieces: [{gt: 24 * 60 * 3, lte: 24 * 60 * 5, color: '#F19545'}, {
            gt: 24 * 60,
            lte: 24 * 60 * 3,
            color: '#3E9EDA'
        },
            {gt: 0, lte: 24 * 60, color: '#59B052'}],


        //柱状图折线层积数据
        barLine_title: '海关通关时长',
        barLine_data_x: [],
        barLine_legend_data: [{name: '通关时长'}, {name: '查验放行时长'}],
        barLine_data1: [],
        barLine_data2: [],


        //饼状图数据
        pie_title: '放行查验占比',
        pie_legend_data: [{name: '查验量'}, {name: '放行量'}],
        pie_data: [{value: 7000, name: '放行量'}, {value: 516, name: '查验量'}],

        table_data: [
            {cycle: '1日', custom_time: '6675', check_time: '74', custom_count: '6075', check_count: '74'},
            {cycle: '2日', custom_time: '7053', check_time: '71', custom_count: '7050', check_count: '74'},
            {cycle: '3日', custom_time: '7153', check_time: '72', custom_count: '7051', check_count: '74'},
            {cycle: '4日', custom_time: '7253', check_time: '73', custom_count: '7052', check_count: '74'},
            {cycle: '5日', custom_time: '7353', check_time: '70', custom_count: '7053', check_count: '74'},
            {cycle: '6日', custom_time: '7453', check_time: '75', custom_count: '7054', check_count: '74'},
            {cycle: '7日', custom_time: '7553', check_time: '76', custom_count: '7055', check_count: '74'},
            {cycle: '8日', custom_time: '7653', check_time: '77', custom_count: '7056', check_count: '74'},
            {cycle: '9日', custom_time: '7753', check_time: '78', custom_count: '7057', check_count: '74'},
            {cycle: '10日', custom_time: '7813', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '11日', custom_time: '7823', check_time: '70', custom_count: '7058', check_count: '74'},
            {cycle: '12日', custom_time: '7833', check_time: '71', custom_count: '7058', check_count: '74'},
            {cycle: '13日', custom_time: '7843', check_time: '72', custom_count: '7058', check_count: '74'},
            {cycle: '14日', custom_time: '7853', check_time: '73', custom_count: '7058', check_count: '74'},
            {cycle: '15日', custom_time: '7863', check_time: '74', custom_count: '7058', check_count: '74'},
            {cycle: '16日', custom_time: '7873', check_time: '75', custom_count: '7058', check_count: '74'},
            {cycle: '17日', custom_time: '7153', check_time: '76', custom_count: '7058', check_count: '74'},
            {cycle: '18日', custom_time: '7253', check_time: '77', custom_count: '7058', check_count: '74'},
            {cycle: '19日', custom_time: '7353', check_time: '78', custom_count: '7058', check_count: '74'},
            {cycle: '20日', custom_time: '7453', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '21日', custom_time: '7553', check_time: '69', custom_count: '7058', check_count: '74'},
            {cycle: '22日', custom_time: '7653', check_time: '68', custom_count: '7058', check_count: '74'},
            {cycle: '23日', custom_time: '7753', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '24日', custom_time: '7853', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '25日', custom_time: '7953', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '26日', custom_time: '7053', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '27日', custom_time: '6850', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '28日', custom_time: '6851', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '29日', custom_time: '6852', check_time: '79', custom_count: '7058', check_count: '74'},
            {cycle: '30日', custom_time: '6853', check_time: '79', custom_count: '7058', check_count: '74'},
        ],

        getDays: function () {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            if (m == 2) {
                return y % 4 == 0 ? 29 : 28;
            } else if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
                return 31;
            } else {
                return 30;
            }
        },

        query: function () {
            var url = $("[ws-search]").attr("ws-search");
            var data = webSquid.serialize(".ws-query form");
            if (data.length > 0)
                url += "?" + data;

            webSquid.datatable("#query-c4-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/e4").table_data,
                // order: [0, 'asc'],
                columns: [
                    {data: "cycle", label: "周期"},
                    {data: "custom_time", label: "通关时长"},
                    {data: "check_time", label: "查验放行时长"},
                    {data: "custom_count", label: "通关量"},
                    {data: "check_count", label: "查验量"}
                ]
            });
        },

        graph: function () {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();


            // 折线图
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c4_line_e",
                sign: webSquid.sign,
                ie: webSquid.ie,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e4");
                m.line_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                    m.line_data.push(time);
                }

                var lineCharts = echarts.init(document.getElementById('c4_line'));
                m.graph_line(lineCharts);
            });

            // 折线层积图
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c4_barline_e",
                sign: webSquid.sign,
                ie: webSquid.ie,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e4");

                m.barLine_data1 = [];
                m.barLine_data2 = [];
                m.barLine_data_x = [];
                var query_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var time = item.time == null ? 0 : (item.time / 60).toFixed(2);
                    var value = query_data[item.day];
                    if (!value) {
                        value = [0, 0];
                    }

                    if (item.type == 'TG') {
                        value[0] = time;
                    } else {
                        value[1] = time;
                    }
                    query_data[item.day] = value;
                }

                for (var i = 0; i < m.getDays(); i++) {
                    var qdata = query_data[i + 1];
                    m.barLine_data_x.push((i + 1) + "/日");
                    if (typeof(qdata) == "undefined") {
                        m.barLine_data1.push(0);
                        m.barLine_data2.push(0);
                    } else {
                        m.barLine_data1.push(qdata[0]);
                        m.barLine_data2.push(qdata[1]);
                    }
                }
                // 折线层积图
                var barLineCharts = echarts.init(document.getElementById('c4_bar_line'));
                m.graph_barLine(barLineCharts);
            });

            // 饼图
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c4_pie_e",
                sign: webSquid.sign,
                ie: webSquid.ie,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e4");
                m.pie_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    m.pie_data = [
                        {value: item.hgfx, name: '放行量'}, {value: item.hgcy, name: '查验量'}
                    ];
                }
                // 饼图
                var pieCharts = echarts.init(document.getElementById('c4_pie'));
                m.graph_pie(pieCharts);
            });

        },


        /**
         * 初始化
         */
        init: function () {
            $("[name='date_start']").val(moment(new Date()).subtract(3, 'M').startOf('month').format("YYYY-MM-DD"));
            $("[name='date_end']").val(moment(new Date()).endOf('month').format("YYYY-MM-DD"));
            $(".input-daterange").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });
            var title = webSquid.translateTitle(webSquid.sign);
            $("#text").text(title);
            this.graph();
            $("[ws-search]").unbind("click").click(this.graph);

        },


        graph_line: function (lineCharts) {
            var option = {
                title: {
                    text: this.line_title,
                    left: 'center'
                },
                grid: {
                    left: '15%'
                },
                tooltip: {
                    trigger: 'axis',
                    //formatter: "{a} <br/>{b} : {c} (分钟)"
                    formatter: function (params) {
                        for (var idx in params) {
                            return params[idx].seriesName + ": " + webSquid.translateTimeCost(params[idx].value);
                        }
                    }
                },
                xAxis: {
                    data: this.line_data_x,
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis: {
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: webSquid.formatSplitCost
                    },
                    splitNumber: 2
                },
                toolbox: {
                    left: 'left',
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                visualMap: {
                    top: 1,
                    right: 1,
                    pieces: this.line_pieces,
                    outOfRange: {
                        color: '#999'
                    },
                    formatter: function (val, val2) {
                        return webSquid.translateTimeCost(val) + "至" + webSquid.translateTimeCost(val2);
                    }
                },
                series: {
                    name: '海关通关用时',
                    type: 'line',
                    data: this.line_data,
                    areaStyle: {normal: {}}
                    //markLine: {
                    //    silent: true,
                    //    data: this.line_markLine_data
                    //}
                }
            };
            webSquid.graph(lineCharts, option);
        },

        graph_barLine: function (barLineCharts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.barLine_title
                },
                grid: {
                    left: '10%'
                },
                tooltip: {
                    trigger: 'item',
                    //formatter: "{a} <br/>{b} : {c} (分钟)"
                    formatter: function (params) {
                        if (typeof(value) == "undefined") {
                            return params.seriesName + ": " + webSquid.translateTimeCost(params.value);
                        }
                        return "";
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                legend: {//图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
                    data: this.barLine_legend_data,
                    bottom: '1%',
                    left: '40%'
                },
                xAxis: {
                    data: this.barLine_data_x,
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        formatter: function (v) {
                            var _txt = v.replace(/\//igm, '\n');
                            return _txt;
                        }
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: function (val) {
                            return webSquid.translateTimeCost(val);
                        }
                    }
                },
                series: [
                    {
                        name: '通关时长',
                        type: 'line',
                        areaStyle: {normal: {}},
                        data: this.barLine_data1
                    },
                    {
                        name: '查验放行时长',
                        type: 'bar',
                        barWidth: 8,
                        areaStyle: {normal: {}},
                        data: this.barLine_data2
                    }
                ]
            };
            webSquid.graph(barLineCharts, option);
        },

        graph_pie: function (pieCharts) {
            var option = {
                title: {
                    text: this.pie_title
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    right: '1%',
                    orient: "vertical",
                    data: this.pie_legend_data
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.pie_data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            webSquid.graph(pieCharts, option);
        }


    };
