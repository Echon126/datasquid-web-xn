/**
 * 跨境电子商务业务统计报表
 */
webSquid.page.modules["report/summary"] = webSquid.page.modules["report/summary"] || {

        query: function () {
            var m = webSquid.pageModule("report/summary");
            webSquid.datatable("#query-table", {
                ajax: webSquid.resolve("api", "/export3/query"),
                order: [1, 'desc'],
                columns: [
                    {data: "name", label: "文件名称"},
                    {data: "createTime", label: "创建时间"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                //'<button class="btn btn-sm btn-primary"  data-toggle="tooltip-disabled" title="预览" onclick="' + "javascript:webSquid.page.modules['report/summary'].download('" + row.name + "', '" + row.url + "')" + '"><i class="fa fa-desktop"></i> </button> ' +
                                '<button class="btn btn-sm btn-success"  data-toggle="tooltip-disabled" title="下载" onclick="' + "javascript:webSquid.page.modules['report/summary'].download('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-download"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger"  data-toggle="tooltip-disabled" title="删除" onclick="' + "javascript:webSquid.page.modules['report/summary'].delete('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-remove"></i> </button> ';
                            return code;
                        }
                    }
                ]
            });
        },
        //导出数据
        export: function () {
            var time = $("[name='date_time']").val();
            if (time.length <= 0) {
                time = moment(new Date()).subtract(3, 'M').startOf('year').format("YYYY-MM");
            }
            $("#summaryBtn").attr("disabled", "disabled");
            $(".ws-query").append($('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'));
            $(".report3Data").html("");
            $("#file3Name").html("");
            webSquid.ajax("export3/download_excel3", "GET", {
                time: time
            }, function (rsp) {
                //刷新下载列表
                var m = webSquid.pageModule("report/summary");
                m.query();
                $("#summaryBtn").removeAttr("disabled");

                $(".overlay").remove();
                for (var idx in rsp.data) {
                    $("#" + idx).html(rsp.data[idx]);
                }
                $("#reportUrl").text(document.location.protocol + "//" + webSquid.serverIp + ":" + webSquid.serverPort + "/api/report/reportDownload?sign=report3&fileName=" + $("#file3Name").html());
                $("#downloadBtn").removeAttr("disabled");
            }, function (status, err, xhr) {
                $("#summaryBtn").removeAttr("disabled");
                $("#downloadBtn").attr("disabled", "disabled");
                $("#reportUrl").val("");
                $(".overlay").remove();
            });
        },

        download: function (name, sign) {
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + name;
            window.open(url);
        },
        downloadShow: function () {
            var fileName = $("#file3Name").html();
            var sign = "report3";
            if (typeof(fileName) == "undefined" || null == fileName || fileName == "") {
                webSquid.alert("无可用下载报表", "提示", null, "modal-info");
                return;
            }
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + fileName;
            window.open(url);
        },
        delete: function (name, sign) {
            webSquid.confirm("确定删除报表 \"" + name + "\"", "确认", function () {
                webSquid.ajax("report/removeFile", "POST", {
                    fileName: name,
                    sign: sign
                }, function (rsp) {
                    var m = webSquid.pageModule("report/summary");
                    m.query();
                });

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
