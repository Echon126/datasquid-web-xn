package com.datasquid.web.report;


import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.*;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/15.
 */
public class BuildTemplate {

    private Configuration configuration = null;

    public BuildTemplate() {
        configuration = new Configuration();
        configuration.setDefaultEncoding("utf-8");
        try {
            freemarker.log.Logger.selectLoggerLibrary(freemarker.log.Logger.LIBRARY_NONE);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * ftlFolder  ftl模版文件夹
     * ftlName    ftl模版文件名
     * dataMap    表格数据
     * outFile    输出文件
     */
    public void buildExcel(File ftlFolder, String ftlName, Map dataMap, File outFile) throws IOException, TemplateException {
        Template t;
        configuration.setDirectoryForTemplateLoading(ftlFolder);
        configuration.setObjectWrapper(new DefaultObjectWrapper());
        configuration.setTemplateUpdateDelay(0);
        configuration.setCacheStorage(new freemarker.cache.MruCacheStorage(100, 2500));
        t = configuration.getTemplate(ftlName);
        t.setEncoding("utf-8");

        // 输出文档路径及名称
        Writer out;
        out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile), "utf-8"));
        t.process(dataMap, out);
        if (null != out) out.close();
    }

//    public static void main(String[] args) {
//        BuildTemplate b = new BuildTemplate();
//        Map map = new HashMap();
//        map.put("date", "2017年1月");

//        //表格1
//        for (int i = 1; i <= 17; i++) {
//            map.put("val1_" + i, "1行" + i + "列");
//            map.put("val2_" + i, "1行" + i + "列");
//            map.put("val3_" + i, "1行" + i + "列");
//            map.put("val4_" + i, "1行" + i + "列");
//            map.put("val5_" + i, "1行" + i + "列");
//        }
//        File ftlFolder = new File("e:\\test");
//        String ftlName = "excel1.ftl";
//        File outFile = new File("E:\\test\\excel1.xls");

//        //表格2
//        for (int i = 1; i <= 24; i++) {
//            map.put("val" + i,i);
//        }
//        File ftlFolder = new File("e:\\test");
//        String ftlName = "excel2.ftl";
//        File outFile = new File("E:\\test\\excel2.xls");

//        //表格3
//        for (int i = 1; i <= 12; i++) {
//            map.put("val" + i, i);
//        }
//        File ftlFolder = new File("e:\\test");
//        String ftlName = "excel3.ftl";
//        File outFile = new File("E:\\test\\excel3.xls");
//
//        try {
//            b.buildExcel(ftlFolder, ftlName, map, outFile);
//        } catch (IOException e) {
//            e.printStackTrace();
//        } catch (TemplateException e) {
//            e.printStackTrace();
//        }
//    }

}