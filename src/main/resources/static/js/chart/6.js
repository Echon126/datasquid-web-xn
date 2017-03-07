/**
 * 企业通关时效分析
 * Created by xcp on 2016/12/07.
 */


webSquid.page.modules["chart/6"] = webSquid.page.modules["chart/6"] || {


        //柱状图1数据
        bar1_title: '企业全环节平均用时排名 TOP5',
        bar1_data_x: [],
        bar1_legend_data: [{name: '全环节平均用时'}],
        bar1_data: [],

        //柱状图2数据
        bar2_title: '企业全环节平均用时排名 LAST5',
        bar2_data_x: [],
        bar2_legend_data: [{name: '全环节平均用时'}],
        bar2_data: [],

        //表一 TOP5数据
        table1_data: [],
        //表二 TOP5数据
        table2_data: [],
        //表三 TOP5数据
        table3_data: [],

        query: function () {
            var companyName = $("[name='company']").val();
            var m = webSquid.pageModule("chart/6");

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c6_query",
                sign: webSquid.sign,
                ie: webSquid.ie,
                param: [companyName].join(";")
            }, function (rsp) {
                var m = webSquid.pageModule("chart/6");

                m.table3_data = rsp.data;

                webSquid.datatable("#query-c6-table3", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/6").table3_data,
                    // order: [0, 'asc'],
                    columns: [
                        {
                            label: "周期", render: function (data, type, row) {
                            return row.company.split("-")[0];
                        }
                        },
                        {
                            data: "company", label: "企业名称", render: function (data, type, row) {
                            return row.company.split("-")[1];
                        }
                        },
                        {
                            label: "全环节平均用时", render: function (data, type, row) {
                            return webSquid.translateTimeCost(row["all_time_avg"]);
                        }
                        },
                        {data: "total", label: "订单量"}
                    ]
                });


            });

        },

        graph: function () {
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c6_bartable1",
                sign: webSquid.sign,
                ie: webSquid.ie
            }, function (rsp) {
                var m = webSquid.pageModule("chart/6");
                m.table1_data = rsp.data;

                webSquid.datatable("#query-c6-table1", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/6").table1_data,
                    columns: [
                        {
                            label: "周期", render: function (data, type, row) {
                            return row.company.split("-")[1];
                        }
                        },
                        {
                            data: "company", label: "企业名称", render: function (data, type, row) {
                            return row.company.split("-")[0];
                        }
                        },
                        {
                            label: "全环节平均用时", render: function (data, type, row) {
                            return webSquid.translateTimeCost(row["all_time_avg"]);
                        }
                        },
                        {data: "total", label: "订单量"}
                    ]
                });


                m.bar1_data_x = [];
                m.bar1_data = [];
                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    var name = item.company.split("-")[0];
                    if (name.length > 5)
                        name = name.substring(0, 5);
                    m.bar1_data_x.push(name);
                    m.bar1_data.push(item.all_time_avg);
                }

                // 柱状图1
                var bar1Charts = echarts.init(document.getElementById('c6_bar1'));
                m.graph_bar1(bar1Charts);

            });

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c6_bartable2",
                sign: webSquid.sign,
                ie: webSquid.ie
            }, function (rsp) {
                var m = webSquid.pageModule("chart/6");
                m.table2_data = rsp.data;

                webSquid.datatable("#query-c6-table2", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/6").table2_data,
                    columns: [
                        {
                            label: "周期", render: function (data, type, row) {
                            return row.company.split("-")[1];
                        }
                        },
                        {
                            data: "company", label: "企业名称", render: function (data, type, row) {
                            return row.company.split("-")[0];
                        }
                        },
                        {
                            label: "全环节平均用时", render: function (data, type, row) {
                            return webSquid.translateTimeCost(row["all_time_avg"]);
                        }
                        },
                        {data: "total", label: "订单量"}
                    ]
                });


                m.bar2_data_x = [];
                m.bar2_data = [];
                for (var i in rsp.data) {
                    var item = rsp.data[i];
                    var name = item.company.split("-")[0];
                    if (name.length > 5)
                        name = name.substring(0, 5);
                    m.bar2_data_x.push(name);
                    m.bar2_data.push(item.all_time_avg);
                }

                // 柱状图2
                var bar2Charts = echarts.init(document.getElementById('c6_bar2'));
                m.graph_bar2(bar2Charts);

            });
        },

        /**
         * 初始化
         */
        init: function () {
            var title = webSquid.translateTitle(webSquid.sign);
            $("#text").text(title);
            this.graph();
            $("[ws-search]").unbind("click").click(this.query);
        },


        graph_bar1: function (bar1Charts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.bar1_title
                },
                grid: {
                    left: '100'
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
                tooltip: {
                    formatter: function (params) {
                        return params.seriesName + ": " + webSquid.translateTimeCost(params.value);
                    }
                },
                xAxis: {
                    data: this.bar1_data_x,
                    type: 'category',
                    axisLabel: {
                        interval: "0"
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    type: 'value',
                    splitNumber: 2,
                    axisLabel: {
                        show: true,
                        formatter: webSquid.formatSplitCost
                    }
                },
                series: [
                    {
                        name: '全环节平均用时',
                        type: 'bar',
                        barWidth: 15,
                        data: this.bar1_data,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: function (params) {
                                    return webSquid.translateTimeCost(params.value);
                                }
                            }
                        }
                    }
                ]
            };
            webSquid.graph(bar1Charts, option);
        },

        graph_bar2: function (bar2Charts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.bar2_title
                },
                grid: {
                    left: '100'
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
                    data: this.bar2_data_x,
                    type: 'category',
                    axisLabel: {
                        interval: "0"
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    type: 'value',
                    splitNumber: 2,
                    axisLabel: {
                        show: true,
                        formatter: webSquid.formatSplitCost
                    }
                },
                series: [
                    {
                        name: '全环节平均用时',
                        type: 'bar',
                        barWidth: 15,
                        data: this.bar2_data,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: function (params) {
                                    return webSquid.translateTimeCost(params.value);
                                }
                            }
                        }
                    }
                ]
            };
            webSquid.graph(bar2Charts, option);
        }

    };
