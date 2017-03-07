/**
 * 异常时效设定
 * Created by xcp on 2016/12/09.
 */
webSquid.page.modules["setting/abnormal"] = webSquid.page.modules["setting/abnormal"] || {
        //查询异常参数
        query: function () {
            var data = webSquid.serialize(".ws-query form");
            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;
            webSquid.datatable("#query-s1-table", {
                ajax: webSquid.resolve("api", url),
                ordering: false,
                paging: false,
                columns: [
                    {data: "thid", label: "ID", bVisible: false},
                    {data: "pname", label: "流程名称"},
                    {data: "sname", label: "业务类型"},
                    {data: "threshold", label: "当前异常阈值(分钟)"},
                    {
                        label: "有效期",
                        render: function (data, type, row) {
                            var item = row["starttime"] + " -- " + row["endtime"];
                            return item;
                        }
                    },
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code
                            if (row["isopen"] == "Y") {
                                code =
                                    '<button class="btn btn-sm" title="已启用，点击停用"  onclick="' + "javascript:webSquid.page.modules['setting/abnormal'].openSate('" + row.thid + "','" + row.isopen + "')" + '"><i class="fa fa-toggle-on" style="color:green"></i></button> ' +
                                    '<button class="btn btn-sm btn-primary" onclick="' + "javascript:webSquid.loadWorkspace('setting/abnormalEdit?thid=" + row.thid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                    '<button class="btn btn-sm btn-danger"  onclick="' + "javascript:webSquid.page.modules['setting/abnormal'].delete('" + row.thid + "', '" + row.pname + "')" + '"><i class="fa fa-remove"></i> </button>';
                            }
                            if (row["isopen"] == "N") {
                                code =
                                    '<button class="btn btn-sm" title="已停用，点击启用" onclick="' + "javascript:webSquid.page.modules['setting/abnormal'].openSate('" + row.thid + "','" + row.isopen + "')" + '"><i class="fa fa-toggle-off"  style="color:red"></i></button> ' +
                                    '<button class="btn btn-sm btn-primary" onclick="' + "javascript:webSquid.loadWorkspace('setting/abnormalEdit?thid=" + row.thid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                    '<button class="btn btn-sm btn-danger"  onclick="' + "javascript:webSquid.page.modules['setting/abnormal'].delete('" + row.thid + "', '" + row.pname + "')" + '"><i class="fa fa-remove"></i> </button>';
                            }
                            return code;
                        }
                    }
                ]
            });
        },
        openSate: function (thid, isopen) {
            webSquid.ajax("setting/abnormal/" + thid, "PUT", {isopen: isopen}, function (rsp) {
                webSquid.page.modules["setting/abnormal"].query();
            });
        },
        delete: function (thid, pname) {
            webSquid.confirm("确定删除当前任务 \"" + pname + "\"", "确认", function () {
                console.log("delete..." + thid + " " + pname);
                webSquid.ajax("setting/abnormal/" + thid, "DELETE", {thid: thid}, function (rsp) {
                    webSquid.page.modules["setting/abnormal"].query();
                });
            });
        },
        /**
         * 初始化页面数据
         */
        init: function () {
            $("[ws-search]").unbind("click").click(this.query);
            $(".input-daterange").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });
            webSquid.ajax("setting/service", "GET", null, function (rsp) {
                var data = rsp.data;
                for (var idx in data) {
                    var serviceName = data[idx].st_name;
                    var stId = data[idx].stid;
                    var option = $("<option >").text(serviceName).val(stId);
                    $("#selects").append(option);
                }
                $(".btn[ws-search]").click();
            });
        }
    };
/**
 * 新增阈值参数
 */
