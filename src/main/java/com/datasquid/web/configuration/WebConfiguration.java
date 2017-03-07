package com.datasquid.web.configuration;

import org.springframework.beans.BeansException;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * Created by ShiXu on 2016/10/24.
 */
@Configuration
@ConfigurationProperties(value = "webConfig")
public class WebConfiguration extends WebMvcConfigurerAdapter implements ApplicationContextAware, ServletContextAware {
    private static File baseFolder;

    private ApplicationContext applicationContext;
    private ServletContext servletContext;
    private String systemName;
    private String ftlFolder;
    private String outFolder1;
    private String outFolder2;
    private String outFolder3;
    private String outFolder4;
    private String ftl1Name;
    private String ftl2Name;
    private String ftl3Name;
    private long refreshTime;

    static {
        baseFolder = getBaseFolderFromClass(WebConfiguration.class);
    }

    public WebConfiguration() {
        super();
    }

    public static void setBaseFolder(File folder) {
        baseFolder = folder;
    }

    public static void setBaseFolder(Class z) {
        baseFolder = getBaseFolderFromClass(z);
    }

    public static File getBaseFolder() {
        return baseFolder;
    }

    public static File getBaseFolderFromClass(Class z) {
        String path = z.getProtectionDomain().getCodeSource().getLocation().getPath();
        try {
            path = URLDecoder.decode(path, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return null;
        }
        if (path.startsWith("file:"))
            path = path.substring(5);
        int jarFileIndex = path.indexOf("!");
        if (jarFileIndex > -1)
            path = path.substring(0, jarFileIndex);
        File folder = new File(path);
        if (folder.isFile())
            folder = folder.getParentFile();
        return folder;
    }

    public ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public ServletContext getServletContext() {
        return servletContext;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getFtlFolder() {
        return ftlFolder;
    }

    public void setFtlFolder(String ftlFolder) {
        this.ftlFolder = ftlFolder;
    }

    public String getOutFolder1() {
        return outFolder1;
    }

    public void setOutFolder1(String outFolder1) {
        this.outFolder1 = outFolder1;
    }

    public String getOutFolder2() {
        return outFolder2;
    }

    public void setOutFolder2(String outFolder2) {
        this.outFolder2 = outFolder2;
    }

    public String getOutFolder3() {
        return outFolder3;
    }

    public void setOutFolder3(String outFolder3) {
        this.outFolder3 = outFolder3;
    }

    public String getOutFolder4() {
        return outFolder4;
    }

    public void setOutFolder4(String outFolder4) {
        this.outFolder4 = outFolder4;
    }

    public String getFtl1Name() {
        return ftl1Name;
    }

    public void setFtl1Name(String ftl1Name) {
        this.ftl1Name = ftl1Name;
    }

    public String getFtl2Name() {
        return ftl2Name;
    }

    public void setFtl2Name(String ftl2Name) {
        this.ftl2Name = ftl2Name;
    }

    public String getFtl3Name() {
        return ftl3Name;
    }

    public void setFtl3Name(String ftl3Name) {
        this.ftl3Name = ftl3Name;
    }

    public long getRefreshTime() {
        return refreshTime;
    }

    public void setRefreshTime(long refreshTime) {
        this.refreshTime = refreshTime;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        super.addResourceHandlers(registry);
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

}
