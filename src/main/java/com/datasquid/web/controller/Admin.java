package com.datasquid.web.controller;

import com.datasquid.web.configuration.WebConfiguration;
import com.datasquid.web.exception.FileNotFoundException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * Created by ShiXu on 2016/11/15.
 */
@Controller
@RequestMapping("/admin")
public class Admin extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private File templatesFolder;

    @Autowired
    private WebConfiguration webConfiguration;
    @Value("${server.ip}")
    private String serverIp;
    @Value("${server.port}")
    private String serverPort;

    @PostConstruct
    private void init() {
        this.templatesFolder = new File(WebConfiguration.getBaseFolder(), "templates");
    }

    @RequestMapping(method = RequestMethod.GET)
    public String index(@RequestParam(name = "p") String page, Model model, HttpServletRequest request) {
        ServletContext context = this.webConfiguration.getServletContext();
        if (!this.verifyTemplate(page, this.templatesFolder, log)) {
            this.log.error("找不到请求的模版文件：" + page);
            throw new FileNotFoundException();
        }
        HttpSession session = request.getSession();
        Map<String, Object> user = (Map<String, Object>) session.getAttribute("user");
        List<Object[]> subMenuList = (List<Object[]>) session.getAttribute("subMenuList");
        List<Object[]> childMenuList = (List<Object[]>) session.getAttribute("childMenuList");
        model.addAttribute("user", user);
        model.addAttribute("serverIp", serverIp);
        model.addAttribute("serverPort", serverPort);

        model.addAttribute("subMenuList", subMenuList);
        model.addAttribute("childMenuList", childMenuList);

        model.addAttribute("pageName", this.webConfiguration.getSystemName());
        model.addAttribute("basePath", "/" + context.getContextPath());
        return page;
    }

    @RequestMapping(value = "page", method = RequestMethod.GET)
    public String page(@RequestParam(name = "p") String page, Model model) {
        String pageName = "page/" + page;
        if (!this.verifyTemplate(pageName, this.templatesFolder, log)) {
            this.log.error("找不到请求的模版文件：" + page);
            throw new FileNotFoundException();
        }
        model.addAttribute("pageName", this.webConfiguration.getSystemName());
        return pageName;
    }

}
