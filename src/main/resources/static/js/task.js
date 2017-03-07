/**
 * Created by ShiXu on 2016/11/16.
 */

/**
 * 任务列表
 */
webSquid.page.modules["task"] = webSquid.page.modules["task"] || {
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
                    {data: "tid", label: "ID"},
                    {
                        label: "触发类型",
                        render: function (data, type, row) {
                            return row.trigger_type == 1 ? "时间" : (row.trigger_type == 2 ? "数据" : "-");
                        }
                    },
                    {data: "name", label: "名称"},
                    {
                        label: "间隔时间",
                        render: function (dataSet, type, row) {
                            if (row.trigger_interval <= 0)
                                return "-";
                            var data = moment(row.trigger_interval * 1000);
                            var ori = moment(0);
                            var month = data.month() - ori.month();
                            var day = data.day() - ori.day();
                            var hour = data.hour() - ori.hour();
                            var minute = data.minute() - ori.minute();
                            var second = data.second() - ori.second();
                            var result = "";
                            result += month > 0 ? month + "个月 " : "";
                            result += day > 0 ? day + "天 " : "";
                            result += hour > 0 ? hour + "小时 " : "";
                            result += minute > 0 ? minute + "分 " : "";
                            result += second > 0 ? second + "秒 " : "";
                            return result;
                        }
                    },
                    {
                        label: "开始日期",
                        render: function (data, type, row) {
                            if (row.start_time <= 0)
                                return "-";
                            return moment(row.start_time).format("YYYY-MM-DD");
                        }
                    },
                    {
                        label: "终止日期",
                        render: function (data, type, row) {
                            if (row.stop_time <= 0)
                                return "-";
                            return moment(row.stop_time).format("YYYY-MM-DD");
                        }
                    },
                    {
                        label: "选项",
                        render: function (data, type, row) {
                            return row.options == 0 ? "" : "独占";
                        }
                    },
                    {
                        label: "状态",
                        render: function (data, type, row) {
                            return row.status == 0 ? "已停用" : "已启用";
                        }
                    },
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: "操作",
                        render: function (data, type, row) {
                            var code =
                                '<button class="btn btn-sm btn-primary" onclick="' + "javascript:webSquid.loadWorkspace('task/edit?tid=" + row.tid + "');" + '"><i class="fa fa-edit"></i> </button> ' +
                                '<button class="btn btn-sm btn-danger" onclick="' + "javascript:webSquid.pageModule('task').delete(" + row.tid + ", '" + row.name + "')" + '"><i class="fa fa-remove"></i> </button>';
                            return code;
                        }
                    }
                ]
            });
        },
        delete: function (tid, taskName) {
            webSquid.confirm("确定删除当前任务 \"" + taskName + "\"", "确认", function () {
                // do delete
                console.log("delete..." + tid + " " + taskName);

                webSquid.ajax("data/task/" + tid, "DELETE", {tid: tid}, function (rsp) {
                    webSquid.pageModule('task').query();
                });

            });
        },
        init: function () {
            $("[ws-search]").unbind("click").click(this.query);

            $(".input-daterange").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });

            $(".btn[ws-search]").click();
        }
    };

/**
 * 任务编辑
 */
