/**
 * 跨境电子商务业务统计报表
 */
webSquid.page.modules["report/transaction02"] = webSquid.page.modules["report/transaction02"] || {
        query: function () {
            var m = webSquid.pageModule("report/transaction02");
            webSquid.datatable("#query-table", {
                ajax: webSquid.resolve("api", "/export4/query"),
                order: [1, 'desc'],
                columns: [
                    {data: "name", label: "文件名称"},
                    {data: "createTime", label: "创建时间"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                //'<button class="btn btn-sm btn-primary" title="浏览"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction02'].view('" + row.name + "', '" + row.url + "')" + '"><i class="fa fa-desktop"></i> </button> ' +
                                '<button class="btn btn-sm btn-success" title="下载"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction02'].download('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-download"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="删除"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction02'].delete('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-remove"></i> </button> ';
                            return code;
                        }
                    }
                ]
            });
        },
        //导出数据
        export: function () {
            var time = $("[name='date_time']").val();
            var custom = $("#customs02").val();
            if (time.length <= 0) {
                time = moment(new Date()).subtract(1, 'M').startOf('year').format("YYYY-MM");
            }
            $("#transaction02Btn").attr("disabled", "disabled");
            $(".ws-query").append($('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'));
            $(".report4Data").html("");
            $("#file4Name").html("");
            webSquid.ajax("export4/download_excel4", "GET", {
                time: time,
                custom: custom
            }, function (rsp) {
                var m = webSquid.pageModule("report/transaction02");
                //刷新下载列表
                m.query();
                $("#transaction02Btn").removeAttr("disabled");

                $(".overlay").remove();
                for (var idx in rsp.data) {
                    $("#" + idx).html(rsp.data[idx]);
                }
                $("#val2-1").html($("#val2").html());
                $("#val3-1").html($("#val3").html());
                $("#val16-1").html($("#val16").html());
                $("#val17-1").html($("#val17").html());
                $("#reportUrl").html(document.location.protocol + "//" + webSquid.serverIp + ":" + webSquid.serverPort + "/api/report/reportDownload?sign=report3&fileName=" + $("#file4Name").html());
                $("#downloadBtn").removeAttr("disabled");
            }, function (status, err, xhr) {
                $("#transaction02Btn").removeAttr("disabled");
                $("#reportUrl").html("");
                $("#downloadBtn").attr("disabled", "disabled");
                $(".overlay").remove();
            });
        },
        download: function (name, sign) {
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + name;
            window.open(url);
        },
        downloadShow: function () {
            var fileName = $("#file4Name").html();
            var sign = "report4";
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
                    var m = webSquid.pageModule("report/transaction02");
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
            //加载关区下拉菜单
            webSquid.ajax("report/customs", "GET", null, function (rsp) {
                var data = rsp.data;
                for (var idx in data) {
                    var name = data[idx].name;
                    var gqid = data[idx].gqid;
                    var code = data[idx].code;
                    var option = $("<option>").text(name).val(code).attr("name", gqid);
                    $("#customs02").append(option);
                }
            });
            this.query();
        }
    };
