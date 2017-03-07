/**
 * 作业区通关时效分析
 * Created by xcp on 2016/12/07.
 */


webSquid.page.modules["chart/e7"] = webSquid.page.modules["chart/e7"] || {


        //柱状图数据
        // bar_title: '全环节用时分布',
        bar_legend: ['电商申报用时', '企业申报用时', '海关通关用时', '国检通关用时', '装机出港用时'],
        bar_data_x: [],
        bar_legend_data: [{name: '时长'}],
        bar_data: [],


        //饼状图1数据
        pie1_title: '作业区用时占比',
        pie1_legend_data: [{name: '非作业区用时'}, {name: '作业区用时'}],
        pie1_data: [],

        //饼状图2数据
        pie2_title: '作业区通关量',
        pie2_legend_data: [{name: '1日通关量'}, {name: '2日通关量'}, {name: '3日通关量'}, {name: '其他'}],
        pie2_data: [{value: 3344, name: '1日通关量'}, {value: 4533, name: '2日通关量'}, {
            value: 2646,
            name: '3日通关量'
        }, {value: 455, name: '其他'}],

        //表一 TOP5数据
        table1_data: [
            {
                cycle: '1日',
                wa_time: '562',
                qysb_time: '82',
                hgtg_time: '98',
                gjtg_time: '77',
                cyfj_time: '153',
                shcq_time: '253',
                all_time: '665'
            }],
        //表二 TOP5数据
        table2_data: [
            {condition: '1日通关量', pass_count: '3344', remark: '入区至出区用时在24小时内'},
            {condition: '2日通关量', pass_count: '4533', remark: '入区至出区用时24-48小时'},
            {condition: '3日通关量', pass_count: '9853', remark: '入区至出区用时48-72小时'},
            {condition: '其他', pass_count: '465', remark: '入区至出区大于72小时'},
            {condition: '合计', pass_count: '17987', remark: ''}
        ],

        query: function () {
            var start = $("[name='date_start']").val();
            start = moment(start).format('YYYY-MM-1');
            var end = moment(start).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD');


            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c7_barpie_e",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e7");

                for (var idx in rsp.data) {
                    for (var key in rsp.data[idx]) {
                        if (key.indexOf("_time") > -1) {
                            if (rsp.data[idx][key] == null) {
                                rsp.data[idx][key + "_label"] = "-";
                            } else {
                                rsp.data[idx][key + "_label"] = webSquid.translateTimeCost(rsp.data[idx][key]);
                            }
                        }
                    }
                }

                var allTimeTotal = 0;
                var zoneTimeTotal = 0;

                m.bar_data_x = [];
                m.bar_data = [[], [], [], [], []];

                var obj = {};

                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    item.day_number = parseInt(item.day_number);

                    if (obj[item.day_number] == null)
                        obj[item.day_number] = [[], [], [], [], [], []];

                    obj[item.day_number][0].push(item.dssb_time);
                    obj[item.day_number][1].push(item.qysb_time);
                    obj[item.day_number][2].push(item.hgtg_time);
                    obj[item.day_number][3].push(item.gjtg_time);
                    obj[item.day_number][4].push(item.zjcg_time);
                    obj[item.day_number][5].push(item);

                    allTimeTotal += item.all_time;
                    zoneTimeTotal += item.hgtg_time;
                    zoneTimeTotal += item.gjtg_time;
                    zoneTimeTotal += item.zjcg_time;
                }

                var tableData = [];

                for (var idx = 1; idx <= 31; idx++) {
                    m.bar_data_x.push(idx + "日");

                    if (obj[idx] == null) {
                        for (var kdx = 0; kdx <= 4; kdx++) {
                            m.bar_data[kdx].push("-");
                        }
                        tableData.push({
                            day_number: idx,
                            zone_time_label: "-",
                            dssb_time_label: "-",
                            qysb_time_label: "-",
                            hgtg_time_label: "-",
                            gjtg_time_label: "-",
                            zjcg_time_label: "-",
                            all_time_label: "-"
                        });
                    } else {
                        for (var kdx = 0; kdx <= 4; kdx++) {
                            for (var jdx in obj[idx][kdx]) {
                                m.bar_data[kdx].push(obj[idx][kdx][jdx]);
                            }
                        }

                        tableData.push(obj[idx][5][0]);
                    }
                }

                webSquid.datatable("#query-c7-table1", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: tableData,
                    // order: [0, 'asc'],
                    columns: [
                        {
                            data: "day_number", label: "周期", render: function (data, type, row) {
                            return row.day_number + "日";
                        }
                        },
                        {data: "zone_time_label", label: "作业区平均用时"},
                        {data: "dssb_time_label", label: "电商申报用时"},
                        {data: "qysb_time_label", label: "企业申报用时"},
                        {data: "hgtg_time_label", label: "海关通关用时"},
                        {data: "gjtg_time_label", label: "国检通关用时"},
                        {data: "zjcg_time_label", label: "装机出港用时"},
                        {data: "all_time_label", label: "全环节用时"}
                    ]
                });

                // 柱状图
                var barCharts = echarts.init(document.getElementById('c7_bar'));
                m.graph_bar(barCharts);


                m.pie1_data = [{name: "非作业区用时", value: allTimeTotal}, {name: "作业区用时", value: zoneTimeTotal}];
                // 饼图1
                var pie1Charts = echarts.init(document.getElementById('c7_pie1'));
                m.graph_pie1(pie1Charts);


            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c7_tablepie_e",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e7");
                var item = rsp.data[0];
                m.table2_data = [
                    {condition: '1日通关量', pass_count: item.less24, remark: '入区至出区用时在24小时内'},
                    {condition: '2日通关量', pass_count: item.less48, remark: '入区至出区用时24-48小时'},
                    {condition: '3日通关量', pass_count: item.less72, remark: '入区至出区用时48-72小时'},
                    {condition: '其他', pass_count: item.great72p, remark: '入区至出区大于72小时'},
                    {condition: '合计', pass_count: (item.less24 + item.less48 + item.less72 + item.great72p), remark: ''}
                ];

                webSquid.datatable("#query-c7-table2", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/e7").table2_data,
                    // order: [0, 'asc'],
                    columns: [
                        {data: "condition", label: "统计"},
                        {data: "pass_count", label: "通关量"},
                        {data: "remark", label: "备注"}
                    ]
                });


                m.pie2_data = [
                    {value: item.less24, name: '1日通关量'},
                    {value: item.less48, name: '2日通关量'},
                    {
                        value: item.less72,
                        name: '3日通关量'
                    }, {value: item.great72p, name: '其他'}];

                // 饼图2 环形
                var pie2Charts = echarts.init(document.getElementById('c7_pie2'));
                m.graph_pie2(pie2Charts);
            });


        },

        /**
         * 初始化
         */
        init: function () {
            $("[name='date_start']").val(moment(new Date()).format("YYYY-MM"));
            $(".input-daterange").datepicker({
                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm",
                minViewMode:'months',
                autoclose:true
            });
           var title = webSquid.translateTitle(webSquid.sign);
            $("#text").text(title);
            $("#ws-page-back").click(webSquid.showPageQuery);
            $("[ws-search]").unbind("click").click(this.query).click();
        },


        graph_bar: function (barCharts) {
            // 指定图表的配置项和数据
            var option = {
                grid: {
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var result = "";
                        for (var idx in params) {
                            if (params[idx].value)
                                result += params[idx].seriesName + ": " + webSquid.translateTimeCost(params[idx].value) + "<br/>";
                        }
                        return result;
                    }
                },
                legend: {
                    data: this.bar_legend,
                    left: 'center',
                    itemWidth: 12,
                    itemHeight: 6,
                    top: '5%'
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
                    data: this.bar_data_x,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function (v) {
                            return v;
                        }
                    },
                    axisTick: {
                        show: false
                    }
                    // axisLabel: {
                    //     show: false
                    // }
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
                },
                series: [
                    {
                        name: '电商申报用时',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 10,
                        data: this.bar_data[0]
                    },
                    {
                        name: '企业申报用时',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 10,
                        data: this.bar_data[1]
                    },
                    {
                        name: '海关通关用时',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 10,
                        data: this.bar_data[2]
                    },
                    {
                        name: '国检通关用时',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 10,
                        data: this.bar_data[3]
                    },
                    {
                        name: '装机出港用时',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 10,
                        data: this.bar_data[4]
                    }

                ]
            };
            webSquid.graph(barCharts, option);
        },
        graph_pie1: function (pie1Charts) {
            var option = {
                title: {
                    text: this.pie1_title
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    formatter: function (params) {
                        return params.name + ":" + params.percent + " %";
                    }
                },
                legend: {
                    right: '1%',
                    data: this.pie1_legend_data,
                    orient: 'vertical'

                },
                series: [
                    {
                        name: '时长',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: this.pie1_data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: '{d}%',
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                            }
                        }
                    }
                ]
            };
            webSquid.graph(pie1Charts, option);
        },

        graph_pie2: function (pie2Charts) {
            var option = {
                title: {
                    text: this.pie2_title
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}单 ({d}%)"
                },
                legend: {
                    right: '1%',
                    data: this.pie2_legend_data,
                    orient: 'vertical'

                },
                series: [
                    {
                        name: '通关量',
                        type: 'pie',
                        radius: ['30%', '75%'],
                        center: ['50%', '50%'],
                        data: this.pie2_data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: '{d}%',
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                            }
                        }
                    }
                ]
            };
            webSquid.graph(pie2Charts, option);
        }

    };
