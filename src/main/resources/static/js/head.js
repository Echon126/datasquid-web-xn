/**
 * Created by xcp on 2016/11/30.
 */
function profile() {
    webSquid.loadPage("#content", "profile");
}

function logout() {

    webSquid.ajax("logout", "GET", null, function (rsp) {
        window.location.href = webSquid.basePath;
    });
}