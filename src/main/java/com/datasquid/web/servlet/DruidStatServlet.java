package com.datasquid.web.servlet;

import com.alibaba.druid.support.http.StatViewServlet;

import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

/**
 * Created by ShiXu on 2016/10/26.
 */
@WebServlet(urlPatterns = "/druid/*",
        initParams = {
                @WebInitParam(name = "allow", value = "127.0.0.1"),
//                @WebInitParam(name = "loginUsername", value = "alacky"),
//                @WebInitParam(name = "loginPassword", value = "alacky"),
                @WebInitParam(name = "resetEnable", value = "false")
        }
)
public class DruidStatServlet extends StatViewServlet {

}
