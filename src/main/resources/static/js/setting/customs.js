/**
 * 关区代码维护
 * Created by xcp on custioms016/1custioms/09.
 */


webSquid.page.modules["setting/customs"] = webSquid.page.modules["setting/customs"] || {
        query: function () {
            var data = webSquid.serialize(".ws-query form");
            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;
            webSquid.datatable("#query-customs-table", {
                ajax: webSquid.resolve("api", url),
                ordering: false,
                columns: [
                    {data: "name", label: "关区名称"},
                    {data: "code", label: "关区代码"},
                    //{data: "type", bVisible: false, label: "业务类型"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                '<button class="btn btn-sm btn-primary" onclick="' + "javascript:webSquid.loadWorkspace('setting/customsEdit?gqid=" + row.gqid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" onclick="' + "javascript:webSquid.pageModule('setting/customs').delete(" + row.gqid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },
        delete: function (gqid, customName) {
            webSquid.confirm("确定删除当前任务 \"" + customName + "\"", "确认", function () {
                // do delete
                console.log("delete..." + gqid + " " + customName);

                webSquid.ajax("setting/customs/" + gqid, "DELETE", {gqid: gqid}, function (rsp) {
                    webSquid.pageModule('setting/customs').query();
                });

            });
        },
        /**
         * 初始化
         */
        init: function () {
            $("[ws-search]").unbind("chilck").click(this.query);
            $(".btn[ws-search]").click();
        }
    };
/**
 * 新增关区代码
 * @type {*}
 */
webSquid.page.modules["setting/customsEdit"] = webSquid.page.modules["setting/customsEdit"] || {
        back: function () {
            webSquid.page.modules["setting/customs"].query();
            webSquid.showPageQuery();//显示检索区，隐藏工作区
        },
        customsCreate: function () {
            console.log("customsCreate");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("setting/customs", "POST", formData, function (rsp) {
                webSquid.pageModule("setting/customsEdit").back();
            });
        },
        customsUpdate: function () {
            var param = webSquid.getPageParams("setting/customsEdit");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("setting/customs/" + param.gqid, "PUT", formData, function (rsp) {
                webSquid.pageModule("setting/customsEdit").back();
                webSquid.page.modules['setting/customs'].query();
            });
        },
        init: function () {
            var param = webSquid.getPageParams("setting/customsEdit");
            if (!param) {
                $("#ws-work-title").text("新建关区代码");
                $("#ws-page-apply").click(this.customsCreate);
            } else {
                $("#ws-work-title").text("编辑关区代码");
                $("#ws-page-apply").click(this.customsUpdate);
                webSquid.ajax("setting/custom/" + param.gqid, "GET", null, function (rsp) {
                    var data = rsp.data[0];
                    $("#ws-host [name='name']").val(data.name);
                    $("#ws-host [name='code']").val(data.code);
                });
            }
            $("#ws-page-back").click(this.back);
        }
    };
