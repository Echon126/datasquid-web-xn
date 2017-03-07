/**
 * 直邮进口效能分析
 * Created by xcp on 2016/11/23.
 */


webSquid.page.modules["chart/e1"] = webSquid.page.modules["chart/e1"] || {
        //柱状图1数据
        bar1_title: '全环节用时分布',
        bar1_legend: ['电商申报用时', '企业申报用时', '海关通关用时', '国检通关用时', '装机出港用时'],
        bar1_data_x: ['电商申报用时', '企业申报用时', '海关通关用时', '国检通关用时', '装机出港用时'],
        bar1_legend_data: [{name: '时长'}],
        bar_data_0: [],
        bar_data_1: [],
        bar_data_2: [],
        bar_data_3: [],
        bar_data_4: [],
        bar_data_5: [],
        bar_data_6: [],
        table1_data: [],

        table2_data: [
            {pname: '全流程时间', start: '2016-09-16 16:04', end: '2016-09-18 23:00', totalTime: '4344'},
            {pname: '电商申报用时', start: '2016-09-16 16:04', end: '2016-09-18 17:00', totalTime: '583'},
            {pname: '企业申报用时', start: '2016-09-16 17:00', end: '2016-09-18 18:00', totalTime: '569'},
            {pname: '海关通关用时', start: '2016-09-16 18:00', end: '2016-09-18 19:04', totalTime: '685'},
            {pname: '国检通关用时', start: '2016-09-16 19:04', end: '2016-09-18 20:04', totalTime: '436'},
            {pname: '装机出港用时', start: '2016-09-16 20:04', end: '2016-09-18 21:04', totalTime: '756'}
        ],

        //柱状图2数据
        bar2_title: '海关通关趋势',
        bar2_data_x: ['全流程时间', '电商申报用时', '企业申报用时', '海关通关用时', '国检通关用时', '装机出港用时'],
        bar2_colors: ['#4A87CB', '#E66827'],
        bar2_legend_data: [{name: '时长'}],
        bar2_data1: [0, 583, 1152, 1837, 2273, 3029, 3683, 4115],
        bar2_data2: [583, 569, 685, 436, 756, 654, 432, 582],


        query: function () {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();
            var orderNo = $("[name='orderNo']").val();


            var ie = webSquid.ie;
            var sign = webSquid.sign;

            var url = webSquid.serializeObjectToURL("api/data/s/HJ", {
                sid: "c1_table_e",
                ie: ie,
                sign: sign,
                start: start,
                end: end,
                param: [orderNo].join(";")
            });

            var parseCost = function (val) {
                if (val == null) return "-";
                val = parseInt(val);
                if (isNaN(val)) return "-";
                if (val == 0) return "-";
                val = Math.abs(val) / 60;
                return val.toFixed(2);
            };

            // 柱状图1(全环节用时分布)
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c1_bar1_e",
                sign: sign,
                ie: ie,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e1");
                m.bar1_data_x = [];
                m.bar_data_0 = [];
                m.bar_data_1 = [];
                m.bar_data_2 = [];
                m.bar_data_3 = [];
                m.bar_data_4 = [];
                m.bar_data_5 = [];
                m.bar_data_6 = [];

                var parseCost = function (val) {
                    val = parseInt(val);
                    val = isNaN(val) ? 0 : val;
                    val = Math.abs(val) / 60;
                    return (val.toFixed(2));
                };

                m.table1_data = rsp.data;

                for (var idx in rsp.data) {
                    var item = rsp.data[idx];
                    m.bar1_data_x.push(item.orderno);

                    m.bar_data_0.push(parseCost(item.dssb_time));
                    m.bar_data_1.push(parseCost(item.qysb_time));
                    m.bar_data_2.push(parseCost(item.hgtg_time));
                    m.bar_data_3.push(parseCost(item.gjtg_time));
                    m.bar_data_4.push(parseCost(item.zjcg_time));
                }
                // 柱状图
                var barCharts1 = echarts.init($('#c1_bar1')[0]);
                m.graph_bar1(barCharts1);

            });

            var parseCostZero = function (val) {
                var ret = parseCost(val);
                ret = parseFloat(ret);
                ret = isNaN(ret) ? 0 : ret;
                return ret;
            };
            // 数据表
            webSquid.datatable("#query-c1-table", {
                ajax: url,
                columns: [
                    {data: "orderno", label: "订单号"},
                    {
                        label: "全流程时间", render: function (data, type, row) {
                        var item = row["all_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "电商申报", render: function (data, type, row) {
                        var item = row["dssb_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "企业申报", render: function (data, type, row) {
                        var item = row["qysb_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "海关通关", render: function (data, type, row) {
                        var item = row["hgtg_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "国检通关", render: function (data, type, row) {
                        var item = row["gjtg_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "装机出港", render: function (data, type, row) {
                        var item = row["zjcg_time"];
                        return webSquid.translateTimeCost(parseCost(item));
                    }
                    },
                    {
                        label: "并行用时", render: function (data, type, row) {
                        var all_time = parseCostZero(row["all_time"]);
                        var dssb_time = parseCostZero(row["dssb_time"]);
                        var qysb_time = parseCostZero(row["qysb_time"]);
                        var hgtg_time = parseCostZero(row["hgtg_time"]);
                        var gjtg_time = parseCostZero(row["gjtg_time"]);
                        var zjcg_time = parseCostZero(row["zjcg_time"]);

                        var time = dssb_time + qysb_time + hgtg_time + gjtg_time + zjcg_time - all_time;
                        return isNaN(time) ? "-" : webSquid.translateTimeCost(time.toFixed(2));
                    }
                    },
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            return "<button class='btn btn-primary btn-xs' title='查看详情' onclick=\"webSquid.page.modules['chart/e1'].detail('" + row.orderno + "');\"><i class='fa fa-search-plus'></i> </button> ";
                        }
                    }
                ]
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

            $("#ws-page-back").click(this.back);
            $("[ws-search]").unbind("click").click(this.query);

            this.query();
        },
        back: function () {
            // webSquid.page.modules.task.query();
            webSquid.showPageQuery();
        },
        detail: function (orderNo) {
            webSquid.showWorkspace();
            $("#ws-work-title").text("订单号：" + orderNo);

            //给table2_data赋值
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c1_bar2_e",
                sign: webSquid.sign,
                ie: webSquid.ie,
                param: [orderNo].join(";")
            }, function (rsp) {
                var item = rsp.data[0];
                var m = webSquid.pageModule("chart/e1");

                var parseDateTime = function (val) {
                    if (val == null) return "-";
                    val = parseInt(val);
                    if (isNaN(val)) return "-";
                    if (val == 0) return "-";
                    return moment(val).format("YYYY-MM-DD HH:mm:ss");
                };

                var parseCost = function (val) {
                    if (val == null) return "-";
                    val = parseInt(val);
                    if (isNaN(val)) return "-";
                    if (val == 0) return "-";
                    val = Math.abs(val) / 60;
                    return val.toFixed(2);
                };

                // 全流程时间
                m.table2_data[0].start = parseDateTime(item["all_time_start"]);
                m.table2_data[0].end = parseDateTime(item["all_time_end"]);
                m.table2_data[0].totalTime = parseCost(item["all_time"]);

                // 电商申报用时
                m.table2_data[1].start = parseDateTime(item["xdzf_min"]);
                m.table2_data[1].end = parseDateTime(item["qysb_max"]);
                m.table2_data[1].totalTime = parseCost(item["dssb_time"]);

                // 企业申报用时
                m.table2_data[2].start = parseDateTime(item["qysb_min"]);
                m.table2_data[2].end = parseDateTime(item["hgsb_max"]);
                m.table2_data[2].totalTime = parseCost(item["qysb_time"]);

                // 海关放行用时
                m.table2_data[3].start = parseDateTime(item["hgsb_min"]);
                m.table2_data[3].end = parseDateTime(item["hgfx_max"]);
                m.table2_data[3].totalTime = parseCost(item["hgtg_time"]);

                // 国检放行用时
                m.table2_data[4].start = parseDateTime(item["gjsb_min"]);
                m.table2_data[4].end = parseDateTime(item["gjfx_max"]);
                m.table2_data[4].totalTime = parseCost(item["gjtg_time"]);

                // 装机出港用时
                m.table2_data[5].start = parseDateTime(item["cyfj_start"]);
                m.table2_data[5].end = parseDateTime(item["qdhx_max"]);
                m.table2_data[5].totalTime = parseCost(item["zjcg_time"]);

                m.bar2_data1 = [0];
                var i, cost;
                for (i = 1; i < m.table2_data.length; i++) {
                    var baseTime = moment(m.table2_data[0].start).toDate().getTime();
                    var curTime = moment(m.table2_data[i].start).toDate().getTime();
                    cost = Math.abs(curTime - baseTime);
                    cost = cost / 1000 / 60;

                    var result = parseFloat(cost);

                    m.bar2_data1.push(result);
                }

                m.bar2_data2 = [];
                for (i = 0; i < m.table2_data.length; i++) {
                    cost = m.table2_data[i].totalTime;
                    cost = cost == "-" ? 0 : cost;
                    m.bar2_data2.push(cost);
                }

                webSquid.datatable("#query-c1-wstable", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/e1").table2_data,
                    columns: [
                        {data: "pname", label: "流程名称"},
                        {data: "start", label: "起始"},
                        {data: "end", label: "结束"},
                        {
                            label: "时长", render: function (data, type, row) {
                            return webSquid.translateTimeCost(row.totalTime);
                        }
                        }
                    ]
                });

                // 柱状图2
                var barCharts2 = echarts.init(document.getElementById('c1_bar2'));
                m.graph_bar2(barCharts2);

            });

        },

        graph_bar1: function (barCharts1) {
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (c) {
                        console.log(c);
                        var label = '';
                        for (var i in c) {
                            var item = c[i];
                            if (item.value == 0)
                                continue;
                            label += item.seriesName + ' 环节耗时：' + webSquid.translateTimeCost(item.value) + '<br />';
                        }
                        return label;
                    }
                },
                grid: {
                    containLabel: true
                },
                title: {
                    text: this.bar1_title
                },
                legend: {
                    data: this.bar1_legend,
                    bottom: '0.01%',
                    left: '10%'
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    data: this.bar1_data_x,
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
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: webSquid.formatSplitCost
                    },
                    splitNumber: 2
                    //interval: 60 * 24
                },
                series: [
                    {
                        name: '电商申报用时',
                        type: 'bar',
                        stack: 'A',
                        data: this.bar_data_0
                    },
                    {
                        name: '企业申报用时',
                        type: 'bar',
                        stack: 'A',
                        data: this.bar_data_1
                    },
                    {
                        name: '海关通关用时',
                        type: 'bar',
                        stack: 'A',
                        data: this.bar_data_2
                    },
                    {
                        name: '国检通关用时',
                        type: 'bar',
                        stack: 'A',
                        data: this.bar_data_3
                    },
                    {
                        name: '装机出港用时',
                        type: 'bar',
                        stack: 'A',
                        data: this.bar_data_4
                    }
                ]
            };
            webSquid.graph(barCharts1, option);
        },

        graph_bar2: function (barCharts2) {
            //指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (c) {
                        var current = parseFloat(c[1].value);
                        return c[0].name + ' 环节耗时：' + webSquid.translateTimeCost(current);
                    }
                },
                grid: {
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'value',
                    position: 'top'
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: this.bar2_data_x,
                    nameTextStyle: {
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '15'
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            width: 2
                        }
                    },
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                series: [
                    {
                        name: '前置用时',
                        type: 'bar',
                        stack: 'A',
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(224,237,250,50)',
                                color: '#fff'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(224,237,250,50)',
                                color: '#fff'
                            }
                        },
                        data: this.bar2_data1
                    },
                    {
                        name: '时长',
                        type: 'bar',
                        stack: 'A',
                        label: {
                            normal: {
                                show: true,
                                formatter: '　　　　　{c} 分',
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    // build a color map as your need.
                                    var colorList = ['#3D94BA', '#3E9EDA', '#7DC589', '#FFC000', '#386BBE', '#F19545', '#A28BC2', '#A3CFED', '#52A64C', '#E45A0E', '#3D94BA', '#8064A2'];
                                    return colorList[params.dataIndex]
                                },
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.8)',
                                borderWidth: 0
                            }
                        },
                        data: this.bar2_data2
                    }
                ]
            };
            webSquid.graph(barCharts2, option);
        }

    };
