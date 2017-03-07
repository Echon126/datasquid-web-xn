/**
 * 用户管理
 * Created by xcp on 2016/12/2.
 */

// 用户管理主页 表格
webSquid.page.modules["auth/user"] = webSquid.page.modules["auth/user"] || {
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

            webSquid.datatable("#query-user-table", {
                ajax: webSquid.resolve("api", url),
                order: [6, 'asc'],
                columns: [
                    {data: "duid", label: "ID"},
                    {data: "username", label: "姓名"},
                    {data: "account", label: "帐号"},
                    {data: "phone", label: "联系电话"},
                    {data: "company", label: "公司名称"},
                    {data: "rule", label: "权限组"},
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },

                    {
                        label: "操作",
                        render: function (data, type, row) {
                            if (row.account == 'admin') return " ";
                            var code =
                                '<button class="btn btn-sm btn-success" title="用户授权" onclick="' + "javascript:webSquid.loadWorkspace('auth/userAuth?duid=" + row.duid + "&username=" + row.username + "&account=" + row.account + "&rule=" + row.rule + "');" + '"><i class="fa fa-key"></i> </button> ' +
                                '<button class="btn btn-sm btn-primary" title="用户修改" onclick="' + "javascript:webSquid.loadWorkspace('auth/userEdit?duid=" + row.duid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-warning" title="密码重置" onclick="' + "javascript:webSquid.page.modules['auth/user'].reset(" + row.duid + ", '" + row.account + "', '" + row.username + "')" + '"><i class="fa fa-repeat"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="用户删除" onclick="' + "javascript:webSquid.page.modules['auth/user'].delete(" + row.duid + ", '" + row.username + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },

        reset: function (duid, account, name) {
            webSquid.confirm("确定将用户 \"" + name + "\" 的密码重置为：123456", "确认", function () {
                webSquid.ajax("auth/reset/" + duid, "PUT", {duid: duid, account: account}, function (rsp) {
                    if (rsp.status == 200) {
                        var result = rsp.data.result;
                        var msg = rsp.data.msg;
                        if (result) {
                            webSquid.alert(msg, "温馨提示");
                        } else {
                            webSquid.alert(msg, "错误提示");
                        }
                    } else {
                        webSquid.alert("请求错误", "错误提示")
                    }
                });
            });
        },
        delete: function (duid, name) {
            webSquid.confirm("确定删除用户 \"" + name + "\"", "确认", function () {
                webSquid.ajax("auth/user/" + duid, "DELETE", {duid: duid}, function (rsp) {
                    webSquid.page.modules['auth/user'].query();
                });

            });
        },

        init: function () {

            $(".input-daterange").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });

            $("[ws-search]").unbind("click").click(this.query).click();
        }
    };

// 用户 新增用户，修改用户
webSquid.page.modules["auth/userEdit"] = webSquid.page.modules["auth/userEdit"] || {
        back: function () {
            webSquid.page.modules.source.query();
            webSquid.showPageQuery();
        },
        userCreate: function () {
            var formData = webSquid.serialize("#ws-host");
            var account = $("#account").val();
            var password = $("#password").val();
            var rePassword = $("#rePassword").val();

            if (account.length < 3) {
                webSquid.alert("登陆帐号不得小于6位", "提示", null, "modal-info");
                return;
            }
            if (password.length < 6) {
                webSquid.alert("登陆密码不得小于6位", "提示", null, "modal-info");
                return;
            }
            if (password != rePassword) {
                webSquid.alert("2次输入密码不一致", "提示", null, "modal-info");
                return;
            }

            webSquid.ajax("auth/user", "POST", formData, function (rsp) {
                webSquid.pageModule("auth/userEdit").back();
                webSquid.page.modules['auth/user'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
                return;
            });
        },
        userUpdate: function () {
            var params = webSquid.getPageParams("auth/userEdit");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("auth/user/" + params.duid, "PUT", formData, function (rsp) {
                webSquid.pageModule("auth/userEdit").back();
                webSquid.page.modules['auth/user'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
                return;
            });
        },
        init: function () {

            var params = webSquid.getPageParams("auth/userEdit");
            if (!params) {
                $("#ws-work-title").text("添加用户");
                $("#ws-page-apply").click(this.userCreate);
                $("#ws-host [name='account-div']").show();
                $("#ws-host [name='password-div']").show();

            } else {
                $("#ws-work-title").text("编辑用户");
                $("#ws-page-apply").click(this.userUpdate);

                webSquid.ajax("auth/user/" + params.duid, "GET", {duid: params.duid}, function (rsp) {
                    var userData = rsp.data[0];
                    $("#ws-host [name='account-div']").hide();
                    $("#ws-host [name='password-div']").hide();
                    $("#ws-host [name='username']").val(userData.username);
                    $("#ws-host [name='phone']").val(userData.phone);
                    $("#ws-host [name='company']").val(userData.company);
                });
            }
            $("#ws-page-back").click(this.back);
        }
    };

// 用户 新增授权，修改授权
webSquid.page.modules["auth/userAuth"] = webSquid.page.modules["auth/userAuth"] || {
        back: function () {
            webSquid.page.modules.source.query();
            webSquid.showPageQuery();
        },
        createAuth: function () {
            var params = webSquid.getPageParams("auth/userAuth");
            var rlid = $("#authSelect").val();
            webSquid.ajax("auth/userAuth", "POST", {duid: params.duid, rlid: rlid}, function (rsp) {
                webSquid.pageModule("auth/userAuth").back();
                webSquid.page.modules['auth/user'].query();
            });
        },
        updateAuth: function () {
            var params = webSquid.getPageParams("auth/userAuth");
            var rlid = $("#authSelect").val();

            webSquid.ajax("auth/userAuth/" + params.duid, "PUT", {duid: params.duid, rlid: rlid}, function (rsp) {
                webSquid.pageModule("auth/userAuth").back();
                webSquid.page.modules['auth/user'].query();
            });
        },
        init: function () {
            var params = webSquid.getPageParams("auth/userAuth");
            $("#ws-host [name='account']").val(params.account);
            $("#ws-host [name='username']").val(params.username);
            $("#ws-host [name='rule']").val((null == params.rule || params.rule == "null") ? "无" : params.rule);
            webSquid.ajax("auth/ruleSelect/", "GET", {}, function (rsp) {
                var list = rsp.data;
                $("#authSelect").html("");
                if (null != list && list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        $("#authSelect").append("<option value='" + list[i].rlid + "'>" + list[i].name + "</option>");
                    }
                }
            });
            $("#ws-work").slideDown();
            if (null == params.rule || params.rule == "null") {
                $("#ws-work-title").text("新增授权");
                $("#ws-page-apply").click(this.createAuth);
            } else {
                $("#ws-work-title").text("修改授权");
                $("#ws-page-apply").click(this.updateAuth);
            }
            $("#ws-page-back").click(this.back);
        }
    };