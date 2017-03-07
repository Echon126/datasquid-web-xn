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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * 权限组
 * Created by xcp on 2016/12/1.
 */
@RestController
@RequestMapping("/api/auth")
public class Auth extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery sqlQuery;

    @Autowired
    private SQLSourceProvider sqlSourceProvider;

    @PostConstruct
    private void init() {
        this.sqlQuery = new SQLQuery(this.sqlSourceProvider);
    }

    // 权限组列表查询及条件检索
    @RequestMapping(value = "/rule", method = RequestMethod.GET)
    public ResponseData ruleList(
            @RequestParam String name,
            @RequestParam(name = "date_start") long dateStart,
            @RequestParam(name = "date_end") long dateEnd
    ) {

        ArrayList<Object> conditions = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT r.rlid, r.name, r.description, r.create_time,(select count(1) from ds_permission p where p.rlid=r.rlid) count FROM ds_rule r WHERE 1=1");
        if (!StringUtils.isEmpty(name)) {
            sql.append(" AND name like '%");
            sql.append(name.replace("'", ""));
            sql.append("%'");
        }
        if (dateStart > 0) {
            sql.append(" AND create_time >= ?");
            conditions.add(new Date(dateStart));
        }
        if (dateEnd > 0) {
            sql.append(" AND create_time <= ?");
            conditions.add(new Date(dateEnd));
        }

        sql.append(" ORDER BY create_time ASC");

        SQLData data = this.sqlQuery.select(sql.toString(), conditions.toArray());
        return new ResponseData(data);
    }

    // 权限组列表 select下拉框显示
    @RequestMapping(value = "/ruleSelect", method = RequestMethod.GET)
    public ResponseData ruleSelectList() {
        String sql = "SELECT r.rlid, r.name FROM ds_rule r WHERE 1=1 and r.rlid != 1 ORDER BY create_time ASC";
        SQLData data = this.sqlQuery.select(sql);
        return new ResponseData(data);
    }

    // 通过id查询 一条权限组 详细信息
    @RequestMapping(value = "/rule/{rlid}", method = RequestMethod.GET)
    public ResponseData ruleDetail(
            @PathVariable(value = "rlid") int ruleId
    ) {
        SQLData baseData = this.sqlQuery.select("SELECT rlid, name, description, create_time FROM ds_rule WHERE rlid = ?", ruleId);
        // 查询所有菜单项
        // 查询该角色对应的权限菜单项
        // 封装返回 权限显示数据

        return new ResponseData(baseData);
    }

    // 权限组新增
    @RequestMapping(value = "/rule", method = RequestMethod.POST)
    public ResponseData ruleCreate(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(name = "rule_name", required = false, defaultValue = "")
                    String[] ruleName,//父级菜单
            @RequestParam(name = "rules_name", required = false, defaultValue = "")
                    String[] rulesName//子级菜单
    ) throws SQLException {
        if (this.isRuleRepeat(name, 0)) {
            return new ResponseData("权限组名称:" + name + " 已存在", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("name", "description");
        data.add(name, description);
        int ruleId = this.sqlQuery.insertOne("ds_rule", data);
        this.generateRule(ruleName, rulesName, ruleId);
        return new ResponseData(new HashMap() {{
            put("rlid", ruleId);
        }});

    }

    //向权限菜单表（ds_permission）添加数据
    private boolean generateRule(String[] ruleNames, String[] rulesNames, int rlid) {
        if (ruleNames.length == 0)
            return true;
        SQLData data = new SQLData();
        data.addSchema("rlid", "mid");
        for (String ruleName : ruleNames) {
            data.add(rlid, ruleName);
        }
        for (String ruleName : rulesNames) {
            data.add(rlid, ruleName);
        }
        this.sqlQuery.insert("ds_permission", data);
        return true;
    }

    // 权限组名重复校验
    private boolean isRuleRepeat(String ruleName, long rlid) throws SQLException {
        long count;
        if (rlid != 0) {
            count = (long) this.sqlQuery.selectScalar("SELECT count(1) from ds_rule where name = ? and rlid != ?", ruleName, rlid);
        } else {
            count = (long) this.sqlQuery.selectScalar("SELECT count(1) from ds_rule where name = ?", ruleName);
        }

        return count > 0;
    }

    // 权限组修改
    @RequestMapping(value = "/rule/{rlid}", method = RequestMethod.PUT)
    public ResponseData ruleEdit(
            @PathVariable(value = "rlid") int rlid,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(name = "rule_name", required = false, defaultValue = "")
                    String[] ruleName,
            @RequestParam(name = "rules_name", required = false, defaultValue = "")
                    String[] rulesName
    ) throws SQLException {
        if (this.isRuleRepeat(name, rlid)) {
            return new ResponseData("权限组名称:" + name + " 已存在", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        SQLData deleteData = new SQLData();
        data.addSchema("RLID", "name", "description");
        data.add(rlid, name, description);
        this.sqlQuery.update("ds_rule", new String[]{"RLID"}, data);
        deleteData.addSchema("rlid");
        deleteData.add(rlid);
        //删除原有权限
        //新增勾选的角色对应权限
        this.sqlQuery.delete("ds_permission", deleteData);
        this.generateRule(ruleName, rulesName, rlid);
        return new ResponseData(new HashMap() {{
            put("rlid", rlid);
        }});
    }

    // 权限组删除
    @RequestMapping(value = "/rule/{rlid}", method = RequestMethod.DELETE)
    public ResponseData ruleDelete(@PathVariable(value = "rlid") int ruleId) {
        SQLData data = new SQLData();
        data.addSchema("rlid");
        data.add(ruleId);
        this.sqlQuery.delete(data, "ds_rule", "ds_user_rule", "ds_permission");
        //删除权限组时级联删除权限菜单表表中的信息
        SQLData delData = new SQLData();
        delData.addSchema("rlid");
        delData.add(ruleId);
        this.sqlQuery.delete("ds_permission", delData);
        return new ResponseData(1);
    }

    /**
     * 权限设置中加载复选框数据
     */
    @RequestMapping(value = "/menulist", method = RequestMethod.GET)
    public ResponseData menuMessage() {
        SQLData datasub = this.sqlQuery.select("select mid,name ,sign,ie from ds_menu where  pid=0 order by sno,create_time");
        SQLData datachild = this.sqlQuery.select("select mid,name ,pid,sign,ie from ds_menu where pid <>0  order by pid, sno,create_time");

        return new ResponseData(new HashMap() {{
            put("subList", datasub.toMapList());
            put("childList", datachild.toMapList());
        }});
    }

    // 用户列表查询及条件检索
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseData userList(
            @RequestParam String username,
            @RequestParam String account,
            @RequestParam String phone,
            @RequestParam String company,
            @RequestParam(name = "date_start") long dateStart,
            @RequestParam(name = "date_end") long dateEnd
    ) {
        ArrayList<Object> conditions = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT u.duid,u.username,u.account,u.phone,u.company,u.create_time, (SELECT r.name FROM ds_user_rule ur,ds_rule r WHERE r.rlid=ur.rlid AND ur.duid=u.duid) rule FROM ds_user u WHERE 1=1");
        if (!StringUtils.isEmpty(username)) {
            sql.append(" AND username like '%");
            sql.append(username.replace("'", ""));
            sql.append("%'");
        }
        if (!StringUtils.isEmpty(account)) {
            sql.append(" AND account like '%");
            sql.append(account.replace("'", ""));
            sql.append("%'");
        }
        if (!StringUtils.isEmpty(phone)) {
            sql.append(" AND phone like '%");
            sql.append(phone.replace("'", ""));
            sql.append("%'");
        }
        if (!StringUtils.isEmpty(company)) {
            sql.append(" AND company like '%");
            sql.append(company.replace("'", ""));
            sql.append("%'");
        }
        if (dateStart > 0) {
            sql.append(" AND create_time >= ?");
            conditions.add(new Date(dateStart));
        }
        if (dateEnd > 0) {
            sql.append(" AND create_time <= ?");
            conditions.add(new Date(dateEnd));
        }
        sql.append(" ORDER BY create_time ASC");

        SQLData data = this.sqlQuery.select(sql.toString(), conditions.toArray());
        return new ResponseData(data);
    }

    // 通过id查询 一条用户 详细信息
    @RequestMapping(value = "/user/{duid}", method = RequestMethod.GET)
    public ResponseData userDetail(
            @PathVariable(value = "duid") int duid
    ) {
        SQLData data = this.sqlQuery.select("SELECT duid,username,account,phone,company,create_time FROM ds_user u WHERE duid = ?", duid);
        return new ResponseData(data);
    }

    // 用户新增
    @RequestMapping(value = "/user", method = RequestMethod.POST)
    public ResponseData userCreate(
            @RequestParam String username,
            @RequestParam String account,
            @RequestParam String password,
            @RequestParam String phone,
            @RequestParam String company
    ) throws NoSuchAlgorithmException, SQLException {
        if (StringUtils.isEmpty(account)) {
            return new ResponseData("登陆帐号不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(password)) {
            return new ResponseData("登陆密码不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(username)) {
            return new ResponseData("用户姓名不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(phone)) {
            return new ResponseData("联系电话不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(company)) {
            return new ResponseData("公司名称不可为空", HttpStatus.FORBIDDEN);
        }
        if (this.account_repeat(account)) {
            return new ResponseData("帐号:" + account + " 已存在", HttpStatus.FORBIDDEN);
        }

        SQLData data = new SQLData();
        String sign = account + this.key + password;
        BigInteger sha = new BigInteger(EncryptUtil.encryptSHA(sign.getBytes()));
        String shaPassword = sha.toString(32);
        data.addSchema("username", "account", "password", "phone", "company");
        data.add(username, account, shaPassword, phone, company);

        int duid = this.sqlQuery.insertOne("ds_user", data);
        return new ResponseData(new HashMap() {{
            put("duid", duid);
        }});
    }

    // 帐号重复校验
    private boolean account_repeat(String account) throws SQLException {
        long count;
        String sql = "SELECT count(1) from ds_user where account = ?";
        count = (long) this.sqlQuery.selectScalar(sql, account);
        return count > 0;
    }

    // 用户修改
    @RequestMapping(value = "/user/{duid}", method = RequestMethod.PUT)
    public ResponseData userEdit(
            @PathVariable(value = "duid") int duid,
            @RequestParam String username,
            @RequestParam String phone,
            @RequestParam String company
    ) {
        if (StringUtils.isEmpty(username)) {
            return new ResponseData("用户姓名不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(phone)) {
            return new ResponseData("联系电话不可为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(company)) {
            return new ResponseData("公司名称不可为空", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("duid", "username", "phone", "company", "update_time");
        data.add(duid, username, phone, company, new Date(System.currentTimeMillis()));

        this.sqlQuery.update("ds_user", new String[]{"duid"}, data);

        return new ResponseData(new HashMap() {{
            put("duid", duid);
        }});
    }

    // 用户删除
    @RequestMapping(value = "/user/{duid}", method = RequestMethod.DELETE)
    public ResponseData userDelete(@PathVariable(value = "duid") int duid) {
        SQLData data = new SQLData();
        data.addSchema("duid");
        data.add(duid);
        this.sqlQuery.delete(data, "ds_user", "ds_user_rule");
        return new ResponseData(1);
    }


    // 新增 用户授权
    @RequestMapping(value = "/userAuth", method = RequestMethod.POST)
    public ResponseData userAuthCreate(
            @RequestParam String duid,
            @RequestParam String rlid
    ) {
        SQLData data = new SQLData();
        data.addSchema("duid", "rlid");
        data.add(duid, rlid);
        int urid = this.sqlQuery.insertOne("ds_user_rule", data);
        return new ResponseData(new HashMap() {{
            put("urid", urid);
        }});
    }

    // 修改 用户授权
    @RequestMapping(value = "/userAuth/{duid}", method = RequestMethod.PUT)
    public ResponseData userEdit(
            @PathVariable(value = "duid") int duid,
            @RequestParam String rlid
    ) {
        SQLData data = new SQLData();
        data.addSchema("duid", "rlid", "update_time");
        data.add(duid, rlid, new Date(System.currentTimeMillis()));

        this.sqlQuery.update("ds_user_rule", new String[]{"duid"}, data);

        return new ResponseData(new HashMap() {{
            put("duid", duid);
        }});
    }

    // 查询 个人设置 详细信息
    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public ResponseData profile() {
        this.log.info("profile个人设置");

        return new ResponseData();
    }

    // 登陆退出
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public ResponseData logout() {
        // ???????????????????????
        return new ResponseData();
    }

    // 用户密码重置
    @RequestMapping(value = "/reset/{duid}", method = RequestMethod.PUT)
    public ResponseData userReset(
            @PathVariable(value = "duid") int duid,
            @RequestParam String account
    ) throws NoSuchAlgorithmException {
        SQLData data = new SQLData();

        String sign = account + this.key + this.defaultPassword;
        BigInteger sha = new BigInteger(EncryptUtil.encryptSHA(sign.getBytes()));
        String shaPassword = sha.toString(32);

        data.addSchema("duid", "password", "update_time");
        data.add(duid, shaPassword, new Date(System.currentTimeMillis()));
        this.sqlQuery.update("ds_user", new String[]{"duid"}, data);
        return new ResponseData(new HashMap() {{
            put("result", true);
            put("msg", "密码重置成功");
        }});
    }

    //新增菜单是否可用
    @RequestMapping(value = "/menus/{id}", method = RequestMethod.PUT)
    public ResponseData isOpen(@PathVariable(value = "id") int id,
                               @RequestParam int enabled) throws NoSuchAlgorithmException, SQLException {
        SQLData data = new SQLData();
        int value = enabled == 1 ? 0 : 1;
        data.addSchema("mid", "is_enabled");
        data.add(id, value);
        this.sqlQuery.update("ds_menu", new String[]{"mid"}, data);
        return new ResponseData(1);
    }

    /**
     * 菜单管理查询（一级菜单）
     *
     * @param name 根据菜单名称查询，后期可扩展查询条件
     * @return
     */
    @RequestMapping(value = "/menu", method = RequestMethod.GET)
    public ResponseData menuList(@RequestParam String name) {
        StringBuilder sql = new StringBuilder();
        sql.append("select sno, mid,name,icon,sign,ie,is_enabled as enabled from ds_menu where pid=0 and 1=1 ");
        if (!StringUtils.isEmpty(name)) {
            sql.append(" and name like '%");
            sql.append((name.replace(",", "")));
            sql.append("%'");
        }
        sql.append("order by sno,create_time");
        SQLData data = this.sqlQuery.select(sql.toString());
        return new ResponseData(data);
    }

    @RequestMapping(value = "/menulist/{rlid}", method = RequestMethod.GET)
    public ResponseData permission(
            @RequestParam(value = "rlid") int rlid
    ) {
        SQLData data = this.sqlQuery.select("select mid from ds_permission  where  rlid=?", rlid);
        return new ResponseData(data);
    }

    // 通过id查询 一条菜单信息
    @RequestMapping(value = "/menu/{id}", method = RequestMethod.GET)
    public ResponseData menuDetail(
            @PathVariable(value = "id") int mid
    ) {
        SQLData data = this.sqlQuery.select("SELECT mid,name,sno,url,icon,sign,ie FROM ds_menu  WHERE mid = ?", mid);
        return new ResponseData(data);
    }

    /**
     * 新增菜单（一级菜单）
     *
     * @param menuName 菜单名称
     * @param menuIcon 菜单图标
     * @param menuType 业务类型
     * @param menuIe   进出口类型
     * @return
     * @throws NoSuchAlgorithmException
     * @throws SQLException
     */
    @RequestMapping(value = "/menu", method = RequestMethod.POST)
    public ResponseData menuCreate(
            @RequestParam int menuSno,
            @RequestParam String menuName,
            @RequestParam String menuIcon,
            @RequestParam String menuType,
            @RequestParam String menuIe
    ) throws NoSuchAlgorithmException, SQLException {
        if (StringUtils.isEmpty(menuName)) {
            return new ResponseData("菜单名称不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuType)) {
            return new ResponseData("业务类型不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuIe)) {
            return new ResponseData("进出口不能为空", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("name", "sno", "icon", "sign", "ie");
        data.add(menuName, menuSno, menuIcon, menuType, menuIe);
        int mid = this.sqlQuery.insertOne("ds_menu", data);
        return new ResponseData(new HashMap() {{
            put("id", mid);
        }});
    }

    /**
     * 修改菜单信息(一级菜单与二级菜单方法公用)
     */
    @RequestMapping(value = "/menu/{id}", method = RequestMethod.PUT)
    public ResponseData menuUpdate(@PathVariable(value = "id") int id,
                                   @RequestParam String menuName,
                                   @RequestParam String menuSno,
                                   @RequestParam(required = false, defaultValue = "null")
                                           String menuUrl,
                                   @RequestParam String menuIcon,
                                   @RequestParam String menuType,
                                   @RequestParam String menuIe) {
        SQLData data = new SQLData();
        data.addSchema("mid", "name", "sno", "url", "icon", "sign", "ie");
        data.add(id, menuName, menuSno, menuUrl, menuIcon, menuType, menuIe);
        this.sqlQuery.update("ds_menu", new String[]{"mid"}, data);
        return new ResponseData(new HashMap() {{
            put("msg", "修改成功");
        }});
    }

    /**
     * 删除菜单（一级菜单与二级菜单方法公用）
     */
    @RequestMapping(value = "/menu/{id}", method = RequestMethod.DELETE)
    public ResponseData menuDelete(@PathVariable(value = "id") int id) {
        SQLData data = new SQLData();
        data.addSchema("mid");
        data.add(id);
        this.sqlQuery.delete(data, "ds_menu");
        return new ResponseData(1);
    }

    /**
     * 子菜单信息（二级菜单）
     */
    @RequestMapping(value = "/submenu", method = RequestMethod.GET)
    public ResponseData submenuList(@RequestParam int id) {
        SQLData data = this.sqlQuery.select("select sno,mid,name,url,pid,icon,sign,ie,is_enabled as enabled from ds_menu where pid=? order by sno,create_time", id);
        return new ResponseData(data);
    }

    /**
     * 新增子菜单（二级菜单）
     */
    @RequestMapping(value = "/submenu/{pid}", method = RequestMethod.POST)
    public ResponseData submenuCreate(
            @PathVariable(value = "pid") int pid,
            @RequestParam int menuSno,
            @RequestParam String menuName,
            @RequestParam String menuUrl,
            @RequestParam String menuIcon,
            @RequestParam String menuType,
            @RequestParam String menuIe
    ) throws NoSuchAlgorithmException, SQLException {
        if (StringUtils.isEmpty(menuName)) {
            return new ResponseData("菜单名称不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuUrl)) {
            return new ResponseData("菜单URL不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuIcon)) {
            return new ResponseData("菜单图标不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuType)) {
            return new ResponseData("业务类型不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(menuIe)) {
            return new ResponseData("进出口不能为空", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("name", "sno", "url", "pid", "icon", "sign", "ie");
        data.add(menuName, menuSno, menuUrl, pid, menuIcon, menuType, menuIe);
        int mid = this.sqlQuery.insertOne("ds_menu", data);
        return new ResponseData(new HashMap() {{
            put("id", mid);
        }});
    }

}
