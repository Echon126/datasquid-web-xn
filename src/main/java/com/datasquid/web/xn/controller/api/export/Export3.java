package com.datasquid.web.xn.controller.api.export;

import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.report.BuildTemplate;
import com.datasquid.web.tools.DateUtil;
import freemarker.template.TemplateException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by xcp on 2017/2/15.
 * 报表导出3
 */
@RestController
@RequestMapping("/api/export3")
public class Export3 extends BaseExport {

    private Log log = LogFactory.getLog(this.getClass());

    // 报表目录查询
    @RequestMapping(value = "query", method = RequestMethod.GET)
    public ResponseData download() {
        String[] fileList = this.report3Folder.list();
        Map<String, String> map;
        String fileName;
        String createTimeStr;
        String createTime;
        List<Map> list = new ArrayList<>();
        if (null != fileList && fileList.length > 0) {
            for (String aFileList : fileList) {
                map = new HashMap();
                fileName = aFileList;
                createTimeStr = fileName.split("_")[1];
                createTime = this.getCreateTime(createTimeStr);
                map.put("sign", "report3");
                map.put("name", fileName);
                map.put("createTime", createTime);
                list.add(map);
            }
        }
        return new ResponseData(list);
    }


    // 下载报表3
    @RequestMapping(value = "download_excel3", method = RequestMethod.GET)
    public ResponseData downloadReport3(@RequestParam(name = "time") String time) {
        // 获取查询map数据
        String outPath;
        Map map;
        try {
            map = getReport3Data(time);
            // 生成excel
            BuildTemplate template = new BuildTemplate();

            // 生成excel报表名称
            String fileName = "report3-" + time.replace("-", "") + "_" + DateUtil.getTimesStrNum_yyyyMMddHHmmssSSS() + ".xls";
            outPath = this.outFolder3Path + File.separator + fileName;
            File outFile = new File(outPath);
            map.put("file3Name", fileName);

            template.buildExcel(this.ftlFolder, webMap.getFtl3Name(), map, outFile);
        } catch (IOException e) {
            this.log.error("文件读取异常", e);
            return new ResponseData("文件读取异常", HttpStatus.FAILED_DEPENDENCY);
        } catch (TemplateException e) {
            this.log.error("报表模版匹配异常", e);
            return new ResponseData("报表模版匹配异常", HttpStatus.FAILED_DEPENDENCY);
        } catch (Exception e) {
            this.log.error("报表导出操作异常", e);
            return new ResponseData("操作异常", HttpStatus.FAILED_DEPENDENCY);
        }
        return new ResponseData(map);
    }

    // 获取并封装报表所需map数据

    private Map getReport3Data(String time) {
        Map<String, String> map = new HashMap();
        String[] times = time.split("-");
        map.put("date", times[0] + "年" + times[1] + "月");
        int lastYear = Integer.parseInt(times[0]) - 1;
        String lastYearTime = lastYear + "-" + times[1];
        String customsCodeStr = this.getCustomsCodeStr();
        //进口月份交易额
        this.getImportCurrentMonthData3(map, time, lastYearTime, customsCodeStr);
        //进口年内累计交易额
        this.getImportCurrentYearData3(map, times[0], String.valueOf(lastYear), time, lastYearTime, customsCodeStr);
        //出口月份交易额
        this.getExportCurrentMonthData3(map, time, lastYearTime, customsCodeStr);
        //出口年内累计交易额
        this.getExportCurrentYearData3(map, times[0], String.valueOf(lastYear), time, lastYearTime, customsCodeStr);
        return map;
    }

    // 获取进口本月交易额
    private void getImportCurrentMonthData3(Map<String, String> map, String time, String lastYearTime, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report3i_month_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData1 = this.wtQuery.select(sql1);

        List<Object[]> list1 = sqlData1.getDataList();
        long currentEachPrice;
        double currentTotalPrice = 0.0;
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = list1.get(i);
            currentEachPrice = (long) ((null == obj[2]) ? "0" : obj[2]);
            currentTotalPrice += currentEachPrice;
        }
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        String total = df.format(currentTotalPrice / 10000);
        map.put("val4", total);
        map.put("val5", total);

