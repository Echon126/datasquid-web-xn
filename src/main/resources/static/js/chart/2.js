/**
 * 全环节时效分析
 * Created by xcp on 2016/12/06.
 */


webSquid.page.modules["chart/2"] = webSquid.page.modules["chart/2"] || {

        //柱状图
        bar_legend_data: ['全部用时', '国际物流', '企业申报', '海关放行', '国检放行', '查验分拣', '核放出区', '国内物流'],
        bar_data: ['1200', '220', '225', '230', '235', '240', '245', '250'],

        //饼状环图数据
        pie_title: '总用时占比',
        pie_legend_data: ['国际物流', '企业申报', '海关放行', '国检放行', '查验分拣', '核放出区', '国内物流'],
        pie_data: [{value: 234, name: '国际物流'}, {value: 259, name: '企业申报'}, {value: 235, name: '海关放行'}
            , {value: 260, name: '国检放行'}, {value: 236, name: '查验分拣'}, {value: 261, name: '核放出区'}
            , {value: 237, name: '国内物流'}
        ],
        //表格数据
        table_data: [],


        query: function () {
            var date2TimestampFunc = function (value) {
                var timestamp = new Date(value).getTime();
                if (!timestamp)
                    return 0;
                return timestamp;
            };
            var data = webSquid.serialize(".ws-query form", {
                "date_start": date2TimestampFunc,
                "date_end": date2TimestampFunc
            });

            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;

            webSquid.datatable("#query-c2-table", {
                paging: false,
                ordering: false,
                info: false,
                filter: false,
                data: webSquid.pageModule("chart/2").table_data,
                columns: [
                    {data: "all_time_label", label: "全环节平均"},
                    {data: "gjwl_time_label", label: "国际物流平均"},
                    {data: "qysb_time_label", label: "企业申报平均"},
                    {data: "hgtg_time_label", label: "海关放行平均"},
                    {data: "gjtg_time_label", label: "国检放行平均"},
                    {data: "cyfj_time_label", label: "查验分拣平均"},
                    {data: "shcq_time_label", label: "核放出区平均"},
                    {data: "gnwl_time_label", label: "国内物流平均"},
                    {data: "para_time_label", label: "并行用时"},
                    {data: "total_time_label", label: "合计"}
                ]
            });
        },

        graph: function () {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();



            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c2_barpie",
                ie: webSquid.ie,
                sign: webSquid.sign,
                start: start,
                end: end
            }, function (rsp) {
                var m = webSquid.pageModule("chart/2");
                m.bar_data = [];
                m.pie_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var all_time = item.all_time == null ? 0 : (item.all_time / 60).toFixed(2);
                    var gjwl_time = item.gjwl_time == null ? 0 : (item.gjwl_time / 60).toFixed(2);
                    var qysb_time = item.qysb_time == null ? 0 : (item.qysb_time / 60).toFixed(2);
                    var hgtg_time = item.hgtg_time == null ? 0 : (item.hgtg_time / 60).toFixed(2);
                    var gjtg_time = item.gjtg_time == null ? 0 : (item.gjtg_time / 60).toFixed(2);
                    var cyfj_time = item.cyfj_time == null ? 0 : (item.cyfj_time / 60).toFixed(2);
                    var shcq_time = item.shcq_time == null ? 0 : (item.shcq_time / 60).toFixed(2);
                    var gnwl_time = item.gnwl_time == null ? 0 : (item.gnwl_time / 60).toFixed(2);
                    m.bar_data.push(all_time);
                    m.bar_data.push(gjwl_time);
                    m.bar_data.push(qysb_time);
                    m.bar_data.push(hgtg_time);
                    m.bar_data.push(gjtg_time);
                    m.bar_data.push(cyfj_time);
                    m.bar_data.push(shcq_time);
                    m.bar_data.push(gnwl_time);
                    m.pie_data.push({name: '国际物流', value: gjwl_time});
                    m.pie_data.push({name: '企业申报', value: qysb_time});
                    m.pie_data.push({name: '海关放行', value: hgtg_time});
                    m.pie_data.push({name: '国检放行', value: gjtg_time});
                    m.pie_data.push({name: '查验分拣', value: cyfj_time});
                    m.pie_data.push({name: '核放出区', value: shcq_time});
                    m.pie_data.push({name: '国内物流', value: gnwl_time});
                }
                // 柱状图
                var barCharts = echarts.init(document.getElementById('c2_bar'));
                m.graph_bar(barCharts);

                // 饼状环图
                var pieCharts = echarts.init(document.getElementById('c2_pie'));
                m.graph_pie(pieCharts);
            });
        },

        queryTableData: function () {
            var start = $("[name='date_start']").val();
            var end = $("[name='date_end']").val();



            // 查询表格数据
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "c2_table", sign: webSquid.sign, ie: webSquid.ie,
                start: start,
                end: end
            }, function (rsp) {
                var parseTime = function (val) {
                    val = parseFloat(val);
                    if (isNaN(val))
                        return 0;
                    val = val / 60;
                    return val.toFixed(2);
                };

                var m = webSquid.pageModule("chart/2");
                m.table_data = [];
                for (var i = 0; i < rsp.data.length; i++) {
                    var item = rsp.data[i];
                    var tdata = {};
                    var sum_time = parseTime(item.all_atime);
                    var il_atime = parseTime(item.il_atime);
                    var er_atime = parseTime(item.er_atime);
                    var cc_atime = parseTime(item.cc_atime);
                    var cr_atime = parseTime(item.cr_atime);
                    var cs_atime = parseTime(item.cs_atime);
                    var ca_atime = parseTime(item.ca_atime);
                    var dl_atime = parseTime(item.dl_atime);
                    var para_time = (parseFloat(il_atime) + parseFloat(er_atime) + parseFloat(cc_atime) + parseFloat(cr_atime) + parseFloat(cs_atime) + parseFloat(ca_atime) + parseFloat(dl_atime)) - parseFloat(sum_time);
                    var total_time = ((parseFloat(il_atime) + parseFloat(er_atime) + parseFloat(cc_atime) + parseFloat(cr_atime) + parseFloat(cs_atime) + parseFloat(ca_atime) + parseFloat(dl_atime))).toFixed(2);

                    //tdata["cycle"] = item.year;
                    tdata["all_time"] = sum_time;
                    tdata["gjwl_time"] = il_atime;
                    tdata["qysb_time"] = er_atime;
                    tdata["hgtg_time"] = cc_atime;
                    tdata["gjtg_time"] = cr_atime;
                    tdata["cyfj_time"] = cs_atime;
                    tdata["shcq_time"] = ca_atime;
                    tdata["gnwl_time"] = dl_atime;
                    tdata["para_time"] = para_time.toFixed(2);

                    tdata["total_time"] = total_time;
                    for (var key in tdata) {
                        tdata[key + "_label"] = webSquid.translateTimeCost(tdata[key]);
                    }
                    m.table_data.push(tdata);
                }
                m.query();
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
            $("[ws-search]").unbind("click").click(function () {
                var m = webSquid.pageModule("chart/2");
                m.queryTableData();
                m.graph();
            }).click();
        },

        graph_bar: function (barCharts) {
            var option = {
                color: ['#3D94BA', '#3E9EDA', '#7DC589', '#FFC000', '#386BBE', '#F19545', '#A28BC2', '#A3CFED', '#52A64C', '#E45A0E', '#3D94BA', '#8064A2'],
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    //formatter: "{a} <br/>{b} : {c} (分钟)"
                    formatter: function (params) {
                        return params.seriesName + ": " + webSquid.translateTimeCost(params.value);
                    }
                },
                grid: {
                    left: '1%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {
                    top: '1%',
                    left: '12%',
                    data: this.bar_legend_data
                },
                xAxis: {
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
                    data: ['全环节平均用时', '各环节平均用时'],
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
                        name: '全部用时',
                        type: 'bar',
                        stack: 'B',
                        barWidth: 40,
                        data: [this.bar_data[0], 0]
                    },
                    {
                        name: '国际物流',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[1]]
                    },
                    {
                        name: '企业申报',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[2]]
                    }, {
                        name: '海关放行',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[3]]
                    },
                    {
                        name: '国检放行',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[4]]
                    },
                    {
                        name: '查验分拣',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[5]]
                    },
                    {
                        name: '核放出区',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[6]]
                    },
                    {
                        name: '国内物流',
                        type: 'bar',
                        stack: 'A',
                        barWidth: 40,
                        data: [0, this.bar_data[7]]
                    }

                ]
            };
            webSquid.graph(barCharts, option);
        },

        graph_pie: function (pieCharts) {
            var option = {
                title: {
                    text: this.pie_title
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: this.pie_legend_data
                },
                tooltip: {
                    //formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: function (params) {
                        return params.name + " " + params.percent + "% <br/>" + webSquid.translateTimeCost(params.value);
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                series: [
                    {
                        name: '总用时占比',
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
