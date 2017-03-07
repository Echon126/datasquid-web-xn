/**
 * 贸易国别统计
 * Created by xcp on 2016/12/08.
 */


webSquid.page.modules["chart/e18"] = webSquid.page.modules["chart/e18"] || {

        //饼状图数据
        pie_title: '贸易额',
        pie_colors: ['#4A85C9', '#E16726', '#929292', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4', '#647828'],
        pie_legend_data: ['美国', '英国', '韩国', '日本', '澳大利亚', '新西兰', '荷兰', '德国', '法国', '俄罗斯', '南非', '其它'],
        pie_data: [{value: 10245, name: '美国'}, {value: 12564, name: '英国'}, {value: 16458, name: '韩国'}
            , {value: 18659, name: '日本'}, {value: 15689, name: '澳大利亚'}, {value: 13549, name: '新西兰'}
            , {value: 12349, name: '荷兰'}, {value: 13489, name: '德国'}, {value: 12349, name: '法国'}
            , {value: 10009, name: '俄罗斯'}, {value: 10852, name: '南非'}, {value: 19852, name: '其它'}
        ],

        // 存放原始未翻译的国别代码
        legend: [],

        //柱状折线图数据
        barLine_title: '主要贸易国家',
        barLine_data_x: ['美/国', '英/国', '韩/国', '日/本', '澳/大/利/亚', '新/西/兰', '荷/兰', '德/国', '法/国', '俄/罗/斯', '南/非', '其/他'],
        barLine_colors: ['#6295D1', '#E66827'],
        barLine_legend_data: [{name: '贸易额'}, {name: '订单量'}],
        barLine_data1: [60000, 75000, 55000, 65000, 70000, 69999, 70000, 86000, 66500, 78000, 79200, 189036],
        barLine_data2: [6000, 7500, 5500, 6500, 7000, 6999, 7000, 8600, 6650, 7800, 7920, 18906],


        //表格数据
        table_column: [
            {data: "cycle", label: " "},
            {data: "type", label: "统计项"},
            {data: "c1", label: "荷兰"},
            {data: "c2", label: "西班牙"},
            {data: "c3", label: "韩国"},
            {data: "c4", label: "英国"},
            {data: "c5", label: "其它"},
            {data: "total", label: "总额"}
        ],
        //表一 异常数据监测列表
        table_data: [
            {
                cycle: '1月',
                type: '贸易额',
                c1: '65160',
                c2: '67955',
                c3: '70800',
                c4: '73665',
                c5: '76500',
                total: '942485'
            },
            {
                cycle: '1月',
                type: '订单量',
                c1: '6675',
                c2: '7063',
                c3: '5478',
                c4: '4344',
                c5: '4911',
                total: '65818'
            },
            {
                cycle: '1月',
                type: '贸易额占比',
                c1: '6.91%',
                c2: '7.21%',
                c3: '7.52%',
                c4: '7.12%',
                c5: '7.58%',
                total: ''
            },
            {
                cycle: '2月',
                type: '贸易额',
                c1: '60160',
                c2: '87955',
                c3: '78800',
                c4: '72665',
                c5: '78500',
                total: '992485'
            },
            {
                cycle: '2月',
                type: '订单量',
                c1: '6775',
                c2: '7263',
                c3: '5578',
                c4: '4844',
                c5: '4811',
                total: '75828'
            },
            {
                cycle: '2月',
                type: '贸易额占比',
                c1: '7.91%',
                c2: '7.21%',
                c3: '7.52%',
                c4: '7.12%',
                c5: '7.58%',
                total: ''
            }
        ],

        query: function (appendTableHead) {
            webSquid.datatable("#query-ce18-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/e18").table_data,
                columns: webSquid.pageModule("chart/e18").table_column
            });
            $("#query-ce18-table thead").prepend(appendTableHead);
        },

        graph: function () {
            var year = $("[name='date_start']").val();
            var start;
            var end;
            if (year.length > 0) {
                start = year + "-01-01";
                end = year + "-12-31";
            }

            var sid = "";
            // var tid1 = "";
            // var tid2 = "";
            if (webSquid.ie == "E") {
                sid = "c18_barlinepie_e";
                // tid1 = "c18_tabledata_e";
                // tid2 = "c18_tablesum_e";
            } else {
                sid = "c18_barlinepie_i";
                // tid1 = "c18_tabledata_i";
                // tid2 = "c18_tablesum_i";
            }

            webSquid.ajax("data/s/HJ", "GET", {
                sid: sid,
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e18");
                m.barLine_data1 = [];
                m.barLine_data2 = [];
                m.pie_legend_data = [];
                m.barLine_data_x = [];
                m.pie_data = [];
                m.legend = [];
                m.table_data = [];
                m.table_column = [];

                var showTotalPrice = 0;
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var pdata = {};
                    m.legend.push(item.country);
                    var countryName;
                    if (webSquid.ie == "E") {
                        countryName = webSquid.getCountryName(item.country);
                    } else if (webSquid.ie == "I") {
                        countryName = webSquid.getCountryNameHG(item.country);
                    }

                    if (countryName == null) {
                        countryName = "其它";
                    } else {
                        countryName = webSquid.translateCountry(countryName);
                    }
                    if (countryName == null) {
                        countryName = "其它";
                    }

                    m.pie_legend_data.push(countryName);
                    m.barLine_data_x.push(countryName);

                    pdata["name"] = countryName;
                    var price = (item.total_price / 10000).toFixed(2);
                    pdata["value"] = price
                    showTotalPrice += parseFloat(item.total_price);
                    m.barLine_data1.push(price);
                    m.barLine_data2.push(item.order_count);
                    m.pie_data.push(pdata);
                }


                // 柱状折线图
                var barLineCharts = echarts.init(document.getElementById('c18_barLine'));
                m.graph_barLine(barLineCharts);
                webSquid.ajax("data/s/HJ", "GET", {
                    sid: "c18_totalprice_e",
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    start: start,
                    end: end
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/e18");
                    var sumTotal = 0;
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];
                        sumTotal += parseFloat(item.total_price);
                    }
                    m.pie_legend_data.push("其它");
                    m.pie_data.push({value: ((sumTotal - showTotalPrice) / 10000).toFixed(2), name: '其它'});
                    // 饼状图 环形
                    var pieCharts = echarts.init(document.getElementById('c18_pie'));
                    m.graph_pie(pieCharts);
                });


                if (m.legend == null || m.legend.length == 0) {
                    $("#query-ce18-table").html("");
                    return;
                }

                var country_length = m.legend.length;

                var col1 = {};
                col1["data"] = "cycle";
                col1["label"] = " ";
                m.table_column.push(col1);
                //补充表头
                var appendTableHead = "";
                appendTableHead += "<tr style='background-color: #afd7ed;border-bottom: none'><th style='border-bottom-width: 1px'></th>";
                for (var i = 0; i < country_length; i++) {
                    // 动态添加表格表头 国家信息
                    var col3_0 = {};
                    col3_0["data"] = "a" + i + "0";
                    col3_0["label"] = "贸易额";
                    m.table_column.push(col3_0);
                    var col3_1 = {};
                    col3_1["data"] = "a" + i + "1";
                    col3_1["label"] = "订单量";
                    m.table_column.push(col3_1);
                    var col3_2 = {};
                    col3_2["data"] = "a" + i + "2";
                    col3_2["label"] = "贸易额占比";
                    m.table_column.push(col3_2);
                    appendTableHead += "<th colspan='3' style='border-bottom-width: 1px'>" + m.barLine_data_x[i] + "</th>";
                }
                var col4 = {};
                col4["data"] = "total";
                col4["label"] = "总额";
                m.table_column.push(col4);
                appendTableHead += "<th style='border-bottom-width: 1px'></th></tr>";
                $("#query-ce18-table").html("");

                webSquid.ajax("data/s/tradeCountry/HJ", "GET", {
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    legend: m.legend.join(","),
                    year: year
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/e18");
                    var price;
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];
                        var sumPrice = item.all_total;
                        var tdata = {};
                        tdata["cycle"] = (i + 1) + "月";

                        var total = 0;
                        var count = 0;
                        for (var j = 0; j < country_length; j++) {
                            // 动态添加表格 贸易额，订单量，贸易额占比
                            price = item["total" + j] == null ? 0 : (item["total" + j] / 10000).toFixed(2);
                            tdata["a" + j + "0"] = price > 0 ? price + "万元" : price;
                            total = total + parseFloat(tdata["a" + j + "0"]);
                            tdata["a" + j + "1"] = item["count" + j] == null ? 0 : item["count" + j];
                            count = count + tdata["a" + j + "1"];
                            tdata["a" + j + "2"] = isNaN(item["total" + j] / sumPrice) ? "0%" : ((item["total" + j] / sumPrice) * 100).toFixed(2) + "%";
                        }
                        tdata["total"] = (sumPrice / 10000).toFixed(2);
                        // tdata["total"] = total.toFixed(2);
                        if (tdata["total"] > 0)
                            tdata["total"] += "万元";
                        m.table_data.push(tdata);
                    }
                    m.query(appendTableHead);
                });

                //查询国家分组（按月份、国家）数据 (分批效率查询，暂不用)
                // webSquid.ajax("data/s/HJ", "GET", {
                //     sid: tid1,
                //     ie: webSquid.ie,
                //     sign: webSquid.sign,
                //     start: start,
                //     end: end,
                //     param: m.legend.join(",")
                // }, function (rsp1) {
                //     var query_data1 = [];
                //     var query_data2 = [];
                //     for (var idx in rsp1.data) {
                //         var item1 = rsp1.data[idx];
                //         var value = [];
                //         var country = [];
                //         value.push(item1.country);
                //         value.push(item1.total);
                //         value.push(item1.count);
                //         country.push(item1.country,value);
                //         query_data1[item1.key] = country;
                //     }
                //     console.log(query_data1);
                //     //查询国家分组（按月份）总数据
                //     webSquid.ajax("data/s/HJ", "GET", {
                //         sid: tid2,
                //         ie: webSquid.ie,
                //         sign: webSquid.sign,
                //         start: start,
                //         end: end
                //     }, function (rsp2) {
                //         for (var idx in rsp2.data) {
                //             var item2 = rsp2.data[idx];
                //             var value = [];
                //             value.push(item2.all_total);
                //             value.push(item2.all_count);
                //             query_data2[item.key] = value;
                //         }
                //
                //         for (var i = 0; i < 12; i++) {
                //             var tdata = {};
                //             var qdata = query_data2[i + 1];
                //             var month = (i + 1) + "月";
                //
                //             tdata["cycle"] = month;
                //             if (typeof(qdata) == "undefined") {
                //                 for (var j = 0; j < country_length; j++) {
                //                     tdata["a" + j + "0"] = 0;
                //                     tdata["a" + j + "1"] = 0;
                //                     tdata["a" + j + "2"] = '0%';
                //                 }
                //
                //             } else {
                //
                //                 tdata["trade_money"] = qdata[0];
                //                 tdata["order_count"] = qdata[1];
                //                 tdata["avg_money"] = qdata[2];
                //             }
                //             m.table_data.push(tdata);
                //         }
                //
                //     });
                // });


            });
        },

        /**
         * 初始化
         */
        init: function () {
            $("[name='date_start']").val(moment(new Date()).subtract(1, 'M').startOf('year').format("YYYY"));
            $(".input-daterange").datepicker({

                viewSelect: 'decade',
                autoclose: true,
                startView: 'years',
                minViewMode: 'years',
                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy"
            });
            var title = webSquid.translateTitle(webSquid.sign);
            $("#text").text(title);
            this.graph();
            $("[ws-search]").unbind("click").click(this.graph);

        },

        graph_barLine: function (barLineCharts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.barLine_title
                },
                grid: {
                    left: '8%'
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
                    left: 'center',
                    top: '8%'
                },
                tooltip: {
                    show: true,
                    formatter: function (v) {
                        if (v.componentSubType == "bar") {
                            return v.name + "<br/>" + v.seriesName + ":" + v.value + "万元";
                        } else if (v.componentSubType == "line") {
                            return v.name + "<br/>" + v.seriesName + ":" + v.value + "单";
                        }
                    }
                },
                xAxis: {
                    data: this.barLine_data_x,
                    // axisLabel: {
                    //     formatter: function (v) {
                    //         var _txt = v.replace(/\//igm, '\n');
                    //         return _txt;
                    //     }
                    // },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '贸易额（万元）',
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '订单量',
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '贸易额',
                        type: 'bar',
                        yAxisIndex: 0,
                        barWidth: 15,
                        data: this.barLine_data1
                    },
                    {
                        name: '订单量',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.barLine_data2
                    }
                ]
            };
            webSquid.graph(barLineCharts, option);
        }

        ,

        graph_pie: function (pieCharts) {
            var option = {
                title: {
                    text: this.pie_title,
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    formatter: "{a} <br/>{b} : {c} 万元({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: this.pie_legend_data
                },
                series: [
                    {
                        name: '贸易额',
                        type: 'pie',
                        radius: ['20%', '50%'],
                        data: this.pie_data,
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
                                position: 'outside',
                                formatter: '{d}%'
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
            webSquid.graph(pieCharts, option);
        }


    };
