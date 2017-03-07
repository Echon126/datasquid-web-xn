package com.datasquid;

import com.datasquid.web.configuration.WebConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * Created by ShiXu on 2016/10/24.
 */
@SpringBootApplication
@ServletComponentScan
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
public class Application {

    public static void main(String[] args) {
        WebConfiguration.setBaseFolder(Application.class);
        SpringApplication.run(Application.class);
    }
}
