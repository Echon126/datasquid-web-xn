/**
 * 商品品类交易统计
 * Created by xcp on 2016/12/08.
 */


webSquid.page.modules["chart/e19"] = webSquid.page.modules["chart/e19"] || {

        //饼状图数据
        pie_title: '贸易额',
        pie_colors: ['#4A85C9', '#E16726', '#929292', '#F3B128', '#54FF9F', '#5D9E36', '#1D487C', '#873417', '#5C1D8F', '#F90504', '#FF02B4', '#647828'],
        pie_legend_data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '其它'],
        pie_data: [{value: 10245, name: '食品'}, {value: 12564, name: '饮料'}, {value: 16458, name: '酒'}
            , {value: 18659, name: '数码设备'}, {value: 15689, name: '厨卫'}, {value: 13549, name: '小家电'}
            , {value: 12349, name: '卫生用品'}, {value: 13489, name: '衣服'}, {value: 12349, name: '运动器材'}
            , {value: 10009, name: '摄像器材'}
        ],

        //柱状折线图数据
        barLine_title: '商品品类交易统计',
        barLine_data_x: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '其它'],
        barLine_colors: ['#6295D1', '#E66827'],
        barLine_legend_data: [{name: '贸易额'}, {name: '商品数量'}],
        barLine_data1: [60000, 75000, 55000, 65000, 70000, 69999, 70000, 86000, 66500, 78000],
        barLine_data2: [7000, 8500, 5450, 6200, 5500, 6000, 5960, 6230, 6400, 7500],

        //表格数据
        //表一 异常数据监测列表
        table_data: [
            {
                cycle: '1月',
                type: '贸易额',
                g1: '65160',
                g2: '67955',
                g3: '70800',
                g4: '73665',
                g5: '76500',
                g6: '79335',
                g7: '82170',
                g8: '85005',
                g9: '65160',
                g10: '73665',
                total: '942485'
            },
            {
                cycle: '1月',
                type: '商品数量',
                g1: '6675',
                g2: '7063',
                g3: '5478',
                g4: '4344',
                g5: '4911',
                g6: '5100',
                g7: '5289',
                g8: '5478',
                g9: '5667',
                g10: '5245',
                total: '65818'
            },
            {
                cycle: '1月',
                type: '贸易额占比',
                g1: '6.91%',
                g2: '7.21%',
                g3: '7.52%',
                g4: '7.12%',
                g5: '7.58%',
                g6: '8.42%',
                g7: '8.72%',
                g8: '9.02%',
                g9: '6.91%',
                g10: '7.8%',
                total: ''
            },
            {
                cycle: '2月',
                type: '贸易额',
                g1: '60160',
                g2: '87955',
                g3: '78800',
                g4: '72665',
                g5: '78500',
                g6: '73335',
                g7: '85170',
                g8: '83005',
                g9: '64160',
                g10: '72665',
                total: '992485'
            },
            {
                cycle: '2月',
                type: '商品数量',
                g1: '6775',
                g2: '7263',
                g3: '5578',
                g4: '4844',
                g5: '4811',
                g6: '5200',
                g7: '5489',
                g8: '5578',
                g9: '5267',
                g10: '5845',
                total: '75828'
            },
            {
                cycle: '2月',
                type: '贸易额占比',
                g1: '7.91%',
                g2: '7.21%',
                g3: '7.52%',
                g4: '7.12%',
                g5: '7.58%',
                g6: '8.42%',
                g7: '8.72%',
                g8: '9.02%',
                g9: '6.91%',
                g10: '7.8%',
                total: ''
            }

        ],

        query: function (appendTableHead) {
            webSquid.datatable("#query-ce19-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/e19").table_data,
                columns: webSquid.pageModule("chart/e19").table_column
            });
            $("#query-ce19-table thead").prepend(appendTableHead);
        },
        graph: function () {
            // var sql_graph = "select * from (select count(*) as order_count,sum(p.QTY) as goods_num,sum(t.total_price) as total_price , p.goods_type as  goods_type from order_info t,product_info p where t.relation_no = p.relation_no and t.sys_type='WT' and t.ie_type='I' and t.sys_type='WT' and t.ie_port='4604' and customs_code='4604'  and t.app_time >= to_date(to_char(sysdate,'yyyy'), 'yyyy') and app_time <= to_date(to_char(sysdate,'yyyy-MM-dd'), 'yyyy-MM-dd') group by p.goods_type order by sum(t.total_price) desc) a where rownum <= 10";
            var sid = "";
            var year = $("[name='date_start']").val();

            var start;
            var end;
            if (year.length > 0) {
                start = year + "-01-01";
                end = year + "-12-31";
            }


            if (webSquid.ie == "E") {
                sid = "c19_barlinepie_e"
            } else {
                sid = "c19_barlinepie_i";
            }
            webSquid.ajax("data/s/HJ", "GET", {
                sid: sid,
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/e19");
                m.barLine_data1 = [];
                m.barLine_data2 = [];
                m.pie_data = [];
                m.pie_legend_data = [];
                m.barLine_data_x = [];
                m.table_data = [];
                m.table_column = [];

                var itemObj = {};

                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    // var goodsType = webSquid.getGoodsLevel1(item.goods_type);
                    var goodsType = item.goods_type;

                    if (itemObj[goodsType]) {
                        var io = itemObj[goodsType];
                        itemObj[goodsType] = {
                            price: parseFloat(item.total_price) + io.price,
                            sum: parseInt(item.goods_num) + io.sum
                        };
                    } else {
                        itemObj[goodsType] = {price: parseFloat(item.total_price), sum: parseInt(item.goods_num)};
                    }
                }

                for (var type in itemObj) {
                    var item = itemObj[type];
                    m.pie_data.push({name: type, value: (item.price / 10000).toFixed(2)});

                    m.pie_legend_data.push(type);
                    m.barLine_data1.push((item.price / 10000).toFixed(2));
                    m.barLine_data2.push(item.sum);
                    m.barLine_data_x.push(type);

                }

                // 柱状折线图
                var barLineCharts = echarts.init(document.getElementById('c19_barLine'));
                m.graph_barLine(barLineCharts);
                // 饼状图 环形
                var pieCharts = echarts.init(document.getElementById('c19_pie'));
                m.graph_pie(pieCharts);

                if (m.barLine_data_x == null || m.barLine_data_x.length == 0) {
                    $("#query-ce19-table").html("");
                    return;
                }
                var goods_length = m.barLine_data_x.length;

                var col1 = {};
                col1["data"] = "cycle";
                col1["label"] = " ";
                m.table_column.push(col1);
                //补充表头
                var appendTableHead = "";
                appendTableHead += "<tr style='background-color: #afd7ed;border-bottom: none'><th style='border-bottom-width: 1px'></th>";
                for (var i = 0; i < goods_length; i++) {
                    // 动态添加表格表头 省信息
                    var col3_0 = {};
                    col3_0["data"] = "a" + i + "0";
                    col3_0["label"] = "贸易额";
                    m.table_column.push(col3_0);
                    var col3_1 = {};
                    col3_1["data"] = "a" + i + "1";
                    col3_1["label"] = "商品数量";
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
                $("#query-ce19-table").html("");

                webSquid.ajax("data/s/goodsTrade/HJ", "GET", {
                    ie: webSquid.ie,
                    sign: webSquid.sign,
                    legend: m.barLine_data_x.join(","),
                    year: year
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/e19");
                    var price;
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];
                        var sumPrice = item.all_total;
                        var tdata = {};
                        tdata["cycle"] = (i + 1) + "月";
                        tdata["type"] = "贸易额";
                        var tdata1 = {};
                        tdata1["cycle"] = (i + 1) + "月";
                        tdata1["type"] = "商品数量";
                        var tdata2 = {};
                        tdata2["cycle"] = (i + 1) + "月";
                        tdata2["type"] = "贸易额占比";

                        var total = 0;
                        var count = 0;
                        for (var j = 0; j < goods_length; j++) {
                            // 动态添加表格 贸易额，商品数量，贸易额占比
                            price = item["total" + j] == null ? 0 : (item["total" + j] / 10000).toFixed(2);
                            tdata["a" + j + "0"] = price > 0 ? price + "万元" : price;
                            total = total + parseFloat(tdata["a" + j + "0"]);
                            tdata["a" + j + "1"] = item["count" + j] == null ? 0 : item["count" + j];
                            count = count + tdata1["a" + j + "1"];
                            tdata["a" + j + "2"] = isNaN(item["total" + j] / sumPrice) ? "0%" : ((item["total" + j] / sumPrice) * 100).toFixed(2) + "%";
                        }
                        tdata["total"] = (sumPrice / 10000).toFixed(2);
                        if (tdata["total"] > 0)
                            tdata["total"] += "万元";
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


            // $("[ws-search]").unbind("click").click(this.query).click();
            // this.query();
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
                tooltip: {
                    show: true,
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
                    left:'center',
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
                        name: '贸易额',
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '商品数量',
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
                        name: '商品数量',
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
                    text: this.pie_title,
                },
                toolbox: {
                    show: true,
                    left: 'left',
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}万元 ({d}%)"
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
