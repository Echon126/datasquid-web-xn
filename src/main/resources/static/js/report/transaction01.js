/**
 * 跨境电子商务业务统计报表
 */
webSquid.page.modules["report/transaction01"] = webSquid.page.modules["report/transaction01"] || {
        query: function () {
            var date2TimestampFunc = function (value) {
                var timestamp = new Date(value).getTime();
                if (!timestamp)
                    return 0;
                return timestamp;
            };
            var data = webSquid.serialize(".ws-query form", {
                "date_time": date2TimestampFunc
            });

            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;
            webSquid.datatable("#query-table", {
                ajax: webSquid.resolve("api", url),
                paging: false,
                columns: [
                    {data: "code", label: "企业ID"},
                    {data: "name", label: "企业名称"},
                    {
                        label: "贸易额（万元）", render: function (data, type, row) {
                        var sum = row.ordersum / 10000.0;
                        return sum.toFixed(2);
                    }
                    },
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                '<button  id="transaction01Btn" class="btn btn-sm btn-success" title="导出预览" onclick="' + "javascript:webSquid.page.modules['report/transaction01'].export('" + row.name + "', '" + row.code + "')" + '"><i class="fa fa-download"></i> </button> ';
                            return code;
                        }
                    }
                ]
            });
        },
        loadHistory: function () {
            var m = webSquid.pageModule("report/transaction01");
            webSquid.datatable("#query-download-table", {
                ajax: webSquid.resolve("api", "/export2/query"),
                order: [1, 'desc'],
                columns: [
                    {data: "name", label: "文件名称"},
                    {data: "createTime", label: "创建时间"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                //'<button class="btn btn-sm btn-primary" title="浏览"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction01'].view('" + row.name + "', '" + row.url + "')" + '"><i class="fa fa-desktop"></i> </button> ' +
                                '<button class="btn btn-sm btn-success" title="下载"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction01'].download('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-download"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="删除"  data-toggle="tooltip-disabled" onclick="' + "javascript:webSquid.page.modules['report/transaction01'].delete('" + row.name + "', '" + row.sign + "')" + '"><i class="fa fa-remove"></i> </button> ';
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
        delete: function (name, sign) {
            webSquid.confirm("确定删除报表 \"" + name + "\"", "确认", function () {
                webSquid.ajax("report/removeFile", "POST", {
                    fileName: name,
                    sign: sign
                }, function (rsp) {
                    //刷新下载列表
                    var m = webSquid.pageModule("report/transaction01");
                    m.loadHistory();
                });

            });

        },
        downloadShow: function () {
            var fileName = $("#file2Name").html();
            var sign = "report2";
            if (typeof(fileName) == "undefined" || null == fileName || fileName == "") {
                webSquid.alert("无可用下载报表", "提示", null, "modal-info");
                return;
            }
            var url = "/api/report/reportDownload?sign=" + sign + "&fileName=" + fileName;
            window.open(url);
        },
        //导出数据
        export: function (name, code) {
            var time = $("[name='date_time']").val();
            var custom = $("#customs01").val();
            if (time.length <= 0) {
                time = moment(new Date()).subtract(1, 'M').startOf('year').format("YYYY-MM");
            }
            $("#transaction01Btn").attr("disabled", "disabled");
            $(".ws-query").append($('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'));
            $(".report2Data").html("");
            $("#file2Name").html("");
            webSquid.ajax("export2/download_excel2", "GET", {
                time: time,
                custom: custom,
                name: name,
                code: code
            }, function (rsp) {
                $("#preview").show();

                //刷新下载列表
                webSquid.showWorkspace();
                var m = webSquid.pageModule("report/transaction01");
                m.loadHistory();
                $("#transaction01Btn").removeAttr("disabled");
                $(".overlay").remove();
                for (var idx in rsp.data) {
                    $("#" + idx).html(rsp.data[idx]);
                }
                $("#val2-1").html($("#val2").html());
                $("#val3-1").html($("#val3").html());
                $("#val16-1").html($("#val16").html());
                $("#val17-1").html($("#val17").html());
                $("#reportUrl").html(document.location.protocol + "//" + webSquid.serverIp + ":" + webSquid.serverPort + "/api/report/reportDownload?sign=report2&fileName=" + $("#file2Name").html());
                $("#downloadBtn").removeAttr("disabled");
            }, function (status, err, xhr) {
                $("#transaction01Btn").removeAttr("disabled");
                $("#reportUrl").html("");
                $("#downloadBtn").attr("disabled", "disabled");
                $(".overlay").remove();
            });
        },
        view: function (fileName, url) {
            $("#preview").show().focus();
            $("html,body").animate({scrollTop: $("#preview").offset().top - 50}, 500);
            console.log("got file=" + fileName + " url=" + url);

        },
        back: function () {
            webSquid.page.modules["report/transaction01"].query();
            webSquid.showPageQuery();//显示检索区，隐藏工作区
        },
        init: function () {

            $("[name='date_time']").val(moment(new Date()).subtract(1, 'M').startOf('year').format("YYYY-MM"));
            $("[ws-search]").unbind("click").click(this.query);
            var date_time = $("input[name='date_time']").val();//获取当前年度
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
                    var code = data[idx].code;
                    var option = $("<option >").text(name).val(code);
                    $("#customs01").append(option);
                }
            });
            this.loadHistory();
            $("#ws-page-back").click(this.back);
            $(".btn[ws-search]").click();
        }
    };
