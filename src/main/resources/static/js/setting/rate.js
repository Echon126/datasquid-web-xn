/**
 * 商品品类归类
 * Created by xcp on 2016/12/09.
 */
webSquid.page.modules["setting/rate"] = webSquid.page.modules["setting/rate"] || {
        setTable: function (month, year) {
            var url = "setting/exrate/";
            url += month + "/" + year;
            webSquid.datatable("#query-rate-table", {
                ajax: webSquid.resolve("api", url),
                paging: false,
                columns: [
                    {data: "country", label: "国家"},
                    {data: "currency", label: "货币类型"},
                    {data: "code", bVisible: true, label: "货币代码"},
                    {data: "rateid", label: "货币数字代码"},
                    {
                        label: "折算率(对美元折算率)",
                        render: function (data, type, row) {
                            var rate = '<input type="number"   value="' + row.rate + '" onchange="' + "javascript:webSquid.pageModule('setting/rate').edit(this," + row.rid + ")" + '" >';
                            return rate;
                        }
                    }
                ]
            });
        },
        yearSet: function (btn) {
            $(".input-group button").each(function () {
                $(this).attr("class", "btn btn-sm btn-default");
            });
            webSquid.page.modules['setting/rate'].buttonInt()
        },
        //给月份按钮的添加name属性，以便取值
        rateSet: function (btn) {
            var children = $(btn).parent().children();
            children.each(function () {
                $(this).removeAttr("name");
            });
            $(btn).attr("name", "month");
            //获取当前按钮的值
            var month = $(btn).val();
            var years = $("input[name='date_years']").val();
            this.setTable(month, years);
        },
        //编辑汇率设定的值
        exrateSet: function (btn) {
            var erate = $(btn).val();//汇率值
            var years = $("input[name='date_years']").val();
            var month = $("button[name='month']").val();
            var formData = {
                date_years: years,
                month: month,
                erate: erate
            };
            webSquid.ajax("setting/rate", "PUT", formData, function (rsp) {
                webSquid.page.modules['setting/rate'].buttonInt()
            });
        },
        //编辑折算率的值
        edit: function (btn, rid) {
            var rate = $(btn).val();
            var years = $("input[name='date_years']").val();
            var month = $("button[name='month']").val();
            if (years == "") {
                webSquid.alert("年度不能为空", "提示", null, "modal-info");
                return;
            }
            if (month == "") {
                webSquid.alert("月份不能为空", "提示", null, "modal-info");
                return;
            }
            if (rate == "") {
                webSquid.alert("折算率不能为空", "提示", null, "modal-info");
                return;
            }
            var formData = {
                date_years: years,
                month: month,
                rate: rate
            };
            webSquid.ajax("setting/exrate/" + rid, "PUT", formData, function (rsp) {
                webSquid.page.modules['setting/rate'].setTable(month, years);
                webSquid.page.modules['setting/rate'].buttonInt();
            });
        },

        //初始化月份按钮
        buttonInt: function () {
            var date_years = $("input[name='date_years']").val();
            webSquid.ajax("setting/exrate", "GET", null, function (rsp) {
                var rateData = rsp.data;
                $(".input-group button").each(function () {
                    for (var idx in rateData) {
                        var year = rateData[idx].year;
                        var oDate = new Date(year);
                        var oYear = oDate.getFullYear();
                        var month = rateData[idx].month;
                        var value = $(this).val();
                        if (month == value && oYear == date_years) {
                            $(this).attr("class", "btn btn-sm btn-default fa fa-check-circle");
                        }
                    }
                });
            });
        },
        /**
         * 初始化
         */
        init: function () {
            //初始化年度，只显示年
            $("[name='date_years']").val(moment(new Date()).startOf('year').format("YYYY"));
            $("[name='date_years']").datepicker({
                language: "zh-CN",
                format: "yyyy",
                autoclose: true,
                minViewMode: 'years',
                defaultDate: new Date()
            });
            var date_years = $("input[name='date_years']").val();//获取当前年度
            webSquid.page.modules['setting/rate'].buttonInt();//初始化按钮
            //默认一月份的值
            $("button[value='1']").attr("name", "month");
            //初始化form表单
            this.setTable(1, date_years);
        }
    };
