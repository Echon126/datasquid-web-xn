/**
 * Created by Administrator on 2017/1/16.
 */

webSquid.page.modules["logistics/2"] = webSquid.page.modules["logistics/2"] || {
        query: function () {
            var orderNumber = $("#orderNum").val();
            webSquid.ajax("data/s/HJ", "GET", {
                sid: "logistics_e",
                ie: webSquid.ie,
                sign: webSquid.sign,
                param: [orderNumber].join(";")
            }, function (rsp) {
                if (rsp.data.length == 0) {
                    $(".timeline").hide();
                    webSquid.alert("未找到相关数据，请确认单号是否正确并稍后再试", "提示");
                } else {
                    var item = rsp.data[0];
                    for (var name in item) {
                        if (item[name])
                            $("#" + name).html(moment(item[name]).format("YYYY年MM月DD日 hh:mm:ss"));
                    }

                    $(".timeline").slideDown();
                    $("#noMessage").hide();
                }
            });

        },
        init: function () {
            $(".timeline").hide();
            $("#noMessage").html("").show();
            $("#btnQuery").click(this.query);
        }
    };