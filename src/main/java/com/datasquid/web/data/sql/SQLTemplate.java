package com.datasquid.web.data.sql;

/**
 * SQL脚本模板
 * Created by shixu on 17-1-12.
 */
public class SQLTemplate {
    public static final String SQL_RESULT_HIT = "CALL P_DS_CREATE_RESULT_HIT('%s')";
    public static final String SQL_RESULT_ENTITY = "CALL P_DS_CREATE_RESULT_E('%s', '%s')";
    public static final String SQL_REMOVE_VALIDATE = "CALL P_DS_DELETE_TEST()";
    public static final String SQL_CREATE_VALIDATE = "CALL P_DS_CREATE_TEST('%s')";
}