webSquid.page.modules["task/edit"] = webSquid.page.modules["task/edit"] || {
        back: function () {
            webSquid.page.modules.task.query();
            webSquid.showPageQuery();
        },
        taskCreate: function () {
            console.log("taskCreate");

            var formData = webSquid.serialize("#ws-task", {
                "start_time": function (data) {
                    var val = parseInt(data);
                    return val == 0 ? 0 : new Date(data).getTime();
                },
                "stop_time": function (data) {
                    var val = parseInt(data);
                    return val == 0 ? 0 : new Date(data).getTime();
                }
            });
            webSquid.ajax("data/task", "POST", formData, function (rsp) {
                webSquid.loadWorkspace("task/edit?tid=" + rsp.data.tid);
            });

        },
        taskUpdate: function () {
            console.log("taskUpdate");

            var params = webSquid.getPageParams("task/edit");

            var formData = webSquid.serialize("#ws-task", {
                "start_time": function (data) {
                    var val = parseInt(data);
                    return val == 0 ? 0 : new Date(data).getTime();
                },
                "stop_time": function (data) {
                    var val = parseInt(data);
                    return val == 0 ? 0 : new Date(data).getTime();
                }
            });
            formData += "&tid=" + params.tid;
            webSquid.ajax("data/task/" + params.tid, "PUT", formData, function (rsp) {
                webSquid.pageModule("task/edit").back();
            });

        },
        datagramNodeClick: function (params) {

            console.log(params);
            if (params.nodes.length == 0)
                return;

            var nodeId = params.nodes[0];
            var idVal = nodeId.split("-")[1];

            if (nodeId.startsWith("sid-"))
                webSquid.loadBlock("task/script?sid=" + idVal, "#ws-property");
            if (nodeId.startsWith("rid-"))
                webSquid.loadBlock("task/result?rid=" + idVal, "#ws-property");
            if (nodeId.startsWith("tsid-"))
                webSquid.loadBlock("task/source?tsid=" + idVal, "#ws-property");
            if (nodeId.startsWith("q-"))
                webSquid.loadBlock("task/queue?qname=" + idVal, "#ws-property");

        },
        buildDatagram: function () {
            var params = webSquid.getPageParams("task/edit");

            webSquid.ajax("data/task/" + params.tid + "/", "GET", null, function (rsp) {

                if (webSquid.pageModule("task/edit").datagram != null) {
                    webSquid.pageModule("task/edit").datagram.destroy();
                    webSquid.pageModule("task/edit").datagram = null;
                }

                var queueObj = {};
                var nodeArr = [];
                var edgeArr = [];
                var item, idx, jdx, queueName;
                for (idx in rsp.data.script) {
                    item = rsp.data.script[idx];
                    nodeArr.push({id: "sid-" + item.sid, label: item.name, shape: 'icon', group: "script"});

                    // 取得引用源队列的脚本集合
                    var srcQueues = item.code.match(/src\.q\("([\w])+"\)/ig);
                    if (srcQueues != null) {
                        for (jdx in srcQueues) {
                            queueName = srcQueues[jdx];
                            queueName = queueName.substring(7, queueName.length - 2);
                            if (queueObj[queueName])
                                queueObj[queueName].src.push(item.sid);
                            else
                                queueObj[queueName] = {src: [item.sid], rst: []};
                        }
                    }
                    // 取得引用结果队列的脚本集合
                    var rstQueues = item.code.match(/rst\.q\("([\w])+",/ig);
                    if (rstQueues != null) {
                        for (jdx in rstQueues) {
                            queueName = rstQueues[jdx];
                            queueName = queueName.substring(7, queueName.length - 2);
                            if (queueObj[queueName])
                                queueObj[queueName].rst.push(item.sid);
                            else
                                queueObj[queueName] = {rst: [item.sid], src: []};
                        }
                    }
                }

                for (idx in rsp.data.result) {
                    item = rsp.data.result[idx];
                    nodeArr.push({id: "rid-" + item.rid, label: item.name, shape: 'icon', group: "result"});
                    edgeArr.push({from: "sid-" + item.sid, to: "rid-" + item.rid, arrows: "to"});
                }
                var jdx, regName, regex, script;
                for (idx in rsp.data.source) {
                    item = rsp.data.source[idx];

                    // build edgeArr
                    for (jdx in rsp.data.script) {
                        script = rsp.data.script[jdx];
                        regName = item.name.replace("_", "\\_");
                        regex = new RegExp("(" + regName + "[^\w])");
                        if (regex.test(script.code)) {
                            edgeArr.push({to: "sid-" + script.sid, from: "tsid-" + item.tsid, arrows: "to"});
                        }
                    }
                    nodeArr.push({id: "tsid-" + item.tsid, label: item.name, shape: 'icon', group: "source"});
                }

                for (idx in queueObj) {
                    item = queueObj[idx];
                    nodeArr.push({id: "q-" + idx, label: idx, shape: 'icon', group: 'queue'});
                    for (jdx in item.src) {
                        var sid = item.src[jdx];
                        edgeArr.push({from: "q-" + idx, to: "sid-" + sid, arrows: "to"});
                    }

                    for (jdx in item.rst) {
                        var sid = item.rst[jdx];
                        edgeArr.push({from: "sid-" + sid, to: "q-" + idx, arrows: "to"});
                    }
                }

                var data = {
                    nodes: new vis.DataSet(nodeArr),
                    edges: new vis.DataSet(edgeArr)
                };
                var network = new vis.Network($("#ws-workflow")[0], data, {
                    autoResize: true,
                    height: '430px',
                    width: '100%',
                    nodes: {shadow: true},
                    groups: {
                        source: {
                            shape: "icon",
                            icon: {
                                face: 'FontAwesome',
                                code: "\uf0ce",
                                size: 50,
                                color: '#09C'
                            }
                        },
                        script: {
                            shape: "icon",
                            icon: {
                                face: 'FontAwesome',
                                code: "\uf085",
                                size: 50,
                                color: '#666'
                            }
                        },
                        result: {
                            shape: "icon",
                            icon: {
                                face: 'FontAwesome',
                                code: "\uf1c0",
                                size: 50,
                                color: '#f60'
                            }
                        },
                        queue: {
                            shape: "icon",
                            icon: {
                                face: 'FontAwesome',
                                code: "\uf0ec",
                                size: 50,
                                color: '#6f0'
                            }
                        }
                    },
                    layout: {
                        // hierarchical: {
                        // sortMethod: "directed"
                        // }
                    }
                });
                network.on("click", webSquid.pageModule("task/edit").datagramNodeClick);
                webSquid.pageModule("task/edit").datagram = network;
            });

        },
        loadDatasource: function () {

            webSquid.popup("task/sources", "选择数据源", function () {
                var taskData = webSquid.getPageParams("task/edit");
                if ($("[name='sourceTable']:checked").length == 0)
                    return;
                var params = $("[name='sourceTable']:checked").serialize();
                webSquid.ajax("data/task/" + taskData.tid + "/source", "POST", params, function (rsp) {
                    webSquid.pageModule("task/edit").buildDatagram();
                });
            });

        },
        loadScript: function () {
            console.log("loadScript");
        },
        newScript: function () {
            console.log("newScript");
            webSquid.loadBlock("task/script", "#ws-property");
        },
        scriptUpdated: function () {
            $("#ws-property").html("");

            webSquid.pageModule("task/edit").buildDatagram();

        },
        init: function () {

            var params = webSquid.getPageParams("task/edit");
            if (!params) {
                $("#ws-work-title").text("新建任务");
                $("#ws-page-apply").click(this.taskCreate);
                $("#ws-workspace .panel-body,.edit-buttons").hide();

                $("[name='start_time']").val(moment().format("YYYY-MM-DD"));

            } else {
                $("#ws-work-title").text("编辑任务");
                $("#ws-page-apply").click(this.taskUpdate);
                // init form control
                // ...
                webSquid.ajax("data/select", "GET", {sql: "SELECT * FROM ds_task WHERE tid=" + params.tid}, function (rsp) {
                    var taskData = rsp.data[0];

                    $("#ws-workspace [name='trigger_type'][value='" + taskData.trigger_type + "']").click();
                    $("#ws-workspace [name='name']").val(taskData.name);
                    $("#ws-workspace [name='trigger_interval']").val(taskData.trigger_interval);
                    $("#ws-workspace [name='start_time']").val(taskData.start_time == 0 ? 0 : moment(taskData.start_time).format("YYYY-MM-DD"));
                    $("#ws-workspace [name='stop_time']").val(taskData.stop_time == 0 ? 0 : moment(taskData.stop_time).format("YYYY-MM-DD"));
                    $("#ws-workspace [name='options'][value='" + taskData.options + "']").click();
                    if (taskData.status == 1)
                        $("#ws-workspace [name='status']").attr("checked", "checked");
                    webSquid.pageModule("task/edit").buildDatagram();
                });

            }

            $("#ws-page-back").click(this.back);
            $("#ws-load-datasource").click(this.loadDatasource);
            $("#ws-load-script").click(this.loadScript);
            $("#ws-new-script").click(this.newScript);

            $("[name='stop_time'],[name='start_time']").datepicker({

                language: "zh-CN",
                todayHighlight: true,
                format: "yyyy-mm-dd"
            });

        }

    };

/**
 * 脚本编辑
 */
webSquid.page.modules["task/script"] = webSquid.page.modules["task/script"] || {
        resultAdd: function (btn) {
            var clone = webSquid.pageModule("task/script").resultTemplate.clone();
            clone.find(".remove").show();
            clone.find("input,textarea").each(function () {
                $(this).val("");
            });
            $(".code").before(clone);
        },
        resultRemove: function (btn) {
            var formGroup = $(btn).parent().parent().parent();
            if (!formGroup.is("[rid]")) {
                formGroup.detach();
                return;
            }

            var rid = formGroup.attr("rid");

            webSquid.confirm("确认删除所选结果表？已写入表内的数据将一并被删除。", "确认", function () {
                webSquid.ajax("data/result/" + rid, "DELETE", null, function (rsp) {

                    var scriptData = webSquid.getPageParams("task/script");
                    webSquid.loadBlock("task/script?sid=" + scriptData.sid, "#ws-property");
                });
            });
        },
        create: function () {
            console.log("btn btn-sm create");
            $("#ws-property-apply").attr("disabled", "disabled");

            var taskData = webSquid.getPageParams("task/edit");
            var formData = webSquid.serialize("#ws-script", {
                "code": function (value) {
                    return editAreaLoader.getValue("code");
                },
                "frame_code": function () {
                    return "";
                }
            });
            formData += "&tid=" + taskData.tid + "&result_code=";

            var scriptname = $("#scriptname").val();
            if (undefined == scriptname || "" == scriptname || null == scriptname) {
                webSquid.alert("脚本名称不可为空", "提示", null, "modal-info");
                $("#ws-property-apply").removeAttr("disabled");
                return;
            }

            // 结果表名称 遍历校验重复
            var result_name = [];
            var resultTableNames = $("input[name='result_name']");
            for (var i = 0; i < resultTableNames.length; i++) {
                result_name[i] = $(resultTableNames[i]).val();
            }

            if (/(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + result_name.join("\x0f\x0f") + "\x0f")) {
                webSquid.alert("结果表名称不可重复", "提示", null, "modal-info");
                $("#ws-property-apply").removeAttr("disabled");
                return;
            }


            webSquid.ajax("data/script", "POST", formData, function (rsp) {


                $("#ws-property-apply").removeAttr("disabled");
                webSquid.pageModule("task/edit").buildDatagram();
                console.log(rsp);
                console.log("sql=");
                console.log(rsp.data.sql);
                if (!rsp.data.sql) {
                    webSquid.alert("脚本数据保存成功,但结果表创建失败", "提示", null, "modal-info");
                } else {
                    webSquid.alert("已保存成功", "提示", null, "modal-info");
                }


            }, function (status, err, xhr) {
                $("#ws-property-apply").removeAttr("disabled");

                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });

        },
        update: function () {
            console.log("btn btn-sm update");
            $("#ws-property-apply").attr("disabled", "disabled");

            var taskData = webSquid.getPageParams("task/edit");
            var scriptData = webSquid.getPageParams("task/script");
            var formData = webSquid.serialize("#ws-script", {
                "code": function (value) {
                    return editAreaLoader.getValue("code");
                },
                "frame_code": function () {
                    return "";
                },
                "result_name": function (value, ele) {
                    if ($(ele).is("[rid]"))
                        return null;
                    return value;
                },
                "result_code": function (value, ele) {
                    if ($(ele).is("[rid]"))
                        return null;
                    return value;
                }
            });
            formData += "&tid=" + taskData.tid + "&result_code=";

            var scriptname = $("#scriptname").val();
            if (undefined == scriptname || "" == scriptname || null == scriptname) {
                webSquid.alert("脚本名称不可为空", "提示", null, "modal-info");
                $("#ws-property-apply").removeAttr("disabled");
                return;
            }

            // 结果表名称 遍历校验重复
            var result_name = [];
            var resultTableNames = $("input[name='result_name']");
            for (var i = 0; i < resultTableNames.length; i++) {
                result_name[i] = $(resultTableNames[i]).val();
            }

            if (/(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + result_name.join("\x0f\x0f") + "\x0f")) {
                webSquid.alert("结果表名称不可重复", "提示", null, "modal-info");
                $("#ws-property-apply").removeAttr("disabled");
                return;
            }


            webSquid.ajax("data/script/" + scriptData.sid, "PUT", formData, function (rsp) {
                $("#ws-property-apply").removeAttr("disabled");
                webSquid.pageModule("task/edit").buildDatagram();
                webSquid.alert("已保存", "提示", null, "modal-info");
            }, function (status, err, xhr) {
                $("#ws-property-apply").removeAttr("disabled");
                webSquid.alert(xhr.data, "提示", null, "modal-info");
            });

        },
        delete: function () {
            console.log("btn btn-sm delete");

            var scriptId = $("[name='sid']").val();
            if (scriptId > 0) {
                webSquid.confirm("确认删除当前脚本？", null, function () {
                    // do script delete
                    webSquid.ajax("data/script/" + scriptId, "DELETE", null, function (rsp) {
                        webSquid.pageModule("task/edit").scriptUpdated();
                    });
                });
            } else {
                webSquid.confirm("脚本还未保存，确认删除？", null, function () {
                    webSquid.pageModule("task/edit").scriptUpdated();
                });
            }
        },
        init: function () {

            var params = webSquid.getPageParams("task/script");
            console.log("task/script init with params=" + JSON.stringify(params));

            var clone = $(".result:first").clone();
            if (clone.length > 0) {
                webSquid.pageModule("task/script").resultTemplate = clone;
            }

            if (!params) {
                $("#ws-property-apply").unbind("click").click(this.create);

                editAreaLoader.init({
                    id: "code",
                    language: "zh",
                    syntax: $("[name='type']:checked").val().toLowerCase(),
                    start_highlight: true,
                    font_size: 12,
                    replace_tab_by_spaces: 4
                });

                $("#ws-property [name='name']").focus();
            } else {
                // init form control
                $("#ws-property-apply").unbind("click").click(this.update);

                webSquid.ajax("data/script/" + params.sid, "GET", null, function (rsp) {
                    var script = rsp.data.script[0];
                    $("#ws-script [value='" + script.type + "']").click();
                    $("#ws-script [name='name']").val(script.name);
                    $("#ws-script [name='sid']").val(script.sid);
                    editAreaLoader.init({
                        id: "code",
                        language: "zh",
                        syntax: $("[name='type']:checked").val().toLowerCase(),
                        start_highlight: true,
                        font_size: 12,
                        replace_tab_by_spaces: 4
                    });
                    editAreaLoader.setValue("code", script.code);
                    $("#ws-property [name='name']").focus();

                    var results = rsp.data.result;
                    var result;
                    var clone;
                    for (var idx in results) {
                        result = results[idx];
                        clone = webSquid.pageModule("task/script").resultTemplate.clone();
                        clone.find(".remove").show();
                        if (idx == 0) {
                            $(".result").attr("rid", result.rid);
                            $(".result [name='result_name']").val(result.name).attr("rid", result.rid);//.attr("disabled", "disabled");
                            $(".result [name='result_code']").val(result.code).attr("rid", result.rid);//.attr("disabled", "disabled");
                            continue;
                        }

                        $(".result:last").after(clone);
                        $(".result:last").attr("rid", result.rid);
                        $(".result:last [name='result_name']").val(result.name).attr("rid", result.rid);//.attr("disabled", "disabled");
                        $(".result:last [name='result_code']").val(result.code).attr("rid", result.rid);//.attr("disabled", "disabled");

                    }

                });

            }

            $("#ws-property-delete").unbind("click").click(this.delete);
        }
    };

/**
 * 数据源信息
 */
webSquid.page.modules["task/source"] = webSquid.page.modules["task/source"] || {
        apply: function () {
            var params = webSquid.getPageParams("task/source");
            var sqlCondition = $("#sql_condition").val();
            webSquid.ajax("data/task/source/" + params.tsid, "PUT", {sql_condition: sqlCondition}, function (rsp) {
                webSquid.loadBlock("task/source?tsid=" + webSquid.getPageParams("task/source").tsid, "#ws-property");
            });
        },
        delete: function () {
            var params = webSquid.getPageParams("task/source");
            var edges = webSquid.pageModule("task/edit").datagram.getSelectedEdges();
            if (edges.length > 0) {
                webSquid.alert("当前数据源正在被使用，不能删除！");
                return;
            }

            webSquid.ajax("data/task/source/" + params.tsid, "DELETE", null, function (rsp) {
                webSquid.pageModule("task/edit").scriptUpdated();
            });
        },
        init: function () {
            var params = webSquid.getPageParams("task/source");
            webSquid.ajax("data/task/source/" + params.tsid, "GET", null, function (rsp) {
                var sourceItem = rsp.data.source;
                var previewData = rsp.data.preview;

                $("#host").text(sourceItem.host);
                $("#host_type").text(sourceItem.type);
                $("#host_user").text(sourceItem.user);
                $("#database").text(sourceItem.database);
                $("#create_time").text(moment(sourceItem.create_time).format("YYYY-MM-DD HH:mm:ss"));
                $("#name").text(sourceItem.name);
                $("#table_name").text(sourceItem.table_name);
                $("#account").text(sourceItem.account);
                $("#sql_condition").val(sourceItem.sql_condition);

                var columnsData = [];
                if (previewData.length > 0) {
                    for (var column in previewData[0]) {
                        if (column == "ds_row_number")
                            continue;
                        columnsData.push({
                            data: column, label: column, render: function (data, type, row) {

                                if (data == null)
                                    return "[null]";
                                if (typeof data == "string") {
                                    if (data.length > 30)
                                        return $("<textarea/>").attr("readonly", "readonly").addClass("form-control").text(data)[0].outerHTML;
                                    if (data.length == 0)
                                        return "[empty]";
                                    return $('<div/>').text(data).html()
                                }

                                if (/^(\d{13})$/.test(data)) {
                                    return moment(data).format("YYYY-MM-DD HH:mm:ss");
                                }

                                return data;
                            }
                        });
                    }
                } else {
                    previewData = null;
                    columnsData = [{label: "无数据", data: null}];
                }
                webSquid.datatable("#preview", {
                    paging: false,
                    searching: false,
                    sort: false,
                    data: previewData,
                    columns: columnsData
                });
            });

            $("#ws-property-apply").unbind("click").click(this.apply);
            $("#ws-property-delete").unbind("click").click(this.delete);
        }
    };

/**
 * 数据结果信息
 */
webSquid.page.modules["task/result"] = webSquid.page.modules["task/result"] || {
        init: function () {
            var params = webSquid.getPageParams("task/result");
            webSquid.ajax("data/task/result/" + params.rid, "GET", null, function (rsp) {
                var resultItem = rsp.data.result;
                var previewData = rsp.data.preview;

                $("#create_time").text(moment(resultItem.create_time).format("YYYY-MM-DD HH:mm:ss"));
                $("#name").text(resultItem.name);
                $("#table_name").text(resultItem.table_name);

                var columnsData = [];
                if (previewData.length > 0) {
                    for (var column in previewData[0]) {
                        columnsData.push({
                            data: column, label: column, render: function (data, type, row) {

                                if (data == null)
                                    return "[null]";
                                if (typeof data == "string") {
                                    if (data.length > 30)
                                        return $("<textarea/>").attr("readonly", "readonly").addClass("form-control").text(data)[0].outerHTML;
                                    if (data.length == 0)
                                        return "[empty]";
                                    return $('<div/>').text(data).html()
                                }

                                if (/^(\d{13})$/.test(data)) {
                                    return moment(data).format("YYYY-MM-DD HH:mm:ss");
                                }

                                return data;
                            }
                        });
                    }
                } else {
                    previewData = null;
                    columnsData = [{label: "无数据", data: null}];
                }
                webSquid.datatable("#preview", {
                    paging: false,
                    searching: false,
                    sort: false,
                    data: previewData,
                    columns: columnsData
                });

            });

            $("#ws-property-delete").unbind("click").click(this.delete);
        }
    };

/**
 * 队列信息
 */
webSquid.page.modules["task/queue"] = webSquid.page.modules["task/queue"] || {
        init: function () {
            var params = webSquid.getPageParams("task/queue");
            webSquid.ajax("data/task/queue/" + params.qname, "GET", null, function (rsp) {
                $("#name").text(rsp.data.name);
                $("#preview").text(rsp.data.preview);
            });

            $("#ws-property-delete").unbind("click").click(this.delete);
        }
    };

/**
 * 数据源选择器
 */
webSquid.page.modules["task/sources"] = webSquid.page.modules["task/sources"] || {
        query: function () {
            var shid = $("#sourceSelector").val();
            webSquid.datatable("#source-table", {
                ajax: webSquid.resolve("api", "data/select?sql=" + "SELECT * FROM ds_source_table WHERE shid=" + shid),
                order: [4, 'desc'],
                columns: [
                    {data: "stid", label: "ID"},
                    {
                        label: "选择",
                        render: function (data, type, row) {
                            return "<input type=\"checkbox\" name=\"sourceTable\" value=\"" + row.stid + "\"/>";
                        }
                    },
                    {data: "name", label: "逻辑表名"},
                    {data: "table_name", label: "物理表名"},
                    {
                        label: "创建时间",
                        render: function (data, type, row) {
                            return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
                        }
                    }
                ],
                initComplete: function () {
                    $("#source-table tbody tr td").unbind("click").click(function () {
                        $(this).parent().find("input[type='checkbox']").click();
                    });
                }
            });
        },
        init: function () {
            $("#sourceSelector").empty();
            webSquid.ajax("data/source/host", "GET", null, function (rsp) {
                rsp.data.map(function (item) {
                    $("#sourceSelector").append($("<option/>").val(item.shid).text(item.name));
                });
            }).done(function () {
                webSquid.pageModule("task/sources").query();
            });

            $("#sourceSelector").unbind("change").change(webSquid.pageModule("task/sources").query);
        }
    };

