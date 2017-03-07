package com.datasquid.web.data.sql;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.HashMap;

/**
 * Created by ShiXu on 2016/10/26.
 */
@Component
@ConfigurationProperties(prefix = "sqlSources")
public class SQLSourceProvider {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLSourceItem[] items;
    private HashMap<String, SQLSourceItem> sourceMap;
    private SQLSourceItem template;
    private String defaultSource;

    public SQLSourceProvider() {
        this.sourceMap = new HashMap<>();
    }

    public SQLSourceItem[] getItems() {
        return items;
    }

    public void setItems(SQLSourceItem[] items) {
        this.items = items;
    }

    public SQLSourceItem getTemplate() {
        return template;
    }

    public void setTemplate(SQLSourceItem template) {
        this.template = template;
    }

    public String getDefaultSource() {
        return defaultSource;
    }

    public void setDefaultSource(String defaultSource) {
        this.defaultSource = defaultSource;
    }

    public void putSourceItem(String name, SQLSourceItem item) {
        this.mergeTemplate(item);
        this.sourceMap.put(name, item);
    }

    public SQLSourceItem getSourceItem(String name) {
        if (this.sourceMap.containsKey(name))
            return this.sourceMap.get(name);
        return null;
    }

    public SQLSourceItem getSourceItem() {
        return this.getSourceItem(this.defaultSource);
    }

    @PostConstruct
    private void init() {

        // combine template
        for (SQLSourceItem item : this.items) {
            this.mergeTemplate(item);

            this.sourceMap.put(item.getName(), item);
        }

    }

    public void mergeTemplate(SQLSourceItem item) {
        if (template == null)
            return;
        if (item.getConnectionProperties() == null)
            item.setConnectionProperties(this.template.getConnectionProperties());
        if (!item.isPoolPreparedStatements())
            item.setPoolPreparedStatements(this.template.isPoolPreparedStatements());
        if (!item.isTestOnBorrow())
            item.setTestOnBorrow(this.template.isTestOnBorrow());
        if (!item.isTestOnReturn())
            item.setTestOnReturn(this.template.isTestOnReturn());
        if (!item.isTestWhileIdle())
            item.setTestWhileIdle(this.template.isTestWhileIdle());
        if (item.getDriverClassName() == null)
            item.setDriverClassName(this.template.getDriverClassName());
        if (item.getFilters() == null)
            item.setFilters(this.template.getFilters());
        if (item.getInitialSize() == 0)
            item.setInitialSize(this.template.getInitialSize());
        if (item.getMaxActive() == 0)
            item.setMaxActive(this.template.getMaxActive());
        if (item.getMaxPoolPreparedStatementPerConnectionSize() == 0)
            item.setMaxPoolPreparedStatementPerConnectionSize(this.template.getMaxPoolPreparedStatementPerConnectionSize());
        if (item.getMaxWait() == 0)
            item.setMaxWait(this.template.getMaxWait());
        if (item.getMinEvictableIdleTimeMillis() == 0)
            item.setMinEvictableIdleTimeMillis(this.template.getMinEvictableIdleTimeMillis());
        if (item.getMinIdle() == 0)
            item.setMinIdle(this.template.getMinIdle());
        if (item.getPassword() == null)
            item.setPassword(this.template.getPassword());
        if (item.getUsername() == null)
            item.setUsername(this.template.getUsername());
        if (item.getValidationQuery() == null)
            item.setValidationQuery(this.template.getValidationQuery());
        if (item.getUrl() == null)
            item.setUrl(this.template.getUrl());
    }

    public DataSource getDataSource(String name) {
        return this.sourceMap.get(name).dataSource();
    }
}