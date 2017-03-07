package com.datasquid.web.controller.api.data;

import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import com.datasquid.web.data.sql.SQLTemplate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/6.
 */
@RestController
@RequestMapping("/api/data")
public class Script extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery testQuery;
    private SQLQuery mainQuery;

    @Autowired
    private SQLSourceProvider sourceProvider;

    @PostConstruct
    private void init() {
        this.testQuery = new SQLQuery(this.sourceProvider);
        this.testQuery.setSourceName("testSQL");

        this.mainQuery = new SQLQuery(this.sourceProvider);
    }

    private boolean generateResultTables(String[] resultTableNames, String[] resultTableCodes, long scriptId) {
        // generate table serialNumber and build ds_result

        if (resultTableNames.length == 0)
            return true;

        String serialNumber = String.format("%x", scriptId);

        // build DS_RESULT_ENTITY_xxxx、 DS_RESULT_xxxx and insert ds_result
        String sql;
        String tableName;
        SQLData data = new SQLData();
        data.addSchema("sid", "table_name", "name", "description", "code");
        for (int i = 0; i < resultTableNames.length; i++) {
            if (resultTableNames[i].isEmpty() || resultTableCodes[i].isEmpty())
                continue;

            tableName = String.format("%sr%x%x", serialNumber, i + 1, Math.round(Math.random() * 100000));
            data.add(scriptId, tableName, resultTableNames[i], "", resultTableCodes[i]);

            // 增加检查代码片段是否可用
            int delResult = this.testQuery.execute(SQLTemplate.SQL_REMOVE_VALIDATE);
            int testResult = this.testQuery.execute(String.format(SQLTemplate.SQL_CREATE_VALIDATE, resultTableCodes[i]));

            if (testResult == -1 || delResult == -1) {
                this.log.debug("结果表创建脚本测试失败");
                return false;
            }

            sql = String.format(SQLTemplate.SQL_RESULT_ENTITY, tableName, resultTableCodes[i]);
            this.mainQuery.execute(sql);

            sql = String.format(SQLTemplate.SQL_RESULT_HIT, tableName);
            this.mainQuery.execute(sql);
        }

        this.mainQuery.insert("ds_result", data);
        return true;
    }

    // 脚本新建
    @RequestMapping(value = "/script", method = RequestMethod.POST)
    public ResponseData scriptCreate(
            @RequestParam(value = "tid")
            long taskId,
            @RequestParam
            String name,
            @RequestParam
            String type,
            @RequestParam
            String code,
            @RequestParam(name = "result_name")
            String[] resultTableNames,
            @RequestParam(name = "result_code")
            String[] resultTableCodes
    ) throws SQLException {

        if (this.isScriptRepeat(taskId, name, 0)) {
            return new ResponseData("脚本名称:" + name + " 已存在", HttpStatus.FORBIDDEN);
        }
        Map<String, Object> map = this.isResultRepeat(taskId, resultTableNames);
        if ((boolean) map.get("repeat")) {
            return new ResponseData("结果表名称:" + map.get("repeat_time") + "已存在", HttpStatus.FORBIDDEN);
        }


        SQLData data = new SQLData();
        data.addSchema("tid", "name", "type", "code");
        data.add(taskId, name, type, code);
        int scriptId = this.mainQuery.insertOne("ds_script", data);

        boolean validateSql = this.generateResultTables(resultTableNames, resultTableCodes, scriptId);

        return new ResponseData(new HashMap() {{
            put("sid", scriptId);
            put("sql", validateSql);
        }});
    }

    @RequestMapping(value = "/script/{sid}", method = RequestMethod.GET)
    public ResponseData scriptInfo(
            @PathVariable(value = "sid")
            long scriptId
    ) {
        SQLData script;
        SQLData result;

        script = this.mainQuery.select("SELECT sid, name, type, code, create_time, last_edit, last_execute FROM ds_script WHERE sid=?", scriptId);
//        List<String> scriptIdList = script.getDataList().stream().map(row -> row[0].toString()).collect(Collectors.toList());
        String resultSQL = "SELECT rid, sid, table_name, name, description, code, create_time FROM ds_result WHERE sid=" + scriptId;
        result = this.mainQuery.select(resultSQL);

        return new ResponseData(new HashMap() {{
            put("script", script.toMapList());
            put("result", result.toMapList());
        }});
    }

    // 脚本名称重复校验
    private boolean isScriptRepeat(long tid, String name, long sid) throws SQLException {
        long count;
        String sql = "SELECT count(1) from ds_script where tid= ? and name= ?";
        if (sid != 0) {
            sql += " and sid <> ?";
            count = (long) this.mainQuery.selectScalar(sql, tid, name, sid);
        } else {
            count = (long) this.mainQuery.selectScalar(sql, tid, name);
        }
        return count > 0;
    }

    // 结果表名称重复校验
    private Map<String, Object> isResultRepeat(long tid, String[] resultTableNames) throws SQLException {
        Map<String, Object> map = new HashMap<>();
        map.put("repeat", false);

        long count;
        for (String resultTableName : resultTableNames) {
            count = (long) this.mainQuery.selectScalar("SELECT COUNT(*) FROM  ds_result r WHERE r.sid IN (SELECT sid FROM  ds_script s WHERE s.tid= ? ) AND r.name= ? ", tid, resultTableName);
            if (count > 0) {
                map.put("repeat", true);
                map.put("repeat_name", resultTableName);
                break;
            }
        }
        return map;
    }

    // 脚本修改
    @RequestMapping(value = "/script/{sid}", method = RequestMethod.PUT)
    public ResponseData scriptEdit(
            @PathVariable(value = "sid")
            long scriptId,
            @RequestParam(value = "tid")
            long taskId,
            @RequestParam
            String name,
            @RequestParam
            String type,
            @RequestParam
            String code,
            @RequestParam(name = "result_name", required = false, defaultValue = "")
            String[] resultTableNames,
            @RequestParam(name = "result_code", required = false, defaultValue = "")
            String[] resultTableCodes
    ) throws SQLException {
        if (this.isScriptRepeat(taskId, name, scriptId)) {
            return new ResponseData("脚本名称:" + name + " 已存在", HttpStatus.FORBIDDEN);
        }
        Map<String, Object> map = this.isResultRepeat(taskId, resultTableNames);
        if ((boolean) map.get("repeat")) {
            return new ResponseData("结果表名称:" + map.get("repeat_name") + "已存在", HttpStatus.FORBIDDEN);
        }

        SQLData data = new SQLData();
        data.addSchema("SID", "name", "type", "code");
        data.add(scriptId, name, type, code);


        boolean validateSql = this.generateResultTables(resultTableNames, resultTableCodes, scriptId);
        if (!validateSql) {
            return new ResponseData("结果表定义代码错误异常,更新失败", HttpStatus.FORBIDDEN);
        }
        this.mainQuery.update("ds_script", new String[]{"SID"}, data);

        return new ResponseData(new HashMap() {{
            put("sid", scriptId);
        }});
    }

    @RequestMapping(value = "/script/{sid}", method = RequestMethod.DELETE)
    public ResponseData scriptDelete(
            @PathVariable(value = "sid")
            long scriptId
    ) {
        SQLData data = new SQLData();
        data.addSchema("sid");
        data.add(scriptId);

        this.mainQuery.delete(data, "ds_script", "DS_SCRIPT_EXECUTE");

        return new ResponseData(1);
    }
}
