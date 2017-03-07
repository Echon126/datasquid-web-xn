/**
 * 消费者交易统计
 * Created by xcp on 2016/12/08.
 */


webSquid.page.modules["chart/20"] = webSquid.page.modules["chart/20"] || {

        //饼状图数据
        pie_title: '贸易额',
        pie_colors: ['#4A85C9', '#E16726', '#929292', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4', '#647828'],
        pie_legend_data: ['河南', '浙江', '上海', '湖北', '四川', '陕西', '北京', '广西', '湖南', '广东'],
        pie_data: [{value: 10245, name: '北京'}, {value: 12564, name: '广州'}, {value: 16458, name: '上海'}
            , {value: 18659, name: '河南'}, {value: 15689, name: '山西'}, {value: 13549, name: '湖南'}
            , {value: 12349, name: '内蒙古'}, {value: 13489, name: '四川'}, {value: 12349, name: '重庆'}
            , {value: 10009, name: '山东'}, {value: 8888, name: '陕西'}
        ],


        //柱状折线图数据
        barLine_title: '消费者地区统计',
        barLine_data_x: ['河南', '浙江', '上海', '湖北', '四川', '陕西', '北京', '广西', '湖南', '广东'],
        barLine_colors: ['#6295D1', '#E66827'],
        barLine_legend_data: [{name: '贸易额'}, {name: '订单量'}],
        barLine_data1: [60000, 75000, 55000, 65000, 70000, 69999, 70000, 86000, 66500, 78000, 65000],
        barLine_data2: [7000, 8500, 5450, 6200, 5500, 6000, 5960, 6230, 6400, 7500, 6666],


        //表格数据
        table_column: [
            {data: "cycle", label: " "},
            {data: "type", label: "统计项"},
            {data: "a1", label: "河南"},
            {data: "a2", label: "浙江"},
            {data: "a3", label: "上海"},
            {data: "a4", label: "湖北"},
            {data: "a5", label: "四川"},
            {data: "a6", label: "陕西"},
            {data: "a7", label: "北京"},
            {data: "a8", label: "广西"},
            {data: "a9", label: "湖南"},
            {data: "a10", label: "广东"},
            {data: "total", label: "总额"},
        ],
        //表一 异常数据监测列表
        table_data: [
            {
                cycle: '1月',
                type: '贸易额',
                a1: '65160',
                a2: '67955',
                a3: '70800',
                a4: '73665',
                a5: '76500',
                a6: '79335',
                a7: '82170',
                a8: '85005',
                a9: '65160',
                a10: '73665',
                total: '942485'
            },
            {
                cycle: '1月',
                type: '订单量',
                a1: '6675',
                a2: '7063',
                a3: '5478',
                a4: '4344',
                a5: '4911',
                a6: '5100',
                a7: '5289',
                a8: '5478',
                a9: '5667',
                a10: '5245',
                total: '65818'
            },
            {
                cycle: '1月',
                type: '贸易额占比',
                a1: '6.91%',
                a2: '7.21%',
                a3: '7.52%',
                a4: '7.12%',
                a5: '7.58%',
                a6: '8.42%',
                a7: '8.72%',
                a8: '9.02%',
                a9: '6.91%',
                a10: '7.8%',
                total: ''
            },
            {
                cycle: '2月',
                type: '贸易额',
                a1: '60160',
                a2: '87955',
                a3: '78800',
                a4: '72665',
                a5: '78500',
                a6: '73335',
                a7: '85170',
                a8: '83005',
                a9: '64160',
                a10: '72665',
                total: '992485'
            },
            {
                cycle: '2月',
                type: '订单量',
                a1: '6775',
                a2: '7263',
                a3: '5578',
                a4: '4844',
                a5: '4811',
                a6: '5200',
                a7: '5489',
                a8: '5578',
                a9: '5267',
                a10: '5845',
                total: '75828'
            },
            {
                cycle: '2月',
                type: '贸易额占比',
                a1: '7.91%',
                a2: '7.21%',
                a3: '7.52%',
                a4: '7.12%',
                a5: '7.58%',
                a6: '8.42%',
                a7: '8.72%',
                a8: '9.02%',
                a9: '6.91%',
                a10: '7.8%',
                total: ''
            }

        ],

        query: function (appendTableHead) {
            webSquid.datatable("#query-c20-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/20").table_data,
                columns: webSquid.pageModule("chart/20").table_column
            });
            $("#query-c20-table thead").prepend(appendTableHead);
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
            if (webSquid.ie == "E") {
                sid = "c20_barlinepie_e"
            } else {
                sid = "c20_barlinepie_i";
            }
            var showTotalPrice = 0;
            webSquid.ajax("data/s/HJ", "GET", {
                sid: sid,
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/20");
                m.barLine_data1 = [];
                m.barLine_data2 = [];
                m.pie_legend_data = [];
                m.barLine_data_x = [];
                m.table_data = [];
                m.table_column = [];

                m.pie_data = [];

                var dataObj = {};
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];

                    // item.province = webSquid.getProvince(item.province, "其它");
                    if (dataObj[item.province]) {
                        var raw = dataObj[item.province];
                        dataObj[item.province] = {
                            province: raw.province,
                            total: raw.total + item.total,
                            count: raw.count + item.count
                        };
                    } else {
                        dataObj[item.province] = {province: item.province, total: item.total, count: item.count};
                    }
                }

                for (var province in dataObj) {
                    var item = dataObj[province];

                    var pdata = {};
                    pdata["name"] = province;
                    pdata["value"] = (item.total / 10000).toFixed(2);
                    m.pie_data.push(pdata);

                    m.pie_legend_data.push(province);
                    m.barLine_data_x.push(province);
                    m.barLine_data1.push((item.total / 10000).toFixed(2));
                    m.barLine_data2.push(item.count);
                    showTotalPrice += parseFloat(item.total);
                }

                // 柱状折线图
                var barLineCharts = echarts.init(document.getElementById('c20_barLine'));
                m.graph_barLine(barLineCharts);

                webSquid.ajax("data/s/HJ", "GET", {
                    sid: "c20_totalprice_i",
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    start: start,
                    end: end
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/20");
                    var sumTotal = 0;
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];
                        sumTotal += parseFloat(item.total);
                    }
                    m.pie_legend_data.push("其它");
                    m.pie_data.push({value: ((sumTotal - showTotalPrice) / 10000).toFixed(2), name: '其它'});
                    // 饼状图 环形
                    var pieCharts = echarts.init(document.getElementById('c20_pie'), "roma");
                    m.graph_pie(pieCharts);
                });


                if (m.barLine_data_x == null || m.barLine_data_x.length == 0) {
                    $("#query-c20-table").html("");
                    return;
                }
                var province_length = m.barLine_data_x.length;

                var col1 = {};
                col1["data"] = "cycle";
                col1["label"] = " ";
                m.table_column.push(col1);
                //补充表头
                var appendTableHead = "";
                appendTableHead += "<tr style='background-color: #afd7ed;border-bottom: none'><th style='border-bottom-width: 1px'></th>";
                for (var i = 0; i < province_length; i++) {
                    // 动态添加表格表头 省信息
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
                $("#query-c20-table").html("");

                webSquid.ajax("data/s/consumerTrade/HJ", "GET", {
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    legend: m.barLine_data_x.join(","),
                    year: year
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/20");
                    var price;
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];
                        var sumPrice = item.all_total;
                        var tdata = {};
                        tdata["cycle"] = (i + 1) + "月";
                        tdata["type"] = "贸易额";
                        var tdata1 = {};
                        tdata1["cycle"] = (i + 1) + "月";
                        tdata1["type"] = "订单量";
                        var tdata2 = {};
                        tdata2["cycle"] = (i + 1) + "月";
                        tdata2["type"] = "贸易额占比";

                        var total = 0;
                        var count = 0;
                        for (var j = 0; j < province_length; j++) {
                            // 动态添加表格 贸易额，订单量，贸易额占比
                            price = item["total" + j] == null ? 0 : (item["total" + j] / 10000).toFixed(2);
                            tdata["a" + j + "0"] = price > 0 ? price + "万元" : price;
                            total = total + parseFloat(tdata["a" + j + "0"]);
                            tdata["a" + j + "1"] = item["count" + j] == null ? 0 : item["count" + j];
                            count = count + tdata1["a" + j + "1"];
                            tdata["a" + j + "2"] = isNaN(item["total" + j] / sumPrice) ? "0%" : ((item["total" + j] / sumPrice) * 100).toFixed(2) + "%";
                        }
                        tdata["total"] = (sumPrice / 10000).toFixed(2);
                        if (tdata["total"] > 0) tdata["total"] += "万元";
                        m.table_data.push(tdata);

                    }
                    m.query(appendTableHead);
                });


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
                    text: this.barLine_title,//标题文本
                },
                grid: {
                    left: '8%'
                },
                tooltip: {
                    // formatter: '{b0}<br/>{c0}'
                    formatter: function (v) {
                        if (v.componentSubType == "bar") {
                            return v.name + "<br/>" + v.seriesName + ":" + v.value + "万元";
                        } else if (v.componentSubType == "line") {
                            return v.name + "<br/>" + v.seriesName + ":" + v.value + "单";
                        }
                    }
                },//提示框组件
                toolbox: {
                    show: true,
                    left: 'left',
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
                        name: '贸易额(万元)',
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
                    formatter: "{a} <br/>{b} : {c} 元({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    right: 0,
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
                                formatter: '{d}%',
                                textStyle: {
                                    color: '#000'
                                }
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
