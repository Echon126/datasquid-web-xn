/**
 * 菜单管理权限
 * Created by zhangwenjie on 2017/01/23.
 */
webSquid.page.modules["auth/menu"] = webSquid.page.modules["auth/menu"] || {
        query: function () {
            var data = webSquid.serialize(".ws-query form");
            var url = $("[ws-search]").attr("ws-search");
            if (data.length > 0)
                url += "?" + data;
            webSquid.datatable("#query-menu-table", {
                ajax: webSquid.resolve("api", url),
                paging: false,
                columns: [
                    {data: "sno", label: "序号"},
                    {
                        label: "菜单名称",
                        render: function (data, type, row) {
                            var name = row["name"];
                            return '<a href="' + "javascript:webSquid.loadWorkspace('auth/menuDetail?id=" + row.mid + "');" + '">' + name + '</a>';
                        }
                    },
                    {data: "icon", label: "菜单图标"},
                    {data: "sign", label: "业务类型"},
                    {data: "ie", label: "进出口"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code;
                            var item;
                            if (row["enabled"] === 1) {
                                code =
                                    '<button class="btn btn-sm" title="可用"  onclick="' + "webSquid.page.modules['auth/menu'].iscan('" + row.mid + "','" + row.enabled + "')" + '"><i class="fa fa-toggle-on" style="color:green"></i></button> '
                            } else {
                                code =
                                    '<button class="btn btn-sm" title="不可用"  onclick="' + "webSquid.page.modules['auth/menu'].iscan('" + row.mid + "','" + row.enabled + "')" + '"><i class="fa fa-toggle-off" style="color:red"></i></button> '
                            }
                            item = '<button class="btn btn-sm btn-success" title="添加子菜单" onclick="' + "webSquid.loadWorkspace('auth/submenuEdit?pid=" + row.mid + "');" + '"><i class="fa fa-plus"></i> </button> ' +
                                '<button class="btn btn-sm btn-primary" title="菜单编辑" onclick="' + "webSquid.loadWorkspace('auth/menuEdit?id=" + row.mid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="菜单删除" onclick="' + "webSquid.page.modules['auth/menu'].delete(" + row.mid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code + item;
                        }
                    }
                ]
            });
        },
        iscan: function (id, enabled) {
            webSquid.ajax("auth/menus/" + id, "PUT", {enabled: enabled}, function (rsp) {
                webSquid.page.modules["auth/menu"].query();
            });
        },
        delete: function (id, name) {
            webSquid.confirm("确定删除菜单\"" + name + "\"", "确定", function () {
                webSquid.ajax("auth/menu/" + id, "DELETE", {id: id}, function (rsp) {
                    webSquid.page.modules['auth/menu'].query();
                });
            });
            webSquid.showPageQuery();
        },
        /**
         * 初始化页面数据
         */
        init: function () {
            $("[ws-search]").unbind("click").click(this.query);
            $(".btn[ws-search]").click();
        }
    };
/**
 * 新增、修改菜单
 */
