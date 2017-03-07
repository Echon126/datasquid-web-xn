package com.datasquid.web.controller;

import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceItem;
import com.datasquid.web.data.sql.SQLSourceProvider;
import org.apache.commons.logging.Log;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * controller Base 父类
 * Created by xcp on 2016/11/30.
 */
public class BaseController {
    protected final String key = "%@!!#!$";
    protected final String adminURL = "/admin?p=admin";
    protected final String logoutURL = "";
    protected final String defaultPassword = "123456";


    //校验模版是否存在
    protected boolean verifyTemplate(String templateName,File templatesFolder,Log log) {

        if (templateName.contains("..")) {
            log.warn("疑似非法的模版文件请求：" + templateName);
            return false;
        }
        templateName += ".html";
        File templateFile = new File(templatesFolder, templateName);
        return templateFile.exists();
    }


    // 获取父级菜单列表
    protected List<Object[]> getSubMenuList(SQLQuery query, long duid) {
        SQLData subMenuData = query.select("SELECT * FROM ds_menu m WHERE m.is_enabled=1 AND m.mid IN (SELECT p.mid FROM ds_permission p WHERE p.rlid IN(SELECT rlid FROM ds_user_rule WHERE duid=?) ) AND pid = 0 ORDER BY sno ASC",
                duid);
        return subMenuData.getDataList();
    }

    // 获取子级菜单列表
    protected List<Object[]> getChildMenuList(SQLQuery query,long duid) {
        SQLData childMenuData = query.select("SELECT * FROM ds_menu m WHERE m.is_enabled=1 AND m.mid IN (SELECT p.mid FROM ds_permission p WHERE p.rlid IN(SELECT rlid FROM ds_user_rule WHERE duid=?) ) AND pid !='0' ORDER BY pid ASC,sno ASC",
                duid);
        return childMenuData.getDataList();
    }

    protected void loadUserDataSource(SQLSourceProvider sourceProvider) {
        SQLData hostData = new SQLQuery(sourceProvider).select("SELECT * FROM ds_source_host ");
        SQLSourceItem sqlSourceItem;
        String hostType;
        String name;
        String host;
        String database;
        String account;
        String password;
        Map<String, Object> row;
        do {
            row = hostData.getRow();
            hostType = row.get("type").toString();
            name = row.get("name").toString();
            host = row.get("host").toString();
            database = row.get("database_name").toString();
            account = row.get("account").toString();
            password = row.get("password").toString();

            if (hostType.equals(SQLQuery.DB_TYPE_MYSQL)) {
                sqlSourceItem = SQLSourceItem.buildMySQLDataSourceItem(
                        name, host, database, account, password
                );
                sourceProvider.putSourceItem(name, sqlSourceItem);
            }
            if (hostType.equals(SQLQuery.DB_TYPE_ORACLE)) {
                sqlSourceItem = SQLSourceItem.buildOracleDataSourceItem(
                        name, host, database, account, password
                );
                sourceProvider.putSourceItem(name, sqlSourceItem);
            }
        } while (hostData.nextRow());
    }

}
