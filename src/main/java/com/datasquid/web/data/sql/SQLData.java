package com.datasquid.web.data.sql;

import com.alibaba.druid.proxy.jdbc.ClobProxyImpl;
import oracle.sql.TIMESTAMP;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.BufferedReader;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/11/17.
 */
public class SQLData {
    private Log log = LogFactory.getLog(this.getClass());
    private List<Object[]> dataList;
    private List<String> schemaList;
    private int maxRecords;
    private int rowIndex;
    private int rowCount;

    public SQLData() {
        this.dataList = new ArrayList<>();
        this.schemaList = new ArrayList<>();
        this.maxRecords = 1000;
        this.rowIndex = 0;
        this.rowCount = 0;
    }

    public int getMaxRecords() {
        return maxRecords;
    }

    public void setMaxRecords(int maxRecords) {
        this.maxRecords = maxRecords;
    }

    public List<Object[]> getDataList() {
        return dataList;
    }

    public void setDataList(List<Object[]> dataList) {
        this.dataList = dataList;
    }

    public List<String> getSchemaList() {
        return schemaList;
    }

    public void setSchemaList(List<String> schemaList) {
        this.schemaList = schemaList;
    }

    private Object convertOracleDataValue(Object value) {
        String typeName = value.getClass().getTypeName();
        if (typeName.lastIndexOf("BigDecimal") > -1) {
            return ((BigDecimal) value).longValue();
        }
        if (typeName.lastIndexOf("Clob") > -1) {
            ClobProxyImpl clobProxy = (ClobProxyImpl) value;
            try (BufferedReader reader = new BufferedReader(clobProxy.getCharacterStream())) {
                StringBuilder stringBuilder = new StringBuilder();
                reader.lines().forEach(line -> {
                    stringBuilder.append(line);
                    stringBuilder.append('\r');
                });
                return stringBuilder.toString();
            } catch (Exception e) {
                this.log.error("读取Clob失败", e);
                return value;
            }
        }
        if (typeName.lastIndexOf("TIMESTAMP") > -1) {
            oracle.sql.TIMESTAMP timestamp = (TIMESTAMP) value;
            try {
                return new Timestamp(timestamp.dateValue().getTime());
            } catch (SQLException e) {
                this.log.error("转换TIMESTAMP失败", e);
            }
        }
        return value;
    }

    public void add(Object... data) {
        this.dataList.add(data);
        this.rowCount++;
    }

    public void clear() {
        this.dataList.clear();
        this.rowIndex = 0;
        this.rowCount = 0;
    }

    public void clearSchema() {
        this.schemaList.clear();
        this.clear();
    }

    public void addSchema(String... columns) {
        for (String column : columns) {
            this.schemaList.add(column);
        }
    }

    public void setSchema(ResultSetMetaData metaData) throws SQLException {
        this.clearSchema();
        String columnName;
        for (int i = 0; i < metaData.getColumnCount(); i++) {
            columnName = metaData.getColumnLabel(i + 1);
            this.addSchema(columnName.toLowerCase());
        }
    }

    public void load(ResultSet resultSet, String dbType) throws SQLException {
        List<Object> row = new ArrayList<>();
        Object value;
        while (resultSet.next()) {
            row.clear();
            for (int i = 0; i < this.schemaList.size(); i++) {
                value = resultSet.getObject(i + 1);
                if (value == null) {
                    row.add(null);
                    continue;
                }

                if (dbType.equals(SQLQuery.DB_TYPE_ORACLE)) {
                    value = this.convertOracleDataValue(value);
                }

                if (value.getClass().equals(Timestamp.class))
                    value = ((Timestamp) value).getTime();

                row.add(value);
            }
            this.add(row.toArray());
            if (this.rowCount >= this.maxRecords)
                break;
        }
    }

    public List<Map<String, Object>> toMapList() {
        List<Map<String, Object>> mapList = new ArrayList<>();
        Map<String, Object> row;
        for (Object[] dataRow : this.dataList) {
            row = new HashMap<>();
            for (int i = 0; i < this.schemaList.size(); i++) {
                row.put(this.schemaList.get(i), dataRow[i]);
            }
            mapList.add(row);
        }

        return mapList;
    }

    public boolean isEmpty() {
        return this.dataList.isEmpty();
    }

    public Object get(String columnName) {
        String column;
        if (this.dataList.isEmpty())
            return null;
        for (int i = 0; i < this.schemaList.size(); i++) {
            column = this.schemaList.get(i);
            if (column.equals(columnName))
                return this.dataList.get(this.rowIndex)[i];
        }
        return null;
    }

    public boolean nextRow() {
        this.rowIndex++;
        return this.rowIndex < this.rowCount;
    }

    public Map<String, Object> getRow() {
        Map<String, Object> row = new HashMap<>();
        String column;
        if (this.dataList.isEmpty())
            return null;
        for (int i = 0; i < this.schemaList.size(); i++) {
            column = this.schemaList.get(i);
            row.put(column, this.dataList.get(this.rowIndex)[i]);
        }
        return row;
    }
}