webSquid.page.modules["auth/menuEdit"] = webSquid.page.modules["auth/menuEdit"] || {
        back: function () {
            webSquid.page.modules["auth/menu"].query();
            webSquid.showPageQuery();
        },
        //新增菜单
        menuCreate: function () {
            console.log("menuCreate");
            var formData = webSquid.serialize("#ws-host");
            var menunameId = $("#menunameId").val();
            var menutypeId = $("#menutypeId").val();
            var menuieId = $("#menuieId").val();
            if (menunameId < 0) {
                webSquid.alert("菜单名称不能为空", "提示", null, "modal-info");
                return;
            }
            if (menutypeId < 0) {
                webSquid.alert("业务类型不能为空", "提示", null, "modal-info");
                return;
            }
            if (menuieId < 0) {
                webSquid.alert("进出口不能为空", "提示", null, "modal-info");
                return;
            }
            webSquid.ajax("auth/menu", "POST", formData, function (rep) {
                webSquid.pageModule("auth/menuEdit").back();
                webSquid.page.modules['auth/menu'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");
                return;
            });
        },
        //修改菜单信息
        menuUpdate: function () {
            var params = webSquid.getPageParams("auth/menuEdit");
            var fromData = webSquid.serialize("#ws-host");
            webSquid.ajax("auth/menu/" + params.id, "PUT", fromData, function () {
                webSquid.pageModule("auth/menuEdit").back();
                webSquid.page.modules['auth/menu'].query();
            }, function (status, err, xhr) {
                webSquid.alert(chr.data, "提示", null, "modal-info");
                return;
            });
        },
        init: function () {
            var params = webSquid.getPageParams("auth/menuEdit");
            if (!params) {
                $("#ws-work-title").text("添加菜单");
                $("#ws-page-apply").click(this.menuCreate);
            } else {
                $("#ws-work-title").text("编辑菜单");
                $("#ws-page-apply").click(this.menuUpdate);
                webSquid.ajax("auth/menu/" + params.id, "GET", {id: params.id}, function (rsp) {
                    var menuData = rsp.data[0];
                    $("#ws-host [name='menuSno']").val(menuData.sno);
                    $("#ws-host [name='menuName']").val(menuData.name);
                    $("#ws-host [name='menuIcon']").val(menuData.icon);
                    $("#ws-host [name='menuType']").val(menuData.sign);
                    $("#ws-host [name='menuIe']").val(menuData.ie);
                });
            }
            $("#ws-page-back").click(this.back);
        }
    };

/**
 *初始化子菜单详细信息页面
 */
webSquid.page.modules["auth/menuDetail"] = webSquid.page.modules["auth/menuDetail"] || {
        back: function () {
            webSquid.page.modules["auth/menu"].query();
            webSquid.showPageQuery();
        },
        query: function (id) {
            var parama = webSquid.getPageParams("auth/menuDetail");
            $("#ws-work-title").text("子菜单信息");

            webSquid.datatable("#menudetail-table", {
                ajax: webSquid.resolve("api", "auth/submenu?id=" + id),
                columns: [
                    {data: "sno", label: "序号"},
                    {data: "name", label: "菜单名称"},
                    {data: "url", label: "菜单URL"},
                    {data: "icon", label: "菜单图标"},
                    {data: "sign", label: "业务类型"},
                    {data: "ie", label: "进出口"},
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code;
                            var item;
                            if (row["enabled"] === 1) {
                                code =
                                    '<button class="btn btn-sm" title="可用"  onclick="' + "webSquid.page.modules['auth/menuDetail'].iscan('" + row.mid + "','" + row.enabled + "')" + '"><i class="fa fa-toggle-on" style="color:green"></i></button> '
                            } else {
                                code =
                                    '<button class="btn btn-sm" title="不可用"  onclick="' + "webSquid.page.modules['auth/menuDetail'].iscan('" + row.mid + "','" + row.enabled + "')" + '"><i class="fa fa-toggle-off" style="color:red"></i></button> '
                            }
                            item = '<button class="btn btn-sm btn-primary" title="子菜单修改" onclick="' + "webSquid.loadWorkspace('auth/submenuEdit?id=" + row.mid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" title="子菜单删除" onclick="' + "webSquid.page.modules['auth/menu'].delete(" + row.mid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code + item;
                        }
                    }
                ]
            });
        },
        iscan: function (id, enabled) {
            var param = webSquid.getPageParams("auth/menuDetail");
            webSquid.ajax("auth/menus/" + id, "PUT", {enabled: enabled}, function (rsp) {
                webSquid.pageModule("auth/menuDetail").query(param.id);
            });
        },
        init: function () {
            var param = webSquid.getPageParams("auth/menuDetail");
            webSquid.pageModule("auth/menuDetail").query(param.id);
            $("#ws-page-back").click(this.back);
        }
    };

webSquid.page.modules["auth/submenuEdit"] = webSquid.page.modules["auth/submenuEdit"] || {
        back: function () {
            webSquid.page.modules["auth/menu"].query();
            webSquid.showPageQuery();//显示检索区，隐藏工作区
        },
        submenuCreate: function () {
            var params = webSquid.getPageParams("auth/submenuEdit");
            var id = params.id;
            var pid = params.pid;
            console.log("submenuCreate");
            var formData = webSquid.serialize("#ws-host");
            webSquid.ajax("auth/submenu/" + params.pid, "POST", formData, function (rep) {
                webSquid.pageModule("auth/submenuEdit").back();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");

            });
        },
        //修改菜单信息
        submenuUpdate: function () {
            var params = webSquid.getPageParams("auth/submenuEdit");
            var fromData = webSquid.serialize("#ws-host");
            webSquid.ajax("auth/menu/" + params.id, "PUT", fromData, function () {
                webSquid.pageModule("auth/menuEdit").back();
                webSquid.page.modules['auth/menu'].query();
            }, function (status, err, xhr) {
                webSquid.alert(xhr.data, "提示", null, "modal-info");

            });
        },
        init: function () {
            var params = webSquid.getPageParams("auth/submenuEdit");
            var pid = params.pid;
            if (typeof(pid) == "undefined") {
                $("#ws-work-title").text("编辑子菜单");
                $("#ws-page-apply").click(this.submenuUpdate);
                webSquid.ajax("auth/menu/" + params.id, "GET", {id: params.id}, function (rsp) {
                    var menuData = rsp.data[0];
                    $("#ws-host [name='menuSno']").val(menuData.sno);
                    $("#ws-host [name='menuName']").val(menuData.name);
                    $("#ws-host [name='menuUrl']").val(menuData.url);
                    $("#ws-host [name='menuIcon']").val(menuData.icon);
                    $("#ws-host [name='menuType']").val(menuData.sign);
                    $("#ws-host [name='menuIe']").val(menuData.ie);
                });
            } else {
                $("#ws-work-title").text("添加子菜单");
                $("#ws-page-apply").click(this.submenuCreate);
            }

            $("#ws-page-back").click(this.back);
        }

    };