/**
 * Created by xcp on 2016/12/1.
 */

webSquid.page.modules["auth/rule"] = webSquid.page.modules["auth/rule"] || {
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

            webSquid.datatable("#query-rule-table", {
                ajax: webSquid.resolve("api", url),
                order: [2, 'asc'],
                columns: [
                    {data: "rlid", label: "ID"},
                    {data: "name", label: "名称"},
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {data: "description", label: "描述"},
                    {data: "count", label: "权限数"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                '<button class="btn btn-sm btn-primary" title="编辑" onclick="' + "webSquid.loadWorkspace('auth/ruleEdit?rlid=" + row.rlid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="删除" onclick="' + "webSquid.page.modules['auth/rule'].delete(" + row.rlid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },

        delete: function (rlid, name) {
            webSquid.confirm("确定删除权限组 \"" + name + "\"", "确认", function () {
                webSquid.ajax("auth/rule/" + rlid, "DELETE", {rlid: rlid}, function (rsp) {
                    webSquid.page.modules['auth/rule'].query();
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

webSquid.page.modules["auth/ruleEdit"] = webSquid.page.modules["auth/ruleEdit"] || {
        back: function () {
            webSquid.page.modules.source.query();
            webSquid.showPageQuery();
        },
        ruleCreate: function () {
            var formData = webSquid.serialize("#ws-host");
            var rule_name = $("#rule_name").val();
            if (rule_name.length < 2) {
                webSquid.alert("权限组名称不得小于2位", "提示", null, "modal-info");
                return;
            }
            webSquid.ajax("auth/rule", "POST", formData, function (rsp) {
                webSquid.pageModule("auth/ruleEdit").back();
                webSquid.page.modules['auth/rule'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });
        },
        ruleUpdate: function () {
            var params = webSquid.getPageParams("auth/ruleEdit");
            var formData = webSquid.serialize("#ws-host");
            var rule_name = $("#rule_name").val();

            if (rule_name.length < 2) {
                webSquid.alert("权限组名称不得小于2位", "提示", null, "modal-info");
                return;
            }

            webSquid.ajax("auth/rule/" + params.rlid, "PUT", formData, function (rsp) {
                webSquid.pageModule("auth/ruleEdit").back();
                webSquid.page.modules['auth/rule'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });
        },
        isCheckAll: function (btn) {
            var isChecked = $(btn).is(":checked");
            $(btn).parent().parent().parent().find("input[type='checkbox']").each(function () {
                if (isChecked) {
                    this.checked = true;
                } else {
                    this.checked = false;
                }
            });
        },
        checkParent: function (btn) {
            var parentNode = $(btn).parent().parent().find("legend input[name='rule_name']");
            var isChecked = parentNode.is(":checked");
            if (!isChecked) {
                parentNode.prop("checked", true);
            }
        },
        menuMessage: function (sub, child, datas) {
            var listHtml = '';
            if (typeof(datas) == "undefined") {
                for (var idx in sub) {
                    var count = 0;
                    var mid = sub[idx].mid;
                    var subName = sub[idx].name;
                    var subSign = sub[idx].sign;
                    var subIe = sub[idx].ie;
                    var subCode = subSign + "-" + subIe;
                    listHtml += "<fieldset style='border:1px solid silver;padding:10px;'>";
                    listHtml += "<legend style='border-bottom:0 solid silver;width: auto;margin-left: 48px; padding:10px;font-size:18px;margin-bottom: auto'>";
                    listHtml += '<label><input type="checkbox" onclick="' + "webSquid.page.modules['auth/ruleEdit'].isCheckAll(this)" + '" name="rule_name"';
                    listHtml += " value=\"" + mid + "\"/>" + subName + "(" + subCode + ")" + "</label></legend>";
                    for (var idxs in child) {
                        var pid = child[idxs].pid;
                        var childMid = child[idxs].mid;
                        var childName = child[idxs].name;
                        var childSign = child[idx].sign;
                        var childIe = child[idx].ie;
                        var childCode = childSign + "-" + childIe;
                        if (mid != pid) continue;
                        count++;
                        listHtml += '<label><input type="checkbox" name="rules_name" onclick="' + "webSquid.page.modules['auth/ruleEdit'].checkParent(this)" + '"   style="margin-left:30px"';
                        listHtml += " value=\"" + childMid + "\"/>" + childName + "(" + childCode + ")" + "</label>";
                        if (count % 4 == 0) {
                            listHtml += "</br>";
                        }
                    }
                    listHtml += "</fieldset>";
                }
            } else {
                for (var idx in sub) {
                    var count = 0;
                    var mid = sub[idx].mid;
                    var subName = sub[idx].name;
                    var subSign = sub[idx].sign;
                    var subIe = sub[idx].ie;
                    var subCode = subSign + "-" + subIe;
                    listHtml += "<fieldset style='border:1px solid silver;padding:10px;'>";
                    listHtml += "<legend style='border-bottom:0 solid silver;width: auto;margin-left: 48px; padding:10px;font-size:18px;margin-bottom: auto'>";
                    listHtml += '<label><input type="checkbox"  onclick="' + "webSquid.page.modules['auth/ruleEdit'].isCheckAll(this)" + '" name="rule_name"';
                    for (var idex in datas) {
                        var pmid = datas[idex].mid;//权限菜单表中的mid值
                        if (pmid != mid)continue;
                        listHtml += "checked";
                    }
                    listHtml += " value=\"" + mid + "\"/>" + subName + "(" + subCode + ")" + "</label></legend>";
                    for (var idxs in child) {
                        var pid = child[idxs].pid;
                        var childMid = child[idxs].mid;
                        var childName = child[idxs].name;
                        var childSign = child[idx].sign;
                        var childIe = child[idx].ie;
                        var childCode = childSign + "-" + childIe;
                        if (mid != pid) continue;
                        count++;
                        listHtml += '<label><input type="checkbox" name="rules_name"  onclick="' + "webSquid.page.modules['auth/ruleEdit'].checkParent(this)" + '" style="margin-left:30px"';
                        for (var idex in datas) {
                            var pmid = datas[idex].mid;//权限菜单表中的mid值
                            if (pmid != childMid) continue;
                            listHtml += "checked";
                        }
                        listHtml += " value=\"" + childMid + "\"/>" + childName + "(" + childCode + ")" + "</label>";
                        if (count % 4 == 0) {
                            listHtml += "</br>";
                        }
                    }
                    listHtml += "</fieldset>";
                }
            }
            $("#check").html(listHtml);
        },
        init: function () {
            var params = webSquid.getPageParams("auth/ruleEdit");
            if (!params) {
                $("#ws-work-title").text("添加权限组");
                $("#ws-page-apply").click(this.ruleCreate);
                $("#ws-work").hide();
                webSquid.ajax("auth/menulist", "GET", null, function (rsp) {
                    var data = rsp.data;
                    var sub = data.subList;//父菜单信息
                    var child = data.childList;//子菜单信息
                    webSquid.pageModule("auth/ruleEdit").menuMessage(sub, child);
                });
            } else {
                $("#ws-work-title").text("编辑权限组");
                $("#ws-page-apply").click(this.ruleUpdate);
                var clone = $(".result:first").clone();
                webSquid.ajax("auth/rule/" + params.rlid, "GET", {rlid: params.rlid}, function (rsp) {
                    var ruleData = rsp.data[0];
                    $("#ws-host [name='name']").val(ruleData.name);
                    $("#ws-host [name='description']").val(ruleData.description);
                    $("#ws-work").slideDown();
                    //加载菜单数据
                    webSquid.ajax("auth/menulist", "GET", null, function (rsp) {
                        var data = rsp.data;
                        var sub = data.subList;//父菜单信息
                        var child = data.childList;//子菜单信息
                        //初始化勾选的菜单
                        webSquid.ajax("auth/menulist/" + params.rlid, "GET", {rlid: params.rlid}, function (rsp) {
                            var datas = rsp.data;
                            webSquid.pageModule("auth/ruleEdit").menuMessage(sub, child, datas);
                        });
                    });
                });
            }
            $("#ws-page-back").click(this.back);

        }
    };