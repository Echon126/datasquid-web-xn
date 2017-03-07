/**
 * 进口交易量统计
 * Created by xcp on 2016/11/22.
 */


webSquid.page.modules["chart/e17"] = webSquid.page.modules["chart/e17"] || {

        //柱状图数据
        bar_title: '贸易额',
        bar_data_x: (function () {
            var arr = [];
            for (var i = 1; i <= 12; i++) {
                arr.push(i + "月");
            }
            return arr;
        })(),
        bar_name: (function () {
            var date = new Date;
            return date.getFullYear() + "年";
        })(),
        bar_colors: ['#4A87CB', '#E66827'],
        bar_legend_data: [{name: this.bar_name}],
        bar_data: [6500, 7000, 6000, 6300, 4000, 5500, 5400, 6400, 6900, 8000, 8200, 9900],


        //柱状折线图数据
        barLine_title: '订单量及单笔均值',
        barLine_data_x: (function () {
            var arr = [];
            for (var i = 1; i <= 12; i++) {
                arr.push(i + "月");
            }
            return arr;
        })(),
        barLine_colors: ['#5FA037', '#B85430'],
        barLine_legend_data: [{name: '订单量'}, {name: '平均单笔交易额'}],
        barLine_data1: [6675, 7053, 5478, 5667, 4344, 4911, 4911, 5100, 5289, 5478, 5667, 6675],
        barLine_data2: [52, 51, 68, 69, 93, 86, 89, 88, 65, 71, 72, 66],


        //表格数据
        //表一 异常数据监测列表
        table_data: [
            {cycle: '1月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '2月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '3月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '4月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '5月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '6月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '7月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '8月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '9月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '10月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '11月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '12月', trade_money: '65160', order_count: '6675', avg_money: '52.06'},
            {cycle: '合计', trade_money: '899100', order_count: '67248', avg_money: '66.41'}
        ],

        graph: function () {
            var time = $("[name='date_start']").val();
            var start;
            var end;
            if (time.length > 0) {
                start = time + "-01-01";
                end = time + "-12-31";
            }

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c17_barlinetable_e",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e17");
                // 清空柱状图数据
                m.bar_data = [];
                m.bar_data_x = [];
                // 清空柱线图数据
                m.barLine_data1 = [];
                m.barLine_data2 = [];
                m.barLine_data_x = [];
                // 清空表格数据
                m.table_data = [];

                var query_data = [];
                for (var idx in rsp.data) {
                    var item = rsp.data[idx];
                    var value = [];
                    value.push((item.sum / 10000).toFixed(2));
                    value.push(item.count);
                    value.push(parseFloat(item.avg).toFixed(2));
                    query_data[item.key] = value;
                }
                // sum count avg
                for (var i = 0; i < 12; i++) {
                    var tdata = {};
                    var qdata = query_data[i + 1];
                    var month = (i + 1) + "月";
                    m.bar_data_x.push(month);
                    m.barLine_data_x.push(month);
                    tdata["cycle"] = month;
                    if (typeof(qdata) == "undefined") {
                        m.bar_data.push(0);
                        m.barLine_data1.push(0);
                        m.barLine_data2.push(0);
                        tdata["trade_money"] = 0;
                        tdata["order_count"] = 0;
                        tdata["avg_money"] = 0;
                    } else {
                        m.bar_data.push(qdata[0]);
                        m.barLine_data1.push(qdata[1]);
                        m.barLine_data2.push(qdata[2]);
                        tdata["trade_money"] = qdata[0];
                        tdata["order_count"] = qdata[1];
                        tdata["avg_money"] = qdata[2];
                    }
                    m.table_data.push(tdata);
                }

                // 柱状图
                var barCharts = echarts.init(document.getElementById('c17_bar'));
                m.graph_bar(barCharts);
                // 柱状图
                var barLineCharts = echarts.init(document.getElementById('c17_barLine'));
                m.graph_barLine(barLineCharts);


                // 表格赋值
                webSquid.datatable("#query-ce17-table", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: webSquid.pageModule("chart/e17").table_data,
                    // order: [0, 'asc'],
                    columns: [
                        {data: "cycle", label: "周期"},
                        {data: "trade_money", label: "贸易额(万元)"},
                        {data: "order_count", label: "订单量"},
                        {data: "avg_money", label: "平均单笔交易额(元)"}
                    ]
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
            $("[ws-search]").unbind("click").click(this.graph);
            this.graph();
        },
        graph_bar: function (barCharts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.bar_title
                },
                grid: {
                    left: '8%'
                },
                tooltip: {
                    formatter: '{a0}{b0}<br/>{c0}万元'
                },//提示框组件
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
                    data: this.bar_legend_data,
                    bottom: '1%'
                },
                xAxis: {
                    data: this.bar_data_x,
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: '贸易额（万元）',
                    axisLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: this.bar_name,
                        type: 'bar',
                        barWidth: 15,
                        data: this.bar_data
                    }
                ]
            };
            webSquid.graph(barCharts, option);
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
                    bottom: '1%',
                    left: '30%'
                },
                xAxis: {
                    data: this.barLine_data_x,
                    axisLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '订单量',
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '交易额（元）',
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '订单量',
                        type: 'bar',
                        yAxisIndex: 0,
                        barWidth: 15,
                        data: this.barLine_data1
                    },
                    {
                        name: '平均单笔交易额',
                        yAxisIndex: 1,
                        type: 'line',
                        data: this.barLine_data2
                    }
                ]
            };
            webSquid.graph(barLineCharts, option);
        }
    };
