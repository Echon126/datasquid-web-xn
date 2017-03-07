/**
 * Created by shixu on 16-12-9.
 */

/**
 * 数据源列表
 */
webSquid.page.modules["source"] = webSquid.page.modules["source"] || {
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

            webSquid.datatable("#query-table", {
                ajax: webSquid.resolve("api", url),
                order: [7, 'desc'],
                columns: [
                    {data: "shid", label: "ID"},
                    {data: "name", label: "名称"},
                    {data: "type", label: "类型"},
                    {data: "table_count", label: "表数量"},
                    {data: "host", label: "主机"},
                    {data: "database_name", label: "数据库"},
                    {data: "account", label: "账号"},
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {data: "description", label: "描述"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var codeRefresh = "javascript:webSquid.pageModule('source').refreshTables(" + row.shid +", this);";
                            var codeView = "javascript:webSquid.loadWorkspace('source/table?shid=" + row.shid + "');";
                            var codeEdit = "javascript:webSquid.loadWorkspace('source/host?shid=" + row.shid + "');";
                            var codeDelete = "javascript:webSquid.pageModule('source').delete(" + row.shid + ", '" + row.name + "')";
                            var code =
                                '<button class="btn btn-sm btn-warning" onclick="' + codeRefresh + '"><i class="fa fa-refresh"></i> </button> ' +
                                '<button class="btn btn-sm btn-success" onclick="' + codeView + '"><i class="fa fa-tasks"></i> </button> ' +
                                '<button class="btn btn-sm btn-primary" onclick="' + codeEdit + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" onclick="' + codeDelete + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },
        delete: function (shid, name) {
            webSquid.confirm("确定删除当前数据源 \"" + name + "\"", "确认", function () {
                webSquid.ajax("data/source/host/" + shid, "DELETE", {shid: shid}, function (rsp) {
                    webSquid.pageModule('source').query();
                });

            });
        },
        refreshTables: function (shid,btn) {
            $(btn).attr("disabled","disabled");
            webSquid.ajax("data/source/host/" + shid + "/refresh", "PUT", null, function (rsp) {
                console.log(rsp);
                webSquid.pageModule("source").query();
                $(btn).removeAttr("disabled");
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

/**
 * 数据源库编辑
 */
webSquid.page.modules["source/host"] = webSquid.page.modules["source/host"] || {
        back: function () {
            webSquid.pageModule('source').query();
            webSquid.showPageQuery();
        },
        create: function () {
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("data/source/host", "POST", formData, function (rsp) {
                // webSquid.loadWorkspace("source/host?shid=" + rsp.data.shid);
                webSquid.pageModule("source/host").back();
            });
        },
        update: function () {
            var params = webSquid.getPageParams("source/host");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("data/source/host/" + params.shid, "PUT", formData, function (rsp) {
                webSquid.pageModule("source/host").back();
            });

        },
        init: function () {

            var params = webSquid.getPageParams("source/host");
            if (!params) {
                $("#ws-work-title").text("添加数据源");
                $("#ws-page-apply").click(this.create);
                $("#ws-work").hide();

            } else {
                $("#ws-work-title").text("编辑数据源");
                $("#ws-page-apply").click(this.update);

                webSquid.ajax("data/select", "GET", {sql: "SELECT * FROM ds_source_host WHERE shid=" + params.shid}, function (rsp) {
                    var data = rsp.data[0];
                    $("#ws-work").slideDown();

                    $("#ws-host [name='name']").val(data.name);
                    $("#ws-host [name='type']").val(data.type);
                    $("#ws-host [name='account']").val(data.account);
                    $("#ws-host [name='password']").val(data.password);
                    $("#ws-host [name='host']").val(data.host);
                    $("#ws-host [name='database']").val(data.database_name);
                    $("#ws-host [name='description']").val(data.description);

                });

            }

            $("#ws-page-back").click(this.back);

        }
    };

/**
 * 数据源表查看
 */
webSquid.page.modules["source/table"] = webSquid.page.modules["source/table"] || {
        back: function () {
            webSquid.pageModule('source').query();
            webSquid.showPageQuery();
        },
        tableSchema: function (shid, stid) {
            webSquid.ajax("data/source/host/" + shid + "/table/" + stid, "GET", {stid: stid}, function (rsp) {
                editAreaLoader.init({
                    id: "ws-code",
                    language: "zh",
                    syntax: "sql",
                    start_highlight: true,
                    font_size: 12,
                    replace_tab_by_spaces: 4,
                    toolbar: "",
                    min_height: "400",
                    is_editable: false
                });
                editAreaLoader.setValue("ws-code", rsp.data);

            });
        },
        init: function () {

            var params = webSquid.getPageParams("source/table");
            $("#ws-work-title").text("查看数据源表");

            webSquid.ajax("data/select", "GET", {sql: "SELECT * FROM ds_source_host WHERE shid=" + params.shid}, function (rsp) {
                var data = rsp.data[0];
                $("#ws-work").slideDown();

                $("#ws-table [name='name']").val(data.name);
                $("#ws-table [name='type']").val(data.type);
                $("#ws-table [name='account']").val(data.account);
                $("#ws-table [name='host']").val(data.host);
                $("#ws-table [name='database']").val(data.database_name);
                $("#ws-table [name='description']").val(data.description);

            });

            webSquid.datatable("#source-tables", {
                ajax: webSquid.resolve("api", "data", "source", "host", params.shid, "table"),
                order: [3, 'desc'],
                columns: [
                    {data: "stid", label: "ID"},
                    {data: "name", label: "逻辑表名"},
                    {data: "table_name", label: "物理表名"},
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var codeView = "javascript:webSquid.pageModule('source/table').tableSchema(" + row.shid + "," + row.stid + ");";
                            return '<button class="btn btn-sm btn-success" onclick="' + codeView + '"><i class="fa fa-tasks"></i> </button> ';
                        }
                    }
                ]
            });

            $("#ws-page-back").click(this.back);

        }
    };