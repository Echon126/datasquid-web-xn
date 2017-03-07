package com.datasquid.web.data.sql;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.StringUtils;
import org.thymeleaf.util.ArrayUtils;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * SQL操作类，非线程安全的，每个线程应该持有一个独立的实例。
 * 数据源必须由 SQLSourceProvider 提供。
 *
 * Created by ShiXu on 2016/10/24.
 */
public class SQLQuery implements AutoCloseable {
    public static final String DB_TYPE_ORACLE = "ORACLE";
    public static final String DB_TYPE_MYSQL = "MYSQL";

    private Log log = LogFactory.getLog(this.getClass());
    private SQLSourceItem sourceItem;
    private String sourceType;
    private SQLSourceProvider sourceProvider;

    public SQLQuery(SQLSourceProvider sourceProvider) {
        this.sourceProvider = sourceProvider;
        this.sourceItem = this.sourceProvider.getSourceItem();
        this.loadSourceType();
    }

    public SQLSourceProvider getSourceProvider() {
        return sourceProvider;
    }

    public void setSourceProvider(SQLSourceProvider sourceProvider) {
        this.sourceProvider = sourceProvider;
    }

    public String getSourceName() {
        return this.sourceItem.getName();
    }

    public void setSourceName(String sourceName) {
        this.sourceItem = this.sourceProvider.getSourceItem(sourceName);
        this.loadSourceType();
    }

    public String getSourceType() {
        return sourceType;
    }

    private void loadSourceType() {
        this.sourceType = "";

        String databaseDriver = this.sourceItem.getDriverClassName();
        if (databaseDriver.contains("oracle"))
            this.sourceType = DB_TYPE_ORACLE;
        if (databaseDriver.contains("mysql"))
            this.sourceType = DB_TYPE_MYSQL;
    }

    private String getDataColumnSeparator() {
        switch (this.sourceType) {
            case DB_TYPE_ORACLE:
                return "\"";
            case DB_TYPE_MYSQL:
                return "`";
            default:
                return "";
        }
    }

    private void appendColumnQuotes(String[] columns, StringBuilder sql) {
        String columnSeparator = this.getDataColumnSeparator();
        String[] segments;
        String realColumn;
        for (String column : columns) {
            segments = column.split("\\.");
            realColumn = column;
            if (this.sourceType.equals(DB_TYPE_MYSQL)) {

                if (segments.length == 2) {
                    sql.append(segments[0]);
                    sql.append(".");
                    realColumn = segments[1];
                }

                sql.append(columnSeparator);
                sql.append(realColumn);
                sql.append(columnSeparator);
            }
            if (this.sourceType.equals(DB_TYPE_ORACLE)) {
                if (segments.length == 2) {
                    sql.append(realColumn);
                } else {
//                    sql.append(columnSeparator);
                    sql.append(realColumn.toUpperCase());
//                    sql.append(columnSeparator);
                }
            }

            sql.append(",");
        }
        sql.deleteCharAt(sql.length() - 1);
    }

    private Object getRealObject(ResultSet resultSet, int index) throws SQLException {
        if (this.sourceType.equals(DB_TYPE_ORACLE)) {
            int columnType = resultSet.getMetaData().getColumnType(index);
            if (columnType == -6 || columnType == 5 || columnType == 4)
                return resultSet.getInt(index);

            if (columnType == -5 || columnType == 2)
                return resultSet.getLong(index);

            if (columnType == 3 || columnType == 6 || columnType == 7 || columnType == 8)
                return resultSet.getDouble(index);
        }

        return resultSet.getObject(index);
    }

    public SQLData select(String tables, String[] columns, String condition, Object... params) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        this.appendColumnQuotes(columns, sql);
        sql.append(" FROM ");
        sql.append(tables);
        sql.append(" WHERE 1=1");

        if (!StringUtils.isEmpty(condition)) {
            sql.append(" AND ");
            sql.append(condition);
        }

