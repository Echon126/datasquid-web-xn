package com.datasquid.web.controller.api.data;

import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceItem;
import com.datasquid.web.data.sql.SQLSourceProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by Administrator on 2017/2/6.
 */
@RestController
@RequestMapping("/api/data")
public class Source extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery mainQuery;

    @Autowired
    private SQLSourceProvider sourceProvider;

    @PostConstruct
    private void init() {
        this.mainQuery = new SQLQuery(this.sourceProvider);
    }

    @RequestMapping(value = "/source/host", method = RequestMethod.GET)
    public ResponseData sourceList(
            @RequestParam(required = false)
            String type,
            @RequestParam(required = false)
            String name,
            @RequestParam(required = false)
            String host,
            @RequestParam(required = false)
            String database,
            @RequestParam(name = "date_start", required = false, defaultValue = "0")
            long dateStart,
            @RequestParam(name = "date_end", required = false, defaultValue = "0")
            long dateEnd
    ) {

        ArrayList<Object> conditions = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT shid, name, description, host, type, database_name, account, create_time, (SELECT COUNT(*) FROM ds_source_table WHERE shid=ds_source_host.shid) AS table_count FROM ds_source_host WHERE 1=1");
        if (!StringUtils.isEmpty(type)) {
            sql.append(" AND type = '");
            sql.append(type.replace("'", ""));
            sql.append("'");
        }
        if (!StringUtils.isEmpty(name)) {
            sql.append(" AND name like '%");
            sql.append(name.replace("'", ""));
            sql.append("'");
        }
        if (!StringUtils.isEmpty(host)) {
            sql.append(" AND name like '");
            sql.append(host.replace("'", ""));
            sql.append("%'");
        }
        if (!StringUtils.isEmpty(database)) {
            sql.append(" AND name like '");
            sql.append(database.replace("'", ""));
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
        sql.append(" ORDER BY create_time DESC");

        return new ResponseData(this.mainQuery.select(sql.toString(), conditions.toArray()));
    }

    @RequestMapping(value = "/source/host", method = RequestMethod.POST)
    public ResponseData sourceHostCreate(
            @RequestParam
            String name,
            @RequestParam
            String description,
            @RequestParam
            String host,
            @RequestParam
            String database,
            @RequestParam
            String account,
            @RequestParam
            String password,
            @RequestParam
            String type
    ) {
        SQLData data = new SQLData();
        data.addSchema("name", "description", "host", "database_name", "account", "password", "type");
        data.add(name, description, host, database, account, password, type);

        int sourceHostId = this.mainQuery.insertOne("ds_source_host", data);
        this.loadUserDataSource(this.sourceProvider);

        return new ResponseData(new HashMap() {{
            put("shid", sourceHostId);
        }});
    }

    @RequestMapping(value = "/source/host/{shid}", method = RequestMethod.PUT)
    public ResponseData sourceHostEdit(
            @PathVariable(value = "shid")
            long sourceHostId,
            @RequestParam
            String name,
            @RequestParam
            String description,
            @RequestParam
            String host,
            @RequestParam
            String database,
            @RequestParam
            String account,
            @RequestParam
            String password,
            @RequestParam
            String type
    ) {
        SQLData data = new SQLData();
        data.addSchema("shid", "name", "description", "host", "database_name", "account", "password", "type");
        data.add(sourceHostId, name, description, host, database, account, password, type);

        this.mainQuery.update("ds_source_host", new String[]{"shid"}, data);
        this.loadUserDataSource(this.sourceProvider);

        return new ResponseData(new HashMap() {{
            put("shid", sourceHostId);
        }});
    }

    // 刷新 链接数据库中表的数量
    @RequestMapping(value = "/source/host/{shid}/refresh", method = RequestMethod.PUT)
    public ResponseData sourceHostTableRefresh(
            @PathVariable(value = "shid")
            long sourceHostId
    ) throws Exception {
        Object sourceName = this.mainQuery.selectScalar("SELECT name FROM ds_source_host WHERE shid=?", sourceHostId);
        if (sourceName == null)
            return new ResponseData("无效的数据源ID", HttpStatus.NOT_FOUND);

        SQLData data;
        SQLQuery freeQuery = new SQLQuery(this.sourceProvider);
        freeQuery.setSourceName(sourceName.toString());

        String sql;
        switch (freeQuery.getSourceType()) {
            case SQLQuery.DB_TYPE_MYSQL:
                sql = "SHOW TABLES";
                break;
            case SQLQuery.DB_TYPE_ORACLE:
                sql = "SELECT TABLE_NAME FROM USER_TABLES";
                break;
            default:
                return new ResponseData("无效的数据源类型", HttpStatus.NOT_FOUND);
        }

        data = freeQuery.select(sql);

        if (data.isEmpty()) {
            return new ResponseData("没有找到可用数据表", HttpStatus.NOT_FOUND);
        }

        // 筛选出新表
        Set<String> tableNameSet = data.getDataList().stream().map(row -> row[0].toString()).collect(Collectors.toSet());
        data = this.mainQuery.select("SELECT table_name FROM ds_source_table WHERE shid=?", sourceHostId);
        for (Object[] row : data.getDataList()) {
            tableNameSet.remove(row[0].toString());
        }

        // 将新发现的表写入 ds_source_table 中
        data.clearSchema();
        data.addSchema("shid", "table_name", "name");
        for (String table : tableNameSet) {
            data.add(sourceHostId, table, table);
        }

        List<Integer> result = this.mainQuery.insert("ds_source_table", data);
        return new ResponseData(result);
    }

    @RequestMapping(value = "/source/host/{shid}", method = RequestMethod.DELETE)
    public ResponseData sourceHostDelete(
            @PathVariable(value = "shid")
            long sourceHostId
    ) {
        SQLData data = new SQLData();
        data.addSchema("shid");
        data.add(sourceHostId);

        this.mainQuery.delete(data, "ds_source_host", "ds_source_table");

        return new ResponseData(1);
    }

    @RequestMapping(value = "/source/host/{shid}/table", method = RequestMethod.GET)
    public ResponseData sourceTableList(
            @PathVariable(value = "shid")
            long sourceHostId
    ) {
        SQLData data = new SQLData();
        data.addSchema("shid");
        data.add(sourceHostId);

        data = this.mainQuery.select("SELECT * FROM ds_source_table WHERE shid=?", sourceHostId);

        return new ResponseData(data);
    }

    @RequestMapping(value = "/source/host/{shid}/table/{stid}", method = RequestMethod.GET)
    public ResponseData sourceTableSchema(
            @PathVariable(value = "shid")
            long sourceHostId,
            @PathVariable(value = "stid")
            long sourceTableId
    ) throws Exception {
        // 连接所选数据库，取得所选表结构，返回

        SQLData data = this.mainQuery.select("SELECT   st.table_name,   sh.host,   sh.account,   sh.password,   sh.database_name,   sh.type FROM ds_source_table st, ds_source_host sh WHERE st.shid = sh.shid AND st.stid=?", sourceTableId);
        if (data.isEmpty())
            return new ResponseData(HttpStatus.NOT_FOUND);

        String hostType = data.get("type").toString();

        SQLSourceItem sourceItem = null;
        String sourceName = "ds_source_" + sourceHostId;
        String sql;
        SQLQuery freeQuery = new SQLQuery(this.sourceProvider);
        if (hostType.equals(SQLQuery.DB_TYPE_MYSQL)) {
            sourceItem = SQLSourceItem.buildMySQLDataSourceItem(sourceName,
                    data.get("host").toString(),
                    data.get("database_name").toString(),
                    data.get("account").toString(),
                    data.get("password").toString());

            sql = "SHOW CREATE TABLE " + data.get("table_name");

            this.sourceProvider.putSourceItem(sourceItem.getName(), sourceItem);
            freeQuery.setSourceName(sourceItem.getName());
            return new ResponseData(freeQuery.selectRow(sql)[1]);

        } else if (hostType.equals(SQLQuery.DB_TYPE_ORACLE)) {
            sourceItem = SQLSourceItem.buildOracleDataSourceItem(sourceName,
                    data.get("host").toString(),
                    data.get("database_name").toString(),
                    data.get("account").toString(),
                    data.get("password").toString());

            sql = String.format(
                    "SELECT dbms_metadata.get_ddl('TABLE','%s','%s') as dbschemas from DUAL",
                    data.get("table_name"),
                    data.get("account"));

            this.sourceProvider.putSourceItem(sourceItem.getName(), sourceItem);
            freeQuery.setSourceName(sourceItem.getName());
            SQLData result = freeQuery.select(sql);
            if(result.isEmpty())
                return new ResponseData(HttpStatus.NOT_FOUND);

            String schemas = result.getRow().get("dbschemas").toString();
            return new ResponseData(schemas);

        } else {
            this.log.error("无效的数据源 " + data.get("shid"));
            return new ResponseData(HttpStatus.NOT_FOUND);
        }

    }
}
