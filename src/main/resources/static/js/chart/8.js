/**
 * 异常数据监测
 * Created by xcp on 2016/12/07.
 */


webSquid.page.modules["chart/8"] = webSquid.page.modules["chart/8"] || {


        //柱状图数据
        bar_title: '超长票数占比',
        bar_legend: ['全环节用时', '国际物流用时', '企业申报用时', '海关放行用时', '国检放行用时', '查验分拣用时', '核放出区用时', '国内物流用时'],
        bar_colors: ['#A5C249', '#7CCA62', '#10CF9B', '#657828', '#44872D', '#0A7C5D', '#B7CE6D'],
        bar_legend_data: [{name: '超长票数占比'}],
        bar_data: ['9.69', '9.31', '5.02', '11.08', '5.32', '9.31', '4.87', '9.90'],


        //表一 异常数据监测列表
        table1_data: [
            {link: '全环节用时', ticket: '25', ratio: '9.69%'},
            {link: '国际物流用时', ticket: '63', ratio: '9.31%'},
            {link: '企业申报用时', ticket: '34', ratio: '5.02%'},
            {link: '海关放行用时', ticket: '75', ratio: '11.08%'},
            {link: '国检放行用时', ticket: '36', ratio: '5.32%'},
            {link: '查验分拣用时', ticket: '63', ratio: '9.31%'},
            {link: '核放出区用时', ticket: '33', ratio: '4.87%'},
            {link: '国内物流用时', ticket: '67', ratio: '9.90%'},
            {link: '总票数', ticket: '677', ratio: ''}
        ],

        //表二 异常数据监测详情列表
        table2_data: [],

        see: function (clickBtn, type) {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();


            var thresholdStr;
            if(type=="all_time"){
                thresholdStr="qhj";
            }else if(type=="gjwl_time"){
                thresholdStr="gjwl";
            }else if(type=="qysb_time"){
                thresholdStr="qysb";
            }else if(type=="hgtg_time"){
                thresholdStr="hgfx";
            }else if(type=="gjtg_time"){
                thresholdStr="gjfx";
            }else if(type=="cyfj_time"){
                thresholdStr="cyfj";
            }else if(type=="shcq_time"){
                thresholdStr="hfcq";
            }else if(type=="gnwl_time"){
                thresholdStr="gnwl";
            }

            var linkName = $(clickBtn).parent().prev().prev().prev().html();
            if (undefined == linkName || null == linkName) linkName = "全环节用时";
            $("#c8_error_title").html(linkName);

            // var threshold = 60 * 60 * 12; // 12h

            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c8_seetable",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end,
                param: [type].join(";"),
                unknown: "?"+thresholdStr+"?",
                threshold:[thresholdStr.toUpperCase()].join(";")
            }, function (rsp) {
                var m = webSquid.pageModule("chart/8");
                m.table2_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var tdata = {};
                    var order_no = item.order_no;
                    var all_time = item.all_time == null ? 0 : (item.all_time / 60).toFixed(2);
                    var gjwl_time = item.gjwl_time == null ? 0 : (item.gjwl_time / 60).toFixed(2);
                    var qysb_time = item.qysb_time == null ? 0 : (item.qysb_time / 60).toFixed(2);
                    var hgtg_time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                    var gjtg_time = item.gjtg_time == null ? 0 : (item.gjtg_time / 60).toFixed(2);
                    var cyfj_time = item.cyfj_time == null ? 0 : (item.cyfj_time / 60).toFixed(2);
                    var shcq_time = item.shcq_time == null ? 0 : (item.shcq_time / 60).toFixed(2);
                    var gnwl_time = item.gnwl_time == null ? 0 : (item.gnwl_time / 60).toFixed(2);
                    tdata["order_no"] = order_no;
                    tdata["all_time"] = all_time;
                    tdata["gjwl_time"] = gjwl_time;
                    tdata["qysb_time"] = qysb_time;
                    tdata["hgtg_time"] = hgtg_time;
                    tdata["gjtg_time"] = gjtg_time;
                    tdata["cyfj_time"] = cyfj_time;
                    tdata["shcq_time"] = shcq_time;
                    tdata["gnwl_time"] = gnwl_time;

                    for (var key in tdata) {
                        if (key.indexOf("_time") > -1) {
                            if (tdata[key] == 0)
                                tdata[key + "_label"] = "-";
                            else
                                tdata[key + "_label"] = webSquid.translateTimeCost(tdata[key]);
                        }
                    }

                    m.table2_data.push(tdata);
                }


                webSquid.datatable("#query-c8-table2", {
                    ordering: false,
                    data: webSquid.pageModule("chart/8").table2_data,
                    columns: [
                        {data: "order_no", label: "订单号"},
                        {data: "all_time_label", label: "全流程时间"},
                        {data: "gjwl_time_label", label: "国际物流用时"},
                        {data: "qysb_time_label", label: "企业申报用时"},
                        {data: "hgtg_time_label", label: "海关放行用时"},
                        {data: "gjtg_time_label", label: "国检放行用时"},
                        {data: "cyfj_time_label", label: "查验分拣用时"},
                        {data: "shcq_time_label", label: "核放出区用时"},
                        {data: "gnwl_time_label", label: "国内物流用时"}
                    ]
                });

                webSquid.showWorkspace();
            });

        },

        query: function () {
            webSquid.showPageQuery();

            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();



            var threshold = 60 * 60 * 12; // 12h
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c8_bartable",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end,
                // param: [threshold].join(";"),
                threshold: ["QHJ", "GJWL", "QYSB", "HGFX", "GJFX", "CYFJ", "HFCQ", "GNWL"].join(";")
            }, function (rsp) {
                var m = webSquid.pageModule("chart/8");
                var item = rsp.data[0];
                var total = item.total;

                m.table1_data = [
                    {link: '全环节用时', ticket: item.all_time, ratio: '', type: 'all_time'},
                    {link: '国际物流用时', ticket: item.gjwl_time, ratio: '', type: 'gjwl_time'},
                    {link: '企业申报用时', ticket: item.qysb_time, ratio: '', type: 'qysb_time'},
                    {link: '海关放行用时', ticket: item.hgtg_time, ratio: '', type: 'hgtg_time'},
                    {link: '国检放行用时', ticket: item.gjtg_time, ratio: '', type: 'gjtg_time'},
                    {link: '查验分拣用时', ticket: item.cyfj_time, ratio: '', type: 'cyfj_time'},
                    {link: '核放出区用时', ticket: item.shcq_time, ratio: '', type: 'shcq_time'},
                    {link: '国内物流用时', ticket: item.gnwl_time, ratio: '', type: 'gnwl_time'}
                ];

                m.bar_data = [];
                for (var i in m.table1_data) {
                    var it = m.table1_data[i];
                    var value = (Math.round(it.ticket / total * 10000) / 100);
                    value = isNaN(value) ? 0 : value;
                    m.table1_data[i].ratio = value + "%";

                    m.bar_data.push(value);
                }

                m.table1_data.push(
                    {link: '总票数', ticket: total, ratio: ''});

                webSquid.datatable("#query-c8-table1", {
                    paging: false,
                    ordering: false,
                    info: false,
                    filter: false,
                    data: m.table1_data,
                    // order: [0, 'asc'],
                    columns: [
                        {data: "link", label: "环节用时"},
                        {data: "ticket", label: "超长票数"},
                        {data: "ratio", label: "占比"},
                        {
                            label: "操作",
                            render: function (data, type, row) {
                                if (row.link == '总票数') return "";
                                return "<button class='btn btn-primary btn-xs' onclick=\"webSquid.page.modules['chart/8'].see(this, '" +
                                    row.type + "');\"><i class='fa fa-search-plus'></i> </button> ";
                            }
                        }
                    ]
                });
                // 柱状图
                var barCharts = echarts.init(document.getElementById('c8_bar'));
                m.graph_bar(barCharts);

            });

        },

        /**
         * 初始化
         */
        init: function () {
            $("[name='date_start']").val(moment(new Date()).subtract(3, 'M').startOf('month').format("YYYY-MM-DD"));
            $("[name='date_end']").val(moment(new Date()).endOf('month').format("YYYY-MM-DD"));
            $("#ws-page-back").click(webSquid.showPageQuery);

            $(".input-daterange").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });
            var title = webSquid.translateTitle(webSquid.sign);
            $("#text").text(title);
            $("[ws-search]").unbind("click").click(this.query).click();
        },


        graph_bar: function (barCharts) {
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: this.bar_title
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                tooltip: {
                    formatter: "{a} <br/>{b} : {c} %"
                },
                grid: {
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLine: {
                        show: false
                    }

                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: this.bar_legend,
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
                        name: '超长票数占比',
                        type: 'bar',
                        barWidth: 15,
                        itemStyle: {
                            normal: {
                                color: '#3E9EDA',
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.bar_data
                    }
                ]
            };
            webSquid.graph(barCharts, option);
        }


    };
