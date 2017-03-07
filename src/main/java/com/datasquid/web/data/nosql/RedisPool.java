package com.datasquid.web.data.nosql;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import javax.annotation.PostConstruct;

/**
 * Created by shixu on 16-12-5.
 */
@Component
@ConfigurationProperties("nosqlSource")
public class RedisPool implements AutoCloseable {
    private Log log = LogFactory.getLog(this.getClass());
    private String host;
    private int port;
    private JedisPool pool;
    private JedisPoolConfig poolConfig;


    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public JedisPoolConfig getPoolConfig() {
        return poolConfig;
    }

    public void setPoolConfig(JedisPoolConfig poolConfig) {
        this.poolConfig = poolConfig;
    }

    @Override
    public void close() throws Exception {
        if (this.pool != null && !this.pool.isClosed()) {
            this.pool.close();
        }
    }

    @PostConstruct
    public boolean init() throws Exception {
        this.close();

        this.pool = new JedisPool(this.poolConfig, this.host, this.port);
        try (Jedis jedis = this.pool.getResource()) {
            jedis.echo("go");
            return true;
        } catch (Exception ex) {
            this.log.error(String.format("尝试连接 redis://%s:%d 失败", host, port), ex);
            return false;
        }
    }

    public Jedis getResource() {
        return this.pool.getResource();
    }
}
