    /**
 * 最长最短环节时效
 * Created by xcp on 2016/12/07.
 */


webSquid.page.modules["chart/3"] = webSquid.page.modules["chart/3"] || {

        //柱状图
        bar_legend_data: ['国际物流', '企业申报', '海关放行', '国检放行', '查验分拣', '核放出区', '国内物流'],
        bar_data1: ['220', '225', '230', '235', '240', '245', '250'],
        bar_data2: ['22', '22', '23', '23', '24', '24', '25'],

        table_data: [
            {
                orderNo: '123001',
                link: '最短用时',
                gjwl_time: '56',
                qysb_time: '81',
                hgtg_time: '57',
                gjtg_time: '82',
                cyfj_time: '58',
                shcq_time: '83',
                gnwl_time: '59',
                all_time: '499',
                togethqysb_time: '435'
            },
            {
                orderNo: '123002',
                link: '最长用时',
                gjwl_time: '234',
                qysb_time: '259',
                hgtg_time: '235',
                gjtg_time: '260',
                cyfj_time: '236',
                shcq_time: '261',
                gnwl_time: '237',
                all_time: '2157',
                togethqysb_time: '435'
            }
        ],
        table2_data: [
            {pname: '全流程时间', start: '2016-09-16 16:04', end: '2016-09-18 23:00', totalTime: '4344'},
            {pname: '国际物流用时', start: '2016-09-16 16:04', end: '2016-09-18 17:00', totalTime: '583'},
            {pname: '企业申报用时', start: '2016-09-16 17:00', end: '2016-09-18 18:00', totalTime: '569'},
            {pname: '海关放行用时', start: '2016-09-16 18:00', end: '2016-09-18 19:04', totalTime: '685'},
            {pname: '国检放行用时', start: '2016-09-16 19:04', end: '2016-09-18 20:04', totalTime: '436'},
            {pname: '查验分拣用时', start: '2016-09-16 20:04', end: '2016-09-18 21:04', totalTime: '756'},
            {pname: '核放出区用时', start: '2016-09-16 21:04', end: '2016-09-18 22:04', totalTime: '654'},
            {pname: '国内物流用时', start: '2016-09-16 22:04', end: '2016-09-18 23:00', totalTime: '432'}
        ],

        // 查询最长最短时间主表格
        query: function () {
            var url = $("[ws-search]").attr("ws-search");
            var data = webSquid.serialize(".ws-query form");
            if (data.length > 0)
                url += "?" + data;

            webSquid.datatable("#query-c3-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/3").table_data,
                // order: [0, 'asc'],
                columns: [
                    {data: "link", label: "环节类型"},
                    {data: "gjwl_time_label", label: "国际物流"},
                    {data: "qysb_time_label", label: "企业申报"},
                    {data: "hgtg_time_label", label: "海关放行"},
                    {data: "gjtg_time_label", label: "国检放行"},
                    {data: "cyfj_time_label", label: "查验分拣"},
                    {data: "shcq_time_label", label: "核放出区"},
                    {data: "gnwl_time_label", label: "国内物流"},
                    {data: "all_time_label", label: "全环节"},
                    {data: "togethqysb_time_label", label: "并行用时"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                "<button class='btn btn-primary btn-xs' onclick='webSquid.page.modules[" + '\"chart/3\"' + "].detail(\"" + row.orderNo + "\");'><i class='fa fa-search-plus'>查看</i> </button> ";
                            return code;
                        }
                    }
                ]
            });
        },
        // 查询订单详情
        queryDetail: function () {
            webSquid.datatable("#query-c3-wstable", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/3").table2_data,
                // order: [0, 'asc'],
                columns: [
                    {data: "pname", label: "流程名称"},
                    {data: "start", label: "起始"},
                    {data: "end", label: "结束"},
                    {data: "totalTime_label", label: "时长（分钟）"}
                ]
            });
        },

        graph: function () {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();


            // 查询柱状图、表格数据(最长)
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c3_bartable_long",
                sign: webSquid.sign,
                ie: webSquid.ie,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/3");
                m.bar_data1 = [];
                m.bar_data2 = [];
                m.table_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var gjwl_time = item.gjwl_time == null ? 0 : (item.gjwl_time / 60).toFixed(2);
                    var qysb_time = item.qysb_time == null ? 0 : (item.qysb_time / 60).toFixed(2);
                    var hgtg_time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                    var gjtg_time = item.gjtg_time == null ? 0 : (item.gjtg_time / 60).toFixed(2);
                    var cyfj_time = item.cyfj_time == null ? 0 : (item.cyfj_time / 60).toFixed(2);
                    var shcq_time = item.shcq_time == null ? 0 : (item.shcq_time / 60).toFixed(2);
                    var gnwl_time = item.gnwl_time == null ? 0 : (item.gnwl_time / 60).toFixed(2);
                    var all_time = item.all_time == null ? 0 : (item.all_time / 60).toFixed(2);
                    var total_time = parseFloat(gjwl_time) + parseFloat(qysb_time) + parseFloat(hgtg_time) + parseFloat(gjtg_time) + parseFloat(cyfj_time) + parseFloat(shcq_time) + parseFloat(gnwl_time);

                    m.bar_data1.push(gjwl_time);
                    m.bar_data1.push(qysb_time);
                    m.bar_data1.push(hgtg_time);
                    m.bar_data1.push(gjtg_time);
                    m.bar_data1.push(cyfj_time);
                    m.bar_data1.push(shcq_time);
                    m.bar_data1.push(gnwl_time);

                    var dataItem = {
                        orderNo: item.order_no,
                        link: item.link,
                        gjwl_time: gjwl_time,
                        qysb_time: qysb_time,
                        hgtg_time: hgtg_time,
                        gjtg_time: gjtg_time,
                        cyfj_time: cyfj_time,
                        shcq_time: shcq_time,
                        gnwl_time: gnwl_time,
                        all_time: all_time,
                        togethqysb_time: (parseFloat(total_time) - parseFloat(all_time)).toFixed(2)
                    };

                    for (var key in dataItem) {
                        if (key.indexOf("_time") > -1)
                            dataItem[key + "_label"] = webSquid.translateTimeCost(dataItem[key]);
                    }
                    m.table_data.push(dataItem);
                }
                // 查询柱状图、表格数据(最短)
                webSquid.ajax("data/s/HJ", "GET", {
                    sid: "c3_bartable_short",
                    sign: webSquid.sign,
                    ie: webSquid.ie,
                    start: start,
                    end: end
                }, function (rsp) {
                    var m = webSquid.pageModule("chart/3");
                    for (var i = 0; i < rsp.data.length; i++) {
                        var item = rsp.data[i];

                        var gjwl_time = item.gjwl_time == null ? 0 : (item.gjwl_time / 60).toFixed(2);
                        var qysb_time = item.qysb_time == null ? 0 : (item.qysb_time / 60).toFixed(2);
                        var hgtg_time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                        var gjtg_time = item.gjtg_time == null ? 0 : (item.gjtg_time / 60).toFixed(2);
                        var cyfj_time = item.cyfj_time == null ? 0 : (item.cyfj_time / 60).toFixed(2);
                        var shcq_time = item.shcq_time == null ? 0 : (item.shcq_time / 60).toFixed(2);
                        var gnwl_time = item.gnwl_time == null ? 0 : (item.gnwl_time / 60).toFixed(2);
                        var all_time = item.all_time == null ? 0 : (item.all_time / 60).toFixed(2);
                        var total_time = parseFloat(gjwl_time) + parseFloat(qysb_time) + parseFloat(hgtg_time) + parseFloat(gjtg_time) + parseFloat(cyfj_time) + parseFloat(shcq_time) + parseFloat(gnwl_time);

                        m.bar_data2.push(gjwl_time);
                        m.bar_data2.push(qysb_time);
                        m.bar_data2.push(hgtg_time);
                        m.bar_data2.push(gjtg_time);
                        m.bar_data2.push(cyfj_time);
                        m.bar_data2.push(shcq_time);
                        m.bar_data2.push(gnwl_time);

                        var dataItem = {
                            orderNo: item.order_no,
                            link: item.link,
                            gjwl_time: gjwl_time,
                            qysb_time: qysb_time,
                            hgtg_time: hgtg_time,
                            gjtg_time: gjtg_time,
                            cyfj_time: cyfj_time,
                            shcq_time: shcq_time,
                            gnwl_time: gnwl_time,
                            all_time: all_time,
                            togethqysb_time: (parseFloat(total_time) - parseFloat(all_time)).toFixed(2)
                        };

                        for (var key in dataItem) {
                            if (key.indexOf("_time") > -1)
                                dataItem[key + "_label"] = webSquid.translateTimeCost(dataItem[key]);
                        }

                        m.table_data.push(dataItem);
                    }
                    // 柱状图
                    var barCharts = echarts.init(document.getElementById('c3_bar'));
                    m.graph_bar(barCharts);
                    m.query();
                });
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
            $("#ws-page-back").click(this.back);
        },

        back: function () {
            // webSquid.page.modules.task.query();
            webSquid.showPageQuery();
        },
        detail: function (orderNo) {
            webSquid.showWorkspace();
            $("#ws-work-title").text("订单号：" + orderNo);
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c3_detail",
                sign: webSquid.sign,
                ie: webSquid.ie,
                param: [orderNo].join(";")
            }, function (rsp) {
                var m = webSquid.pageModule("chart/3");
                m.table2_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var gjwl_time = item.gjwl_time == null ? 0 : (item.gjwl_time / 60).toFixed(2);
                    var qysb_time = item.qysb_time == null ? 0 : (item.qysb_time / 60).toFixed(2);
                    var hgtg_time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                    var gjtg_time = item.gjtg_time == null ? 0 : (item.gjtg_time / 60).toFixed(2);
                    var cyfj_time = item.cyfj_time == null ? 0 : (item.cyfj_time / 60).toFixed(2);
                    var shcq_time = item.shcq_time == null ? 0 : (item.shcq_time / 60).toFixed(2);
                    var gnwl_time = item.gnwl_time == null ? 0 : (item.gnwl_time / 60).toFixed(2);
                    var all_time = item.all_time == null ? 0 : (item.all_time / 60).toFixed(2);
                    var xdzf_min = item.xdzf_min == null ? "无" : moment(item.xdzf_min).format('YYYY-MM-DD HH:mm:ss');
                    var ydrc_min = item.ydrc_min == null ? "无" : moment(item.ydrc_min).format('YYYY-MM-DD HH:mm:ss');
                    var hgsb_min = item.hgsb_min == null ? "无" : moment(item.hgsb_min).format('YYYY-MM-DD HH:mm:ss');
                    var hgfx_min = item.hgfx_min == null ? "无" : moment(item.hgfx_min).format('YYYY-MM-DD HH:mm:ss');
                    var gjsb_min = item.gjsb_min == null ? "无" : moment(item.gjsb_min).format('YYYY-MM-DD HH:mm:ss');
                    var gjfx_min = item.gjfx_min == null ? "无" : moment(item.gjfx_min).format('YYYY-MM-DD HH:mm:ss');
                    var fjfx_min = item.fjfx_min == null ? "无" : moment(item.fjfx_min).format('YYYY-MM-DD HH:mm:ss');
                    var hfsb_min = item.hfsb_min == null ? "无" : moment(item.hfsb_min).format('YYYY-MM-DD HH:mm:ss');
                    var hfcq_min = item.hfcq_min == null ? "无" : moment(item.hfcq_min).format('YYYY-MM-DD HH:mm:ss');
                    var tuotou_min = item.tuotou_min == null ? "无" : moment(item.tuotou_min).format('YYYY-MM-DD HH:mm:ss');
                    var all_time_start = item.all_time_start == null ? "无" : moment(item.all_time_start).format('YYYY-MM-DD HH:mm:ss');
                    var all_time_end = item.all_time_end == null ? "无" : moment(item.all_time_end).format('YYYY-MM-DD HH:mm:ss');
                    var cyfj_start = item.cyfj_start == null ? "无" : moment(item.cyfj_start).format('YYYY-MM-DD HH:mm:ss');


                    // var qdhx_min = item.qdhx_min == null ? "无" : moment(item.qdhx_min).format('YYYY-MM-DD HH:mm:ss');
                    m.table2_data.push(
                        {pname: '全流程时间', start: all_time_start, end: all_time_end, totalTime: all_time},
                        {pname: '国际物流用时', start: xdzf_min, end: ydrc_min, totalTime: gjwl_time},
                        {pname: '企业申报用时', start: ydrc_min, end: hgsb_min, totalTime: qysb_time},
                        {pname: '海关放行用时', start: hgsb_min, end: hgfx_min, totalTime: hgtg_time},
                        {pname: '国检放行用时', start: gjsb_min, end: gjfx_min, totalTime: gjtg_time},
                        {pname: '查验分拣用时', start: cyfj_start, end: fjfx_min, totalTime: cyfj_time},
                        {pname: '核放出区用时', start: hfsb_min, end: hfcq_min, totalTime: shcq_time},
                        {pname: '国内物流用时', start: hfcq_min, end: tuotou_min, totalTime: gnwl_time});
                }

                for (var idx in m.table2_data) {
                    m.table2_data[idx]["totalTime_label"] = webSquid.translateTimeCost(m.table2_data[idx].totalTime);
                }
                m.queryDetail();
            });

        },
        graph_bar: function (barCharts) {
            var option = {
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    //formatter: "{a} <br/>{b} : {c} (分钟)"
                    formatter: function (params) {
                        return params.seriesName + ": " + webSquid.translateTimeCost(params.value);
                    }
                },
                grid: {
                    containLabel: true
                },
                legend: {
                    top: '1%',
                    left: '25%',
                    data: this.bar_legend_data
                },
                xAxis: {
                    splitNumber: 2,
                    type: 'value',
                    boundaryGap: [0, 0.01],
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
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: ['最长用时', '最短用时'],
                    axisLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '15'
                    }
                },
                series: [
                    {
                        name: '国际物流',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        // itemStyle: {
                        //     normal: {
                        //         shadowBlur: 10,
                        //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //     }
                        // },
                        data: [this.bar_data1[0], this.bar_data2[0]]
                    },
                    {
                        name: '企业申报',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[1], this.bar_data2[1]]
                    }, {
                        name: '海关放行',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[2], this.bar_data2[2]]
                    },
                    {
                        name: '国检放行',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[3], this.bar_data2[3]]
                    },
                    {
                        name: '查验分拣',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[4], this.bar_data2[4]]
                    },
                    {
                        name: '核放出区',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[5], this.bar_data2[5]]
                    },
                    {
                        name: '国内物流',
                        type: 'bar',
                        stack: 'A',
                        data: [this.bar_data1[6], this.bar_data2[6]]
                    }

                ]
            };
            webSquid.graph(barCharts, option);
        }
    };