        // 查询去年选中月数据（做对比）
        String sql2 = this.sqlMap.get("report3i_month_money");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData2 = this.wtQuery.select(sql2);
        List<Object[]> list2 = sqlData2.getDataList();
        String rate = this.getRate(list2, currentTotalPrice);
        map.put("val6", rate);

    }

    // 获取进口年内累计交易额
    private void getImportCurrentYearData3(Map<String, String> map, String year, String lastYear, String time, String lastYearTime, String customsCodeStr) {
        // 当前选中年年内累计交易额
        String sql1 = this.sqlMap.get("report3i_year_money");
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData1 = this.wtQuery.select(sql1);
        List<Object[]> list1 = sqlData1.getDataList();
        long currentEachPrice;
        double currentTotalPrice = 0.0;
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = list1.get(i);
            currentEachPrice = (long) ((null == obj[2]) ? "0" : obj[2]);
            currentTotalPrice += currentEachPrice;
        }
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        String total = df.format(currentTotalPrice / 10000);
        map.put("val10", total);
        map.put("val11", total);

        // 查询选中年去年年内累计交易额（做对比）
        String sql2 = this.sqlMap.get("report3i_year_money");
        sql2 = sql2.replace("?year?", lastYear);
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData2 = this.wtQuery.select(sql2);
        List<Object[]> list2 = sqlData2.getDataList();
        String rate = this.getRate(list2, currentTotalPrice);
        map.put("val12", rate);
    }


    // 获取出口本月交易额
    private void getExportCurrentMonthData3(Map<String, String> map, String time, String lastYearTime, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report3e_month_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData1 = this.mhQuery.select(sql1);
        List<Object[]> list1 = sqlData1.getDataList();
        long currentEachPrice;
        double currentTotalPrice = 0.0;
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = list1.get(i);
            currentEachPrice = (long) ((null == obj[2]) ? "0" : obj[2]);
            currentTotalPrice += currentEachPrice;
        }
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        String total = df.format(currentTotalPrice / 10000);

        map.put("val1", total);
        map.put("val2", total);
        // 查询去年选中月数据（做对比）
        String sql2 = this.sqlMap.get("report3e_month_money");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData2 = this.mhQuery.select(sql2);
        List<Object[]> list2 = sqlData2.getDataList();
        String rate = this.getRate(list2, currentTotalPrice);
        map.put("val3", rate);

    }

    // 获取出口年内累计交易额
    private void getExportCurrentYearData3(Map<String, String> map, String year, String lastYear, String time, String lastYearTime, String customsCodeStr) {
        // 当前选中年年内累计交易额
        String sql1 = this.sqlMap.get("report3e_year_money");
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData1 = this.mhQuery.select(sql1);
        List<Object[]> list1 = sqlData1.getDataList();
        long currentEachPrice;
        double currentTotalPrice = 0.0;
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = list1.get(i);
            currentEachPrice = (long) ((null == obj[2]) ? "0" : obj[2]);
            currentTotalPrice += currentEachPrice;
        }
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        String total = df.format(currentTotalPrice / 10000);
        map.put("val7", total);
        map.put("val8", total);

        // 查询选中年去年年内累计交易额（做对比）
        String sql2 = this.sqlMap.get("report3e_year_money");
        sql2 = sql2.replace("?year?", lastYear);
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData sqlData2 = this.mhQuery.select(sql2);
        List<Object[]> list2 = sqlData2.getDataList();
        String rate = this.getRate(list2, currentTotalPrice);
        map.put("val9", rate);
    }


    // 计算同比
    private String getRate(List<Object[]> list, double currentTotalPrice) {
        String rate;
        if (!CollectionUtils.isEmpty(list)) {
            double lastTotalPrice = list.get(0)[2] == null ? 0 : (long) list.get(0)[2];
            if (lastTotalPrice == 0) {
                if (currentTotalPrice > 0) {
                    rate = "100%";
                } else {
                    rate = "0%";
                }
            } else {
                DecimalFormat df = new DecimalFormat("0.00");//格式化小数
                rate = df.format(((currentTotalPrice / lastTotalPrice) - 1) * 100) + "%";
            }
        } else {
            if (currentTotalPrice > 0) {
                rate = "100%";
            } else {
                rate = "0%";
            }
        }
        return rate;
    }


}
