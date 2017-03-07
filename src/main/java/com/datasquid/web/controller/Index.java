package com.datasquid.web.controller;

import com.datasquid.web.configuration.WebConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletContext;

/**
 * Created by shixu on 16-12-2.
 */
@Controller
@RequestMapping("/")
public class Index extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private WebConfiguration webConfiguration;

    @RequestMapping(method = RequestMethod.GET)
    public String index(Model model) {
        ServletContext context = this.webConfiguration.getServletContext();
        model.addAttribute("pageName", this.webConfiguration.getSystemName());
        model.addAttribute("basePath", "/" + context.getContextPath());
        return "index";
    }
}
