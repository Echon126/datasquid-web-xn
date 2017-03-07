package com.datasquid.web.controller;

import com.datasquid.web.configuration.WebConfiguration;
import com.datasquid.web.data.nosql.JedisListener;
import com.datasquid.web.data.nosql.RedisPool;
import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;

import javax.annotation.PostConstruct;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.TimerTask;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Created by xcp on 2017/2/20.
 * websocket
 */
@ServerEndpoint(value = "/websocket")
@Component
public class Push {

    private Log log = LogFactory.getLog(this.getClass());

    private static int onlineCount = 0;

    private static CopyOnWriteArraySet<Push> webSocketSet = new CopyOnWriteArraySet<>();

    private Session session;

    private TimerTask task;


    private static WebConfiguration webMap;


    private static JedisListener jedisListener;

    private static Jedis jedis;

    private Thread thread;


    @Autowired
    private WebConfiguration local_webMap;

    @Autowired
    private RedisPool redisPool;

    @PostConstruct
    private void init() {
        webMap = this.local_webMap;
        jedisListener = new JedisListener(this, this.local_webMap);
//        JedisPool pool = new JedisPool(this.redisPool.getPoolConfig(), "127.0.0.1", 6379);
        this.jedis = redisPool.getResource();
    }


    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        webSocketSet.add(this);
        addOnlineCount();
        this.log.debug("有新链接加入,当前在线人数为:" + getOnlineCount());
        this.scheduling(jedisListener, jedis, this.log);
    }

    @OnClose
    public void onClose() {
        webSocketSet.remove(this);
        if (null != this.thread) this.thread.interrupt();
        subOnlineCount();
        this.log.debug("有一链接关闭,当前在线人数为:" + getOnlineCount());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        this.log.debug("来自客户端存活的消息:" + message);
    }

    public CopyOnWriteArraySet<Push> getWebSocketSet() {
        return webSocketSet;
    }


    public void sendMessages(String message) throws IOException {
        this.log.debug("数据变化,服务器推送消息:" + message);
        // 群发消息
        for (Push item : webSocketSet) {
            item.sendMessage(message);
        }
    }

    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public Session getSession() {
        return this.session;
    }

    public synchronized int getOnlineCount() {
        return this.onlineCount;
    }

    public synchronized void addOnlineCount() {
        this.onlineCount++;
    }

    public synchronized void subOnlineCount() {
        this.onlineCount--;
    }

    public void scheduling(JedisListener jedisListener, Jedis jedis, Log log) {
        this.thread = new Thread(
                () -> {
                    jedis.subscribe(jedisListener, "push_topic");//接收订阅信息
                    jedis.close();
                }
        );
        this.thread.start();
    }

}