webSquid.page.modules["setting/abnormalEdit"] = webSquid.page.modules["setting/abnormalEdit"] || {
        back: function () {
            webSquid.page.modules["setting/abnormal"].query();
            webSquid.showPageQuery();//显示检索区，隐藏工作区
        },
        abnormalCreate: function () {
            var date2TimestampFunc = function (value) {
                var timestamp = new Date(value).getTime();
                if (!timestamp)
                    return 0;
                return timestamp;
            };
            console.log("paramsCreate");
            var formData = webSquid.serialize("#ws-host", {
                "date_start": date2TimestampFunc,
                "date_end": date2TimestampFunc
            });

            var threshold = $("#threshold").val();
            if (threshold == "") {
                webSquid.alert("阈值不能为空", "提示", null, "modal-info");
                return;
            }
            webSquid.ajax("setting/abnormal", "POST", formData, function (rep) {
                webSquid.pageModule("setting/abnormalEdit").back();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
                return;
            });
        },
        abnormalUpdate: function () {
            //实际范围判断
            var startTime = $("input[name='date_start']").val();
            var stampStartTime = new Date(startTime).getTime();
            var stampNowTime = new Date(new Date()).getTime();
            if (stampStartTime < stampNowTime) {
                webSquid.alert("有效时间不能小于当前时间", "提示", null, "modal-info");
                //$("input[name='date_start']").val("");
                return;
            }

            var param = webSquid.getPageParams("setting/abnormalEdit");
            var date2TimestampFunc = function (value) {
                var timestamp = new Date(value).getTime();
                if (!timestamp)
                    return 0;
                return timestamp;
            };
            console.log("abnormalUpdate");
            var formData = webSquid.serialize("#ws-host", {
                "date_start": date2TimestampFunc,
                "date_end": date2TimestampFunc
            });
            webSquid.ajax("setting/abnormals/" + param.thid, "PUT", formData, function (rsp) {
                webSquid.pageModule("setting/abnormalEdit").back();
                webSquid.page.modules['setting/abnormal'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });
        },
        endTimeSet: function (btn) {
            var startTime = $("input[name='date_start']").val();
            var stampStartTime = new Date(startTime).getTime();
            var endTime = $(btn).val();
            var stampEndTime = new Date(endTime).getTime();
            if (stampEndTime < stampStartTime) {
                webSquid.alert("开始时间不能大于结束时间", "提示", null, "modal-info");
                $("input[name='date_end']").val("");
                return;
            }
        },
        init: function () {
            //加载业务类型的下拉菜单
            webSquid.ajax("setting/service", "GET", null, function (rsp) {
                var data = rsp.data;
                for (var idx in data) {
                    var serviceName = data[idx].st_name;
                    var stId = data[idx].stid;
                    var option = $("<option >").text(serviceName).val(stId);
                    $("#service").append(option);
                }
            });
            //加载环节名称的下拉菜单
            webSquid.ajax("setting/link", "GET", null, function (rsp) {
                var data = rsp.data;
                for (var idx in data) {
                    var linkName = data[idx].ln_name;
                    var lnId = data[idx].lnid;
                    var option = $("<option >").text(linkName).val(lnId);
                    $("#link").append(option);
                }
            });
            var param = webSquid.getPageParams("setting/abnormalEdit");
            if (!param) {
                $("#ws-work-title").text("业务阈值设定");
                $("#ws-page-apply").click(this.abnormalCreate);
            } else {
                $("#ws-work-title").text("业务阈值编辑");
                $("#ws-page-apply").click(this.abnormalUpdate);
                webSquid.ajax("setting/abnormals/" + param.thid, "GET", null, function (rsp) {
                    var data = rsp.data[0];
                    $("#ws-host [name='ywlx']").val(data.stid);
                    $("#ws-host [name='hjmc']").val(data.lnid);
                    $("#ws-host [name='threshold']").val(data.threshold);
                    $("#ws-host [name='date_start']").val(data.start_validity_time);
                    $("#ws-host [name='date_end']").val(data.end_validity_time);
                    $("#ws-host [name='isopen']").removeAttr("checked");
                    if (data.isopen == 'Y')
                        $("#ws-host [name='isopen']").attr("checked", "checked");

                });
            }
            $("#ws-page-back").click(this.back);

            $(".input-daterange").datepicker({
                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd",
                startDate: new Date(),
                todayBtn: true,
                autoclose: true
            });
        }
    }