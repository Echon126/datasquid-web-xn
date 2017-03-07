package com.datasquid.web.xn.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;

/**
 * Created by Administrator on 2017/1/23.
 */
@Component
@ConfigurationProperties(value = "signMap")
public class SignConfiguration extends HashMap<String, String> {
}
