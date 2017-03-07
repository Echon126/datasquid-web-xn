/**
 * 商品品类归类
 * Created by xcp on 2016/12/09.
 */
webSquid.page.modules["setting/goods"] = webSquid.page.modules["setting/goods"] || {

        query: function () {
            var data = webSquid.serialize(".ws-query form");
            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;
            webSquid.datatable("#query-goods-table", {
                ajax: webSquid.resolve("api", url),
                ordering: false,
                columns: [
                    {data: "code", label: "商品代码"},
                    {data: "name", label: "商品名称"},
                    {data: "species", label: "商品品类"},
                    {data: "type", label: "业务类型"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                '<button class="btn btn-sm btn-primary" onclick="' + "javascript:webSquid.loadWorkspace('setting/goodsEdit?spid=" + row.spid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" onclick="' + "javascript:webSquid.pageModule('setting/goods').delete(" + row.spid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },
        delete: function (spid, goodsName) {
            webSquid.confirm("确定删除当前任务 \"" + goodsName + "\"", "确认", function () {
                // do delete
                console.log("delete..." + spid + " " + goodsName);

                webSquid.ajax("setting/goods/" + spid, "DELETE",null, function (rsp) {
                    webSquid.pageModule('setting/goods').query();
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
 * 新增商品分类
 */

webSquid.page.modules["setting/goodsEdit"] = webSquid.page.modules["setting/goodsEdit"] || {
        back: function () {
            webSquid.page.modules["setting/goods"].query();
            webSquid.showPageQuery();//显示检索区，隐藏工作区
        },
        goodsCreate: function () {
            console.log("customsCreate");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("setting/goods", "POST", formData, function (rep) {
                webSquid.pageModule("setting/goodsEdit").back();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
                return;
            });
        },
        goodsUpdate: function () {
            var param = webSquid.getPageParams("setting/goodsEdit");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("setting/goods/" + param.spid, "PUT", formData, function (rsp) {
                webSquid.pageModule("setting/goodsEdit").back();
                webSquid.page.modules['setting/goods'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });
        },
        init: function () {
            var parama = webSquid.getPageParams("setting/goodsEdit");
            if (!parama) {
                $("#ws-work-title").text("新建商品分类");
                $("#ws-page-apply").click(this.goodsCreate);
            }else{
                $("#ws-work-title").text("编辑商品分类");
                $("#ws-page-apply").click(this.goodsUpdate);
                webSquid.ajax("setting/good/" + parama.spid, "GET",null, function (rsp) {
                    var data = rsp.data[0];
                    $("#ws-host [name='code']").val(data.code);
                    $("#ws-host [name='name']").val(data.name);
                    $("#ws-host [name='species']").val(data.species);
                    $("#ws-host [name='type']").val(data.type);
                });
            }
            $("#ws-page-back").click(this.back);
        }
    }