package com.datasquid.web.controller.api;

import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import com.datasquid.web.tools.EncryptUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 安全认证
 * Created by xcp on 2016/11/30.
 */
@RestController
@RequestMapping("/api")
public class Login extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery query;

    @Autowired
    private SQLSourceProvider sqlSourceProvider;

    @PostConstruct
    private void init() {
        this.query = new SQLQuery(this.sqlSourceProvider);
    }

    //登陆校验
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseData login(
            @RequestParam(name = "loginName")
            String loginName,
            @RequestParam(name = "loginPwd")
            String loginPwd,
            HttpServletRequest request) throws NoSuchAlgorithmException {

        String sign = loginName + this.key + loginPwd;
        BigInteger sha = new BigInteger(EncryptUtil.encryptSHA(sign.getBytes()));
        String shaPassword = sha.toString(32);
        // 获取登陆认证用户信息
        SQLData userData = this.authUserLogin(loginName, shaPassword);

        if (!userData.isEmpty()) {
            Map<String, Object> user = userData.getRow();
            // 获取父级菜单信息
            long duid = (long) user.get("duid");
            List<Object[]> subMenuList = this.getSubMenuList(this.query, duid);
            // 获取子级菜单信息
            List<Object[]> childMenuList = this.getChildMenuList(this.query, duid);

            HttpSession session = request.getSession();
            String rule = getUserRule(duid);
            user.put("rule", rule);
            session.setAttribute("user", user);
            session.setAttribute("subMenuList", subMenuList);
            session.setAttribute("childMenuList", childMenuList);
            return new ResponseData(this.adminURL);
        }

        return new ResponseData("用户名或密码错误，请重新输入", HttpStatus.NOT_FOUND);
    }

    //退出登录
    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public ResponseData logout(HttpServletRequest request) throws NoSuchAlgorithmException {
        HttpSession session = request.getSession();
        session.removeAttribute("user");
        return new ResponseData(this.logoutURL);
    }

    //修改密码
    @RequestMapping(value = "modifyPassword", method = RequestMethod.POST)
    public ResponseData modifyPassword(
            @RequestParam(name = "duid") long duid,
            @RequestParam(name = "old_password") String oldPassword,
            @RequestParam(name = "new_password") String newPassword,
            HttpServletRequest request
    ) throws NoSuchAlgorithmException {
        HttpSession session = request.getSession();
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("user");
        boolean result;
        String msg;
        String account = user.get("account").toString();
        long rawUid = (long) user.get("duid");
        this.log.debug("duid=" + duid);
        this.log.debug("useruid=" + rawUid);

        if (rawUid == duid) {
            String sign1 = account + this.key + oldPassword;
            BigInteger sha1 = new BigInteger(EncryptUtil.encryptSHA(sign1.getBytes()));
            String shaOldPassword = sha1.toString(32);//原始密码 SHA
            String sign2 = account + this.key + newPassword;
            BigInteger sha2 = new BigInteger(EncryptUtil.encryptSHA(sign2.getBytes()));
            String shaNewPassword = sha2.toString(32);//新密码 SHA
            // 获取登陆认证用户信息
            SQLData userData = this.authUserLogin(account, shaOldPassword);
            if (!userData.isEmpty()) {
                this.log.debug("duid：" + duid + " 帐号：" + account + "密码正确，可以修改密码");

                SQLData data = new SQLData();
                data.addSchema("duid", "password", "update_time");
                data.add(duid, shaNewPassword, new Date(System.currentTimeMillis()));
                this.query.update("ds_user", new String[]{"duid"}, data);

                // 密码修改完毕，清空session
                session.removeAttribute("user");
                result = true;

                msg = "修改密码成功";
                this.log.info("duid：" + duid + " 帐号：" + account + "修改密码成功");
            } else {
                // 原始密码错误
                this.log.debug("原始密码错误，不可以修改密码");
                result = false;
                msg = "原始密码错误";
            }

        } else {
            this.log.debug("修改密码：用户id不匹配");
            result = false;
            msg = "用户id不正确";
        }
        Map<String, String> map = new HashMap<>();
        map.put("result", String.valueOf(result));
        map.put("msg", msg);
        return new ResponseData(map);
    }

    // 获取登陆认证用户信息
    private SQLData authUserLogin(String account, String password) {
        return this.query.select("SELECT   duid,   account,   username,   company,   phone,   create_time,   update_time FROM ds_user WHERE account = ? AND password = ?",
                account, password);
    }


    // 获取所属权限组
    private String getUserRule(long duid) {
        String rule = "未分配";
        SQLData ruleData = this.query.select("SELECT r.name FROM ds_user_rule ur,ds_rule r WHERE r.rlid=ur.rlid AND duid=?",
                duid);
        List<Object[]> list = ruleData.getDataList();
        if (!CollectionUtils.isEmpty(list)) {
            Object[] obj = list.get(0);
            if ((null == obj) || (obj.length <= 0)) {
                return rule;
            }
            rule = (String) list.get(0)[0];
        }
        return rule;
    }

}
