package com.datasquid.web.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;

/**
 * Created by Administrator on 2017/1/23.
 */
@Component
@ConfigurationProperties(value = "sqlMap")
public class SQLConfiguration extends HashMap<String, String> {
}
