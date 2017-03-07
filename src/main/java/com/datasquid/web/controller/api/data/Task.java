package com.datasquid.web.controller.api.data;

import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.nosql.RedisPool;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import javax.annotation.PostConstruct;
import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Administrator on 2017/2/6.
 */
@RestController
@RequestMapping("/api/data")
public class Task extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery mainQuery;

    @Autowired
    private SQLSourceProvider sourceProvider;
    @Autowired
    private RedisPool redisPool;

    @PostConstruct
    private void init() {
        this.mainQuery = new SQLQuery(this.sourceProvider);
    }

    @RequestMapping(value = "/task", method = RequestMethod.GET)
    public ResponseData taskList(
            @RequestParam(name = "trigger_type")
            int triggerType,
            @RequestParam
            String name,
            @RequestParam(name = "date_start")
            long dateStart,
            @RequestParam(name = "date_end")
            long dateEnd
    ) {
        ArrayList<Object> conditions = new ArrayList<>();
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT * FROM ds_task WHERE 1=1");
        if (triggerType > 0) {
            sql.append(" AND trigger_type=");
            sql.append(triggerType);
        }
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
        sql.append(" ORDER BY create_time DESC");

        return new ResponseData(this.mainQuery.select(sql.toString(), conditions.toArray()));
    }

    @RequestMapping(value = "/task", method = RequestMethod.POST)
    public ResponseData taskCreate(
            @RequestParam
            String name,
            @RequestParam(name = "trigger_type")
            int triggerType,
            @RequestParam(name = "trigger_interval")
            int interval,
            @RequestParam(name = "start_time")
            long startTime,
            @RequestParam(name = "stop_time")
            long stopTime,
            @RequestParam(required = false, defaultValue = "0")
            int status,
            @RequestParam(required = false)
            int[] options
    ) {
        int optionsValue = 0;
        if (options != null) {
            for (int option : options) {
                optionsValue += option;
            }
        }
        SQLData data = new SQLData();
        data.addSchema("name", "trigger_type", "trigger_interval", "start_time", "stop_time", "options", "status");
        data.add(name, triggerType, interval, new Date(startTime), new Date(stopTime), status, optionsValue);
        int taskId = this.mainQuery.insertOne("ds_task", data);

        if (taskId == 0) {
            return new ResponseData(HttpStatus.FAILED_DEPENDENCY);
        }

        return new ResponseData(new HashMap() {{
            put("tid", taskId);
        }});
    }

    @RequestMapping(value = "/task/{tid}", method = RequestMethod.PUT)
    public ResponseData taskEdit(
            @PathVariable(value = "tid")
            long taskId,
            @RequestParam
            String name,
            @RequestParam(name = "trigger_type")
            int triggerType,
            @RequestParam(name = "trigger_interval")
            int interval,
            @RequestParam(name = "start_time")
            long startTime,
            @RequestParam(name = "stop_time")
            long stopTime,
            @RequestParam(required = false, defaultValue = "0")
            int status,
            @RequestParam(required = false)
            int[] options
    ) {
        if (taskId == 0) {
            return new ResponseData(HttpStatus.FAILED_DEPENDENCY);
        }

        int optionsValue = 0;
        if (options != null) {
            for (int option : options) {
                optionsValue += option;
            }
        }
        SQLData data = new SQLData();
        data.addSchema("tid", "name", "trigger_type", "trigger_interval", "start_time", "stop_time", "options", "status");
        data.add(taskId, name, triggerType, interval, new Date(startTime), new Date(stopTime), optionsValue, status);
        this.mainQuery.update("ds_task", new String[]{"tid"}, data);

        return new ResponseData(new HashMap() {{
            put("tid", taskId);
        }});
    }

    @RequestMapping(value = "/task/{tid}", method = RequestMethod.DELETE)
    public ResponseData taskDelete(
            @PathVariable(value = "tid")
            long taskId
    ) {
        // delete ds_task_source、ds_script、ds_task
        SQLData data = new SQLData();
        data.addSchema("tid");
        data.add(taskId);
        this.mainQuery.delete(data, "ds_task_source", "ds_script", "ds_task");

        return new ResponseData(1);
    }

    @RequestMapping(value = "/task/{tid}", method = RequestMethod.GET)
    public ResponseData taskInfo(
            @PathVariable(value = "tid")
            long taskId
    ) {
        SQLData source;
        SQLData script;
        SQLData result = new SQLData();

        source = this.mainQuery.select("SELECT  dts.tsid,  dts.tid,  dts.stid,  dst.name,  dst.table_name,  dts.last_position,  dts.create_time FROM ds_task_source dts left join ds_source_table dst ON dst.stid = dts.stid WHERE dts.tid=?", taskId);
        script = this.mainQuery.select("SELECT sid, name, type, code, create_time, last_edit, last_execute FROM ds_script WHERE tid=?", taskId);
        List<String> scriptIdList = script.getDataList().stream().map(row -> row[0].toString()).collect(Collectors.toList());
        if (!scriptIdList.isEmpty()) {
            String resultSQL = String.format("SELECT rid, sid, table_name, name, description, create_time FROM ds_result WHERE sid in(%s)", String.join(",", scriptIdList));
            result = this.mainQuery.select(resultSQL);
        }

        HashMap resultMap = new HashMap();
        resultMap.put("source", source.toMapList());
        resultMap.put("script", script.toMapList());
        resultMap.put("result", result.toMapList());
        return new ResponseData(resultMap);
    }

    @RequestMapping(value = "/task/{tid}/source", method = RequestMethod.POST)
    public ResponseData taskSourceAdd(
            @PathVariable(value = "tid")
            long taskId,
            @RequestParam(value = "sourceTable")
            long[] sourceTableIds
    ) {
        if ((taskId == 0) || (sourceTableIds == null))
            return new ResponseData(HttpStatus.BAD_REQUEST);
        if (sourceTableIds.length == 0)
            return new ResponseData(HttpStatus.BAD_REQUEST);

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT stid FROM ds_task_source WHERE tid=? AND stid IN(");
        Set<Long> taskSourceIdSet = new HashSet<>();
        for (long stid : sourceTableIds) {
            sql.append(stid);
            sql.append(",");
            taskSourceIdSet.add(stid);
        }
        sql.deleteCharAt(sql.length() - 1);
        sql.append(")");
        SQLData data = this.mainQuery.select(sql.toString(), taskId);

        for (Object[] row : data.getDataList()) {
            taskSourceIdSet.remove(row[0]);
        }

        data.clearSchema();
        data.addSchema("tid", "stid", "last_position");
        for (Long tsid : taskSourceIdSet) {
            data.add(taskId, tsid, 0);
        }
        List<Integer> result = this.mainQuery.insert("ds_task_source", data);

        return new ResponseData(result);
    }

    @RequestMapping(value = "/task/source/{tsid}", method = RequestMethod.GET)
    public ResponseData taskSourceInfo(
            @PathVariable(value = "tsid")
            long taskSourceId
    ) {
        SQLData sourceData = this.mainQuery.select(
                "SELECT source.tsid, source.tid, source.stid, source.sql_condition, source.create_time, stable.shid, stable.name, stable.table_name, host.host, host.database_name, host.account, host.name AS host_name, host.description, host.type FROM ds_task_source source, ds_source_table stable, ds_source_host host WHERE source.stid = stable.stid AND stable.shid = host.shid AND source.tsid = ?",
                taskSourceId);

        Map<String, Object> sourceItem = sourceData.getRow();

        String sourceName = sourceItem.get("host_name").toString();
        String sqlCondition = sourceItem.get("sql_condition").toString();
        String tableName = sourceItem.get("table_name").toString();

        SQLQuery freeQuery = new SQLQuery(this.sourceProvider);
        freeQuery.setSourceName(sourceName);

        String sql;
        if(freeQuery.getSourceType().equals(SQLQuery.DB_TYPE_ORACLE))
            sql = "SELECT * FROM (SELECT " + tableName + ".*, ROWNUM as ds_row_number FROM " + tableName + " " + sqlCondition + ") WHERE ds_row_number <= 10";
        else
            sql = "SELECT * FROM " + tableName + " " + sqlCondition + " LIMIT 10";
        SQLData preview = freeQuery.select(sql);

        HashMap<String, Object> responseData = new HashMap<>();
        responseData.put("source", sourceItem);
        responseData.put("preview", preview.toMapList());
        return new ResponseData(responseData);
    }

    @RequestMapping(value = "/task/source/{tsid}", method = RequestMethod.PUT)
    public ResponseData taskSourceInfoEdit(
            @PathVariable(value = "tsid")
            long taskSourceId,
            @RequestParam("sql_condition")
            String sqlCondition
    ) {
        SQLData data = new SQLData();
        data.addSchema("tsid", "sql_condition");
        data.add(taskSourceId, sqlCondition);
        this.mainQuery.update("ds_task_source", new String[]{"tsid"}, data);

        return new ResponseData(1);
    }

    @RequestMapping(value = "/task/source/{tsid}", method = RequestMethod.DELETE)
    public ResponseData taskSourceDelete(
            @PathVariable(value = "tsid")
            long taskSourceId
    ) {
        SQLData data = new SQLData();
        data.addSchema("tsid");
        data.add(taskSourceId);
        this.mainQuery.delete("ds_task_source", data);

        return new ResponseData(1);
    }

    @RequestMapping(value = "/task/queue/{qname}", method = RequestMethod.GET)
    public ResponseData taskQueueInfo(@PathVariable(value = "qname") String queueName) {
        List<String> result;
        try (Jedis jedis = this.redisPool.getResource()) {
            result = jedis.lrange(queueName, 0, 100);
        }
        return new ResponseData(new HashMap() {{
            put("name", queueName);
            put("preview", result);
        }});
    }

    @RequestMapping(value = "/result/{rid}", method = RequestMethod.DELETE)
    public ResponseData resultDelete(
            @PathVariable(value = "rid")
            long resultId
    ) {
        SQLData data = this.mainQuery.select("SELECT rid, table_name FROM ds_result WHERE rid=?", resultId);
        if (data.getDataList().isEmpty())
            return new ResponseData(0);

        // drop DS_RESULT_xxx and DS_RESULT_ENTITY_xxx
        Object[] row = data.getDataList().get(0);
        String dropResultSQL = "DROP TABLE ds_result_" + row[1];
        String dropResultEntitySQL = "DROP TABLE ds_result_e_" + row[1];
        this.mainQuery.execute(dropResultSQL);
        this.mainQuery.execute(dropResultEntitySQL);

        // delete ds_result
        this.mainQuery.delete("ds_result", data);

        return new ResponseData(1);
    }

    @RequestMapping(value = "/task/result/{rid}", method = RequestMethod.GET)
    public ResponseData resultInfo(
            @PathVariable(value = "rid")
            long resultId
    ) {
        SQLData resultData = this.mainQuery.select(
                "SELECT rid, sid, table_name, name, description, code, create_time FROM ds_result WHERE rid = ?",
                resultId);

        Map<String, Object> resultItem = resultData.getRow();
        String tableName = resultItem.get("table_name").toString();

        String sql = String.format(
                "SELECT t2.*, CONCAT(t1.hyear, '-', t1.hmonth, '-', t1.hday, ' ', t1.hhour, ':', t1.hminute) AS hit_time, t1.hit from ds_result_%s t1, ds_result_e_%s t2 WHERE t1.rexid=t2.rexid ORDER BY t2.create_time DESC LIMIT 10",
                tableName, tableName);
        SQLData preview = this.mainQuery.select(sql);

        HashMap<String, Object> responseData = new HashMap<>();
        responseData.put("result", resultItem);
        responseData.put("preview", preview.toMapList());
        return new ResponseData(responseData);
    }

}
