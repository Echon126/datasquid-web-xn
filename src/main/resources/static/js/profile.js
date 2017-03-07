/**
 * 个人设置
 * Created by xcp on 2016/12/08.
 */

// 用户管理主页 表格
webSquid.page.modules["profile"] = webSquid.page.modules["profile"] || {

        init: function () {
            var user = webSquid.user;
            $("#profile_uid").val(user.duid);
            $("input[name='account']").val(user.account);
            $("input[name='username']").val(user.username);
            $("input[name='phone']").val(user.phone);
            $("input[name='company']").val(user.company);
            $("input[name='rule']").val(user.rule);
            $("#ws-page-apply").click(this.modifyPassword);
        },
        modifyPassword: function () {
            var duid = $("#profile_uid").val();
            var old_password = $("input[name='old_password']").val();
            var new_password = $("input[name='new_password']").val();
            var confirm_password = $("input[name='confirm_password']").val();
            console.log("old_password=" + old_password + " -new_password=" + new_password + " -confirm_password=" + confirm_password);
            if (old_password == '' || old_password == undefined || old_password == null) {
                webSquid.alert("未填写原始密码", "错误提示")
                return;
            }
            if (old_password.length < 6) {
                webSquid.alert("原始密码不得少于6位", "错误提示")
                return;
            }
            if (new_password == '' || new_password == undefined || new_password == null) {
                webSquid.alert("未填写新密码", "错误提示")
                return;
            }
            if (new_password.length < 6) {
                webSquid.alert("新密码不得少于6位", "错误提示")
                return;
            }
            if (confirm_password == '' || confirm_password == undefined || confirm_password == null) {
                webSquid.alert("未确认新密码", "错误提示")
                return;
            }
            if (confirm_password.length < 6) {
                webSquid.alert("确认新密码不得少于6位", "错误提示")
                return;
            }
            if (new_password != confirm_password) {
                webSquid.alert("确认新密码与新密码不一致", "错误提示")
                return;
            }
            webSquid.ajax("modifyPassword", "POST", {
                duid: duid,
                old_password: old_password,
                new_password: new_password
            }, function (rsp) {
                var result = rsp.data.result;
                var msg = rsp.data.msg;
                if (result) {
                    webSquid.alert(msg, "温馨提示", function () {
                        location.href = "";
                    });
                } else {
                    webSquid.alert(msg, "错误提示");
                }
            });
        }
    };



