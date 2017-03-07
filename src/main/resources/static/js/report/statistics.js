/**
 * 跨境电子商务业务统计报表
 */
webSquid.page.modules["report/statistics"] = webSquid.page.modules["report/statistics"] || {
        query: function () {
            var m = webSquid.pageModule("report/statistics");
            webSquid.datatable("#query-statistics-table", {
                ajax: webSquid.resolve("api", "/export1/query"),
                order: [1, 'desc'],
                columns: [
                    {data: "name", label: "文件名称"},
                    {data: "createTime", label: "创建时间"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                //'<button class="btn btn-sm btn-primary" title="浏览"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/statistics'].view('" + row.name + "', '" + row.url + "')" + '"><i class="fa fa-desktop"></i> </button> ' +
                                '<button class="btn btn-sm btn-success" title="下载"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/statistics'].download('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-download"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="删除"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/statistics'].delete('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-remove"></i> </button> ';
                            return code;
                        }
                    }
                ]
            });
        },
        download: function (name, sign) {
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + name;
            window.open(url);
        },
        downloadShow: function () {
            var fileName = $("#file1Name").html();
            var sign = "report1";
            if (typeof(fileName) == "undefined" || null == fileName || fileName == "") {
                webSquid.alert("无可用下载报表", "提示", null, "modal-info");
                return;
            }
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + fileName;
            window.open(url);
        },
        delete: function (name, sign) {
            webSquid.confirm("确定删除报表文件 \"" + name + "\"", "确认", function () {
                webSquid.ajax("report/removeFile", "POST", {
                    fileName: name,
                    sign: sign
                }, function (rsp) {
                    var m = webSquid.pageModule("report/statistics");
                    m.query();
                });

            });
        },
        //导出数据
        export: function () {
            var date_time = $("input[name='date_time']").val();//获取当前年度
            if (date_time.length <= 0) {
                date_time = moment(new Date()).subtract(3, 'M').startOf('year').format("YYYY-MM");
            }
            $("#statisticsBtn").attr("disabled", "disabled");
            $(".ws-query").append($('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'));
            $(".report1Data").html("");
            $("#file1Name").html("");
            webSquid.ajax("export1/download_excel1/" + date_time, "GET", null, function (rsp) {
                //刷新下载列表
                webSquid.pageModule("report/statistics").query();
                $("#statisticsBtn").removeAttr("disabled");

                $(".overlay").remove();
                // rsp.data["val4_4"] = rsp.data["val4_4"].toFixed(2);
                // rsp.data["val4_6"] = rsp.data["val4_6"].toFixed(2);
                // rsp.data["val4_16"] = rsp.data["val4_16"].toFixed(2);
                // rsp.data["val4_17"] = rsp.data["val4_17"].toFixed(2);
                for (var idx in rsp.data) {
                    $("#" + idx).html(rsp.data[idx]);
                }
                $("#reportUrl").html(document.location.protocol + "//" + webSquid.serverIp + ":" + webSquid.serverPort + "/api/report/reportDownload?sign=report1&fileName=" + $("#file1Name").html());
                $("#downloadBtn").removeAttr("disabled");
            }, function (status, err, xhr) {
                $("#statisticsBtn").removeAttr("disabled");
                $("#downloadBtn").attr("disabled", "disabled");
                $("#reportUrl").html("");
                $(".overlay").remove();
            });
        },
        init: function () {
            $("[name='date_time']").val(moment(new Date()).subtract(1, 'M').startOf('year').format("YYYY-MM"));
            $(".input-daterange").datepicker({
                language: "zh-CN",
                todayHighlight: true,
                format: 'yyyy-mm',
                autoclose: true,
                startView: 'months',
                maxViewMode: 'years',
                minViewMode: 'months'
            });
            this.query();
        }
    };
