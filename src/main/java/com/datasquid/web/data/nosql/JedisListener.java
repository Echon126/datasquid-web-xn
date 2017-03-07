package com.datasquid.web.data.nosql;

import com.datasquid.web.configuration.WebConfiguration;
import com.datasquid.web.controller.Push;
import com.datasquid.web.tools.DateUtil;
import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import redis.clients.jedis.JedisPubSub;

import java.io.IOException;

/**
 * Created by Administrator on 2017/2/21.
 */
public class JedisListener extends JedisPubSub {

    private Push webSocket;
    private WebConfiguration webMap;
    private Log log = LogFactory.getLog(this.getClass());
    private long lastTime = 0;
    private long refreshTime = 10;

    public JedisListener(Push webSocket, WebConfiguration webMap) {
        this.webSocket = webSocket;
        this.webMap = webMap;
        this.refreshTime = this.webMap.getRefreshTime();
    }

    // 取得订阅的消息后的处理
    public void onMessage(String channel, String message) {
        long currentTime = Long.parseLong(DateUtil.getTimesStrNum_yyyyMMddHHmmss());
        try {
            // 当前时间 - 最后更新时间 小于 刷新时间则不进行推送
            if ((currentTime - this.lastTime) < this.refreshTime) return;
            this.lastTime = currentTime;
            this.webSocket.sendMessages(message);

        } catch (IOException e) {
            this.log.error("jedis监听通道变化后推送信息io异常", e);
        } catch (IllegalStateException i) {
            this.log.error("jedis监听通道变化后推送信息响应异常", i);
        }
    }

    // 初始化订阅时候的处理
    public void onSubscribe(String channel, int subscribedChannels) {
        // System.out.println(channel + "=" + subscribedChannels);
    }

    // 取消订阅时候的处理
    public void onUnsubscribe(String channel, int subscribedChannels) {
        // System.out.println(channel + "=" + subscribedChannels);
    }

    // 初始化按表达式的方式订阅时候的处理
    public void onPSubscribe(String pattern, int subscribedChannels) {
        // System.out.println(pattern + "=" + subscribedChannels);
    }

    // 取消按表达式的方式订阅时候的处理
    public void onPUnsubscribe(String pattern, int subscribedChannels) {
        // System.out.println(pattern + "=" + subscribedChannels);
    }

    // 取得按表达式的方式订阅的消息后的处理
    public void onPMessage(String pattern, String channel, String message) {
        System.out.println(pattern + "=" + channel + "=" + message);
    }

}