        return this.select(sql, params);
    }

    public SQLData select(String sql, Object... condition) {

        this.log.debug(this.getSourceName() + " Execute SQL=" + sql);

        SQLData data = new SQLData();
        DataSource dataSource = this.sourceItem.dataSource();
        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                if (condition != null) {
                    for (int i = 0; i < condition.length; i++) {
                        statement.setObject(i + 1, condition[i]);
                    }
                }
                ResultSet resultSet = statement.executeQuery();
                data.setSchema(resultSet.getMetaData());
                data.load(resultSet, this.sourceType);
            }
            connection.commit();
        } catch (SQLException e) {
            this.log.error("执行SQL出错 " + this.getSourceName() + " " + sql, e);
        }

        return data;
    }

    public SQLData select(StringBuilder sql, Object... condition) {
        return this.select(sql.toString(), condition);
    }

    public SQLData selectWithSourceName(String sourceName, String sql, Object... condition) {
        this.setSourceName(sourceName);
        return this.select(sql, condition);
    }

    public SQLData selectWithSourceName(String sourceName, StringBuilder sql, Object... condition) {
        this.setSourceName(sourceName);
        return this.select(sql.toString(), condition);
    }

    public int insertOne(String tableName, SQLData data) {
        List<Integer> ids = this.insert(tableName, data);
        if (!ids.isEmpty())
            return ids.get(0);
        return 0;
    }

    public List<Integer> insert(String tableName, SQLData data) {
        // insert into tableName(data.schema) values(data.data)

        List<String> columnList = data.getSchemaList();

        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ").append(tableName).append(" (");
        this.appendColumnQuotes(columnList.toArray(new String[columnList.size()]), sql);
        sql.append(") VALUES(");
        for (int i = 0; i < columnList.size(); i++) {
            sql.append("?,");
        }
        sql.deleteCharAt(sql.length() - 1);
        sql.append(")");

        this.log.debug(this.getSourceName() + " Execute SQL=" + sql);

        List<Object[]> dataList = data.getDataList();
        ResultSet resultSet;
        List<Integer> keys = new ArrayList<>();
        try (Connection connection = this.sourceItem.dataSource().getConnection()) {

            try (PreparedStatement statement = connection.prepareStatement(sql.toString(), new int[]{1})) {
                for (Object[] row : dataList) {
                    for (int i = 0; i < columnList.size(); i++) {
                        statement.setObject(i + 1, row[i]);
                    }
                    statement.executeUpdate();
                    resultSet = statement.getGeneratedKeys();

                    while (resultSet.next()) {
                        keys.add(resultSet.getInt(1));
                    }
                }
            }

        } catch (SQLException e) {
            this.log.error("执行插入SQL出错 " + this.getSourceName() + " " + sql, e);
        }

        return keys;
    }

    public int update(String tableName, String[] conditionColumns, SQLData data) {
        // update tableName set data where conditionColumns=data
        List<String> columnList = data.getSchemaList();
        List<Object[]> dataList = data.getDataList();

        String columnSeparator = this.getDataColumnSeparator();
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE ");
        sql.append(tableName);
        sql.append(" SET ");

        for (String column : columnList) {
            if (ArrayUtils.contains(conditionColumns, column))
                continue;
            sql.append(columnSeparator);
            sql.append(column);
            sql.append(columnSeparator);
            sql.append(" = ?,");
        }
        sql.deleteCharAt(sql.length() - 1);
        sql.append(" WHERE ");
        for (String conditionColumn : conditionColumns) {
            sql.append(conditionColumn);
            sql.append(" = ? AND ");
        }
        sql.delete(sql.length() - 4, sql.length());

        this.log.debug(this.getSourceName() + " Execute SQL=" + sql);

        int columnIndex;
        int j;
        String column;
        try (Connection connection = this.sourceItem.dataSource().getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(sql.toString())) {
                for (Object[] row : dataList) {
                    columnIndex = 0;
                    for (int i = 0; i < columnList.size(); i++) {
                        column = columnList.get(i);
                        if (ArrayUtils.contains(conditionColumns, column))
                            continue;
                        statement.setObject(columnIndex + 1, row[i]);
                        columnIndex++;
                    }

                    for (String conditionColumn : conditionColumns) {
                        j = columnList.indexOf(conditionColumn);
                        statement.setObject(++columnIndex, row[j]);
                    }

                    statement.executeUpdate();
                }
            }
            return 1;
        } catch (SQLException e) {
            this.log.error("执行更新SQL失败 " + this.getSourceName() + " " + sql, e);
        }

        return 0;
    }

    public int delete(String tableName, SQLData data) {
        // delete from tableName where data
        List<String> columnList = data.getSchemaList();
        List<Object[]> dataList = data.getDataList();

        String columnSeparator = this.getDataColumnSeparator();
        StringBuilder sql = new StringBuilder();
        sql.append("DELETE FROM ");
        sql.append(tableName);
        sql.append(" WHERE ");
        for (String column : columnList) {
            sql.append(columnSeparator);
            sql.append(column);
            sql.append(columnSeparator);
            sql.append(" = ? AND ");
        }
        sql.delete(sql.length() - 4, sql.length());

        this.log.debug(this.getSourceName() + " Execute SQL=" + sql);

        try (Connection connection = this.sourceItem.dataSource().getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(sql.toString())) {
                for (Object[] row : dataList) {
                    for (int columnIndex = 0; columnIndex < columnList.size(); columnIndex++) {
                        this.log.debug(columnIndex + " " + row[columnIndex]);
                        statement.setObject(columnIndex + 1, row[columnIndex]);
                    }
                    statement.executeUpdate();
                }
            }
            return 1;
        } catch (SQLException e) {
            this.log.error("执行删除SQL失败 " + this.getSourceName() + " " + sql, e);
        }

        return 0;
    }

    public int delete(SQLData data, String... tableNames) {
        int result = 0;
        for (String tableName : tableNames) {
            result += this.delete(tableName, data);
        }
        return result;
    }

    public int execute(String sql, Object... condition) {

        this.log.debug(this.getSourceName() + " Execute SQL=" + sql);

        try (Connection connection = this.sourceItem.dataSource().getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                if (condition != null) {
                    for (int i = 0; i < condition.length; i++) {
                        statement.setObject(i + 1, condition[i]);
                    }
                }
                return statement.executeUpdate();
            }
        } catch (SQLException e) {
            this.log.error("执行SQL出错 " + this.getSourceName() + " " + sql, e);
        }
        return -1;
    }

    public int execute(StringBuilder sql, Object... condition) {
        return this.execute(sql.toString(), condition);
    }

    public Object selectScalar(String sql, Object... condition) throws SQLException {
        try (Connection connection = this.sourceItem.dataSource().getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                if (condition != null) {
                    for (int i = 0; i < condition.length; i++) {
                        statement.setObject(i + 1, condition[i]);
                    }
                }
                ResultSet resultSet = statement.executeQuery();
                if (resultSet.next()) {
                    return this.getRealObject(resultSet, 1);
                }
            }
        }
        return null;
    }

    public Object selectScalar(StringBuilder sql, Object... condition) throws SQLException {
        return this.selectScalar(sql.toString(), condition);
    }

    public Object[] selectRow(String sql, Object... condition) throws SQLException {
        List<Object> rowList = new ArrayList<>();
        try (Connection connection = this.sourceItem.dataSource().getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                if (condition != null) {
                    for (int i = 0; i < condition.length; i++) {
                        statement.setObject(i + 1, condition[i]);
                    }
                }
                ResultSet resultSet = statement.executeQuery();
                if (resultSet.next()) {
                    for (int i = 0; i < resultSet.getMetaData().getColumnCount(); i++) {
                        rowList.add(this.getRealObject(resultSet, i + 1));
                    }
                }
            }
        }
        return rowList.toArray();
    }

    public Object[] selectRow(StringBuilder sql, Object... condition) throws SQLException {
        return this.selectRow(sql.toString(), condition);
    }

    @Override
    public void close() throws Exception {
        this.sourceItem.close();
    }
}
