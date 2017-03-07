package com.datasquid.web.xn.controller.api.export;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.report.BuildTemplate;
import com.datasquid.web.tools.DateUtil;
import freemarker.template.TemplateException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 跨境电子商务业务统计报表
 * Created by Administrator on 2017/2/14.
 */
@RestController
@RequestMapping("/api/export1")
public class Export1 extends BaseExport {

    private Log log = LogFactory.getLog(this.getClass());


    // 报表目录查询
    @RequestMapping(value = "/query", method = RequestMethod.GET)
    public ResponseData selectFile() {
        String[] fileList = this.report1Folder.list();
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
                map.put("sign", "report1");
                map.put("name", fileName);
                map.put("createTime", createTime);
                list.add(map);
            }
        }
        return new ResponseData(list);
    }


    @RequestMapping(value = "/download_excel1/{time}", method = RequestMethod.GET)
    public ResponseData excel1Export(@PathVariable(value = "time")
                                             String time) throws IOException {
        String outPath;
        Map map;
        try {
            map = this.getData(time);
            BuildTemplate template = new BuildTemplate();
            String ftlFolderPath = webMap.getFtlFolder();
            File ftlFolder = new File(ftlFolderPath);
            String fileName = "report1-" + time.replace("-", "") + "_" + DateUtil.getTimesStrNum_yyyyMMddHHmmssSSS() + ".xls";
            outPath = this.outFolder1Path + File.separator + fileName;
            File outFile = new File(outPath);
            map.put("file1Name", fileName);
            template.buildExcel(ftlFolder, webMap.getFtl1Name(), map, outFile);
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


    //获取表格一的所有数据(跨境电子商务业务统计报表)
    public Map getData(String time) {
        Map mp = new HashMap();
        String[] times = time.split("-");
        mp.put("date", times[0] + "年" + times[1] + "月");
        int lastYear = Integer.parseInt(times[0]) - 1;
        String customsCodeStr = this.getCustomsCodeStr();
        this.getData01(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData02(mp, time, times[0], customsCodeStr);
        this.getData03(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData04(mp, time, times[0], customsCodeStr);
        this.getData05(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData06(mp, time, times[0], customsCodeStr);
        this.getData07(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData08(mp, time, times[0], customsCodeStr);
        this.getData09(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData10(mp, time, times[0], customsCodeStr);
        this.getData11(mp, time, lastYear + "-" + times[1], customsCodeStr);
        this.getData12(mp, time, times[0], customsCodeStr);
        return mp;
    }

    //计算同比
    public String getProportion(double currentValue, double lastValue) {
        String Proportion;
        if (lastValue == 0 && currentValue > 0) {
            Proportion = "100%";
        } else if (currentValue == 0) {
            Proportion = "0%";
        } else {
            DecimalFormat decimalFormat = new DecimalFormat("0.00");//格式化小数
            Proportion = decimalFormat.format(((currentValue / lastValue) - 1) * 100) + "%";
        }
        return Proportion;
    }

    //进口业务(本月单量)
    public void getData01(Map mp, String time, String lastYearTime, String customsCodeStr) {
        //当年的值
        String sql1 = this.sqlMap.get("report1i_month_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.wtQuery.select(sql1);
        List list1 = data1.getDataList();
        double total = 0;
        //补全当年空数据
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_1")) {
                mp.put("val" + (i) + "_1", "0");
            }
        }
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = (Object[]) list1.get(i);
            long num = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col1_" + customs) != null) {
                total += num;
            }
            mp.put(this.customsMap.get("col1_" + customs) == null ? "useless" : this.customsMap.get("col1_" + customs), num);
        }

        mp.put("val5_1", total);

        //前一年的值
        String sql2 = this.sqlMap.get("report1i_month_number");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData data2 = this.wtQuery.select(sql2);
        List list2 = data2.getDataList();
        //同比合计
        long lastTotal = 0;
        String Proportion;
        //补全去年空数据
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_2")) {
                mp.put("val" + (i) + "_2", "0");
            }
        }
        for (int i = 0; i < list2.size(); i++) {
            Object[] obj = (Object[]) list2.get(i);
            long lastValue = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();

            lastTotal += lastValue;
            String current = mp.get(this.customsMap.get("col1_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col1_" + customs)).toString();//当月的值
            long currentValue = Long.parseLong(current);
            Proportion = this.getProportion(currentValue, lastValue);
            mp.put(this.customsMap.get("col2_" + customs) == null ? "useless" : this.customsMap.get("col2_" + customs), Proportion);
        }
        String proportionTotal = this.getProportion(total, lastTotal);
        mp.put("val5_2", proportionTotal);

    }

    //进口业务(今年累计单量)
    public void getData02(Map mp, String time, String year, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1i_year_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.wtQuery.select(sql1);
        List list1 = data1.getDataList();
        long total = 0;
        // 补充今年累计单量空数据
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_3")) {
                mp.put("val" + (i) + "_3", "0");
            }
        }
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = (Object[]) list1.get(i);
            long num = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col3_" + customs) != null) {
                total += num;
            }
            mp.put(this.customsMap.get("col3_" + customs) == null ? "useless" : this.customsMap.get("col3_" + customs), num);
        }
        mp.put("val5_3", total);
    }

    //进口业务(本月货值)
    public void getData03(Map mp, String time, String lastYearTime, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1i_month_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.wtQuery.select(sql1);
        List list = data1.getDataList();
        double total = 0;
        double currentEachPrice;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_4")) {
                mp.put("val" + (i) + "_4", "0");
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Object[] obj = (Object[]) list.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentEachPrice = Double.valueOf(obj[3].toString());
            String total_price = df.format(currentEachPrice / 10000);
            if (this.customsMap.get("col4_" + customs) != null) {
                total += currentEachPrice;
            }
            mp.put(this.customsMap.get("col4_" + customs) == null ? "useless" : this.customsMap.get("col4_" + customs), total_price == null ? "0" : total_price);
        }

        mp.put("val5_4", df.format(total / 10000));

        //前一年本月的值
        String sql2 = this.sqlMap.get("report1i_month_money");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData data2 = this.wtQuery.select(sql2);
        List list2 = data2.getDataList();
        //同比合计
        double lastTotal = 0;
        String Proportion;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_5")) {
                mp.put("val" + (i) + "_5", "0");
            }
        }

        double lastEachValue;
        for (int i = 0; i < list2.size(); i++) {
            Object[] obj = (Object[]) list2.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            lastEachValue = Double.valueOf(obj[3].toString());
            String total_price = df.format(lastEachValue / 10000);

            if (this.customsMap.get("col5_" + customs) != null) {
                lastTotal += lastEachValue;
            }

            String current = mp.get(this.customsMap.get("col4_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col4_" + customs)).toString();//当年的值
            double currentValue = Double.valueOf(current);
            Proportion = this.getProportion(currentValue, Double.valueOf(total_price));

            mp.put(this.customsMap.get("col5_" + customs) == null ? "useless" : this.customsMap.get("col5_" + customs), Proportion);
        }
        String proportionTotal = this.getProportion(total, lastTotal);

        mp.put("val5_5", proportionTotal);

    }

    //进口业务(今年累计货值)
    public void getData04(Map mp, String time, String year, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1i_year_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        SQLData data = this.wtQuery.select(sql1);
        List list = data.getDataList();
        double total = 0;
        double currentTotalPrice;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_6")) {
                mp.put("val" + (i) + "_6", "0");
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Object[] obj = (Object[]) list.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentTotalPrice = Double.valueOf(obj[3].toString());
            String total_price = df.format(currentTotalPrice / 10000);
            if (this.customsMap.get("col6_" + customs) != null) {
                total += currentTotalPrice;
            }
            mp.put(this.customsMap.get("col6_" + customs) == null ? "useless" : this.customsMap.get("col6_" + customs), total_price == null ? "0" : total_price);
        }

        mp.put("val5_6", df.format(total / 10000));
    }

    //出口业务(本月数量)
    public void getData05(Map mp, String time, String lastYearTime, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1e_month_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.mhQuery.select(sql1);
        List list = data1.getDataList();
        long total = 0;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_7")) {
                mp.put("val" + (i) + "_7", "0");
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Object[] obj = (Object[]) list.get(i);
            long num = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col7_" + customs) != null) {
                total += num;
            }
            mp.put(this.customsMap.get("col7_" + customs) == null ? "useless" : this.customsMap.get("col7_" + customs), num);
        }
        mp.put("val5_7", total);

        //前一年的值
        String sql2 = this.sqlMap.get("report1e_month_number");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data2 = this.mhQuery.select(sql2);
        List list2 = data2.getDataList();
        //同比合计
        long lastTotal = 0;
        String Proportion;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_8")) {
                mp.put("val" + (i) + "_8", "0");
            }
        }
        for (int i = 0; i < list2.size(); i++) {
            Object[] obj = (Object[]) list2.get(i);
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            long lastValue = Long.parseLong(obj[1].toString());
            if (this.customsMap.get("col8_" + customs) != null) {
                lastTotal += lastValue;
            }

            String current = mp.get(this.customsMap.get("col7_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col7_" + customs)).toString();//当月的值
            double currentValue = Double.parseDouble(current);
            Proportion = this.getProportion(currentValue, lastValue);

            mp.put(this.customsMap.get("col8_" + customs) == null ? "useless" : this.customsMap.get("col8_" + customs), Proportion);
        }
        String proportionTotal = this.getProportion(total, lastTotal);
        mp.put("val5_8", proportionTotal);

    }

    //出口业务单量今年累计
    public void getData06(Map mp, String time, String year, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1e_year_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.mhQuery.select(sql1);
        List list1 = data1.getDataList();
        long total = 0;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_9")) {
                mp.put("val" + (i) + "_9", "0");
            }
        }
        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = (Object[]) list1.get(i);
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            long value = Long.valueOf(obj[1].toString());
            if (this.customsMap.get("col9_" + customs) != null) {
                total += value;
            }
            mp.put(this.customsMap.get("col9_" + customs) == null ? "useless" : this.customsMap.get("col9_" + customs), value);
        }
        mp.put("val5_9", total);
    }

    //出口业务(本月货值)
    public void getData07(Map mp, String time, String lastYearTime, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1e_month_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data1 = this.mhQuery.select(sql1);
        List list1 = data1.getDataList();
        double total = 0;
        double currentEachPrice;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_10")) {
                mp.put("val" + (i) + "_10", "0");
            }
        }

        for (int i = 0; i < list1.size(); i++) {
            Object[] obj = (Object[]) list1.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentEachPrice = Double.valueOf(obj[3].toString());
            String total_price = df.format(currentEachPrice / 10000);
            if (this.customsMap.get("col10_" + customs) != null) {
                total += currentEachPrice;
            }
            mp.put(this.customsMap.get("col10_" + customs) == null ? "useless" : this.customsMap.get("col10_" + customs), total_price == null ? "0" : total_price);
        }

        mp.put("val5_10", df.format(total / 10000));

        //前一年的值
        //同比合计
        double lastTotal = 0;
        String sql2 = this.sqlMap.get("report1e_month_money");
        sql2 = sql2.replace("?time?", lastYearTime);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data2 = this.mhQuery.select(sql2);
        List list2 = data2.getDataList();
        String Proportion;
        double lastEachPrice;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_11")) {
                mp.put("val" + (i) + "_11", "0");
            }
        }
        for (int i = 0; i < list2.size(); i++) {
            Object[] obj = (Object[]) list2.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            String current = mp.get(this.customsMap.get("col10_" + customs)).toString();//当年的值
            lastEachPrice = Double.valueOf(obj[3].toString());

            if (this.customsMap.get("col11_" + customs) != null) {
                lastTotal += lastEachPrice;
            }

            double currentValue = Double.valueOf(current);
            Proportion = this.getProportion(currentValue, lastEachPrice / 10000);

            mp.put(this.customsMap.get("col11_" + customs) == null ? "useless" : this.customsMap.get("col11_" + customs), Proportion);
        }
        String proportionTotal = this.getProportion(total, lastTotal);
        mp.put("val5_11", proportionTotal);

    }

    //出口业务(今年累计)
    public void getData08(Map mp, String time, String year, String customsCodeStr) {
        String sql1 = this.sqlMap.get("report1e_year_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData data = this.mhQuery.select(sql1);
        List list = data.getDataList();
        double total = 0;
        double currentEachPrice;
        String year_month;
        String[] times;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        String total_price;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_12")) {
                mp.put("val" + (i) + "_12", "0");
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Object[] obj = (Object[]) list.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentEachPrice = Double.valueOf(obj[3].toString());
            total_price = df.format(currentEachPrice / 10000);
            if (this.customsMap.get("col12_" + customs) != null) {
                total += currentEachPrice;
            }
            mp.put(this.customsMap.get("col12_" + customs) == null ? "useless" : this.customsMap.get("col12_" + customs), total_price == null ? "0" : total_price);
        }

        mp.put("val5_12", df.format(total / 10000));
    }

    //进出口合计业务(本月数量)
    public void getData09(Map mp, String time, String lastYearTime, String customsCodeStr) {
        double total = 0;
        //进口
        String sql1 = this.sqlMap.get("report1i_month_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData dataJK = this.wtQuery.select(sql1);
        //出口
        String sql2 = this.sqlMap.get("report1e_month_number");
        sql2 = sql2.replace("?time?", time);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");
        SQLData dataCK = this.mhQuery.select(sql2);

        List listJK = dataJK.getDataList();
        List listCK = dataCK.getDataList();
        long value;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_13")) {
                mp.put("val" + (i) + "_13", "0");
            }
        }
        for (int i = 0; i < listJK.size(); i++) {
            Object[] obj = (Object[]) listJK.get(i);
            value = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col13_" + customs) != null) {
                total += value;
            }
            mp.put(this.customsMap.get("col13_" + customs) == null ? "useless" : this.customsMap.get("col13_" + customs), value);
        }
        for (int i = 0; i < listCK.size(); i++) {
            double valueJK;
            double valueJC;
            Object[] obj = (Object[]) listCK.get(i);
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            double valueCK = Double.valueOf(obj[1].toString());
            String jkValue = mp.get(this.customsMap.get("col13_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col13_" + customs)).toString();
            valueJK = Integer.valueOf(jkValue);
            valueJC = valueCK + valueJK;
            mp.put(this.customsMap.get("col13_" + customs) == null ? "useless" : this.customsMap.get("col13_" + customs), valueJC);
            if (this.customsMap.get("col13_" + customs) != null) {
                total += valueCK;
            }
        }

        mp.put("val5_13", total);

        //前一年的值
        //进口
        String sql3 = this.sqlMap.get("report1i_month_number");
        sql3 = sql3.replace("?time?", lastYearTime);
        sql3 = sql3.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData dataLastJK = this.wtQuery.select(sql3);
        //出口
        String sql4 = this.sqlMap.get("report1e_month_number");
        sql4 = sql4.replace("?time?", lastYearTime);
        sql4 = sql4.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");
        SQLData dataLastCK = this.mhQuery.select(sql4);

        List listLastJK = dataLastJK.getDataList();
        List listLastCK = dataLastCK.getDataList();
        //同比合计
        long lastTotal = 0;
        String Proportion;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_14")) {
                mp.put("val" + (i) + "_14", "0");
            }
        }
        Map map = new HashMap();
        for (int i = 1; i <= 4; i++) {
            if (!map.containsKey("val" + (i) + "_14")) {
                map.put("val" + (i) + "_13", "0");
            }
        }
        //出口的数据
        for (int i = 0; i < listLastCK.size(); i++) {
            Object[] obj = (Object[]) listLastCK.get(i);
            long lastValue = Long.parseLong(obj[1].toString());
            String customs = (null == obj[0] ? "" : obj[0].toString());
            map.put(this.customsMap.get("col13_" + customs) == null ? "useless" : this.customsMap.get("col13_" + customs), lastValue);
            if (this.customsMap.get("col13_" + customs) != null) {
                lastTotal += lastValue;
            }
        }
        //进口的数据
        for (int i = 0; i < listLastJK.size(); i++) {
            double valueLastJK;
            double valueLastCK;
            Object[] obj = (Object[]) listLastJK.get(i);
            valueLastJK = Long.parseLong(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col13_" + customs) != null) {
                lastTotal += valueLastJK;
            }
            String CkvalueLast = map.get(this.customsMap.get("col13_" + customs) == null ? "useless" : this.customsMap.get("col13_" + customs)).toString();
            valueLastCK = Integer.valueOf(CkvalueLast);
            double lastValue = valueLastCK + valueLastJK;
            String current = mp.get(this.customsMap.get("col13_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col13_" + customs)).toString();
            long currentValue = Long.parseLong(current);

            Proportion = this.getProportion(currentValue, lastValue);

            mp.put(this.customsMap.get("col14_" + customs) == null ? "useless" : this.customsMap.get("col14_" + customs), Proportion);
        }
        String proportionTotal = this.getProportion(total, lastTotal);
        mp.put("val5_14", proportionTotal);

    }

    //进出口合计业务(今年累计)
    public void getData10(Map mp, String time, String year, String customsCodeStr) {
        double total = 0;
        //进口累计
        String sql1 = this.sqlMap.get("report1i_year_number");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData dataJK = this.wtQuery.select(sql1);
        //出口累计
        String sql2 = this.sqlMap.get("report1e_year_number");
        sql2 = sql2.replace("?time?", time);
        sql2 = sql2.replace("?year?", year);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");
        SQLData dataCK = this.mhQuery.select(sql2);

        List listJK = dataJK.getDataList();
        List listCK = dataCK.getDataList();
        long value;
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_15")) {
                mp.put("val" + (i) + "_15", "0");
            }
        }
        for (int i = 0; i < listJK.size(); i++) {
            Object[] obj = (Object[]) listJK.get(i);
            value = Long.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            if (this.customsMap.get("col15_" + customs) != null) {
                total += value;
            }

            mp.put(this.customsMap.get("col15_" + customs) == null ? "useless" : this.customsMap.get("col15_" + customs), value);
        }
        for (int i = 0; i < listCK.size(); i++) {
            double valueJK;
            double valueJC;
            Object[] obj = (Object[]) listCK.get(i);
            double valueCK = Double.valueOf(obj[1].toString());
            String customs = (null == obj[0]) ? "" : obj[0].toString();
            String jkValue = mp.get(this.customsMap.get("col15_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col15_" + customs)).toString();
            valueJK = Double.valueOf(jkValue);
            valueJC = valueCK + valueJK;
            mp.put(this.customsMap.get("col15_" + customs) == null ? "useless" : this.customsMap.get("col15_" + customs), valueJC);
            if (this.customsMap.get("col15_" + customs) != null) {
                total += valueCK;
            }
        }
        mp.put("val5_15", total);
    }

    //进出口合计业务(本月货值)
    public void getData11(Map mp, String time, String lastYearTime, String customsCodeStr) {
        double total = 0;
        //进口货值
        String sql1 = this.sqlMap.get("report1i_month_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData dataJK = this.wtQuery.select(sql1);
        //进口货值
        String sql2 = this.sqlMap.get("report1e_month_money");
        sql2 = sql2.replace("?time?", time);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        SQLData dataCK = this.mhQuery.select(sql2);
        List listJK = dataJK.getDataList();
        List listCK = dataCK.getDataList();
        double currentTotalPriceJK;
        double currentTotalPriceCK;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_16")) {
                mp.put("val" + (i) + "_16", "0");
            }
        }
        for (int i = 0; i < listJK.size(); i++) {
            Object[] obj = (Object[]) listJK.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentTotalPriceJK = Double.valueOf(obj[3].toString());
            String total_price = df.format(currentTotalPriceJK / 10000);
            if (this.customsMap.get("col16_" + customs) != null) {
                total += currentTotalPriceJK;
            }
            mp.put(this.customsMap.get("col16_" + customs) == null ? "useless" : this.customsMap.get("col16_" + customs), total_price);
        }
        for (int i = 0; i < listCK.size(); i++) {
            double valueJK;
            double valueJC;
            Object[] obj = (Object[]) listCK.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentTotalPriceCK = Double.valueOf(obj[3].toString());
            String value = mp.get(this.customsMap.get("col16_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col16_" + customs)).toString();
            valueJK = Double.valueOf(value);
            valueJC = (currentTotalPriceCK / 10000) + valueJK;
            String total_price = df.format(valueJC);
            mp.put(this.customsMap.get("col16_" + customs) == null ? "useless" : this.customsMap.get("col16_" + customs), total_price);
            if (this.customsMap.get("col16_" + customs) != null) {
                total += currentTotalPriceCK;
            }
        }
        mp.put("val5_16", df.format(total / 10000));
    }

    //进出口合计业务(今年累计)
    public void getData12(Map mp, String time, String year, String customsCodeStr) {
        double total = 0;
        //进口
        String sql1 = this.sqlMap.get("report1i_year_money");
        sql1 = sql1.replace("?time?", time);
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");
        SQLData dataJK = this.wtQuery.select(sql1);
        //出口
        String sql2 = this.sqlMap.get("report1e_year_money");
        sql2 = sql2.replace("?time?", time);
        sql2 = sql2.replace("?year?", year);
        sql2 = sql2.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");
        SQLData dataCK = this.mhQuery.select(sql2);

        List listJK = dataJK.getDataList();
        List listCK = dataCK.getDataList();
        double currentTotalPriceJK;
        double  currentTotalPriceCK;
        DecimalFormat df = new DecimalFormat("0.00");//格式化小数
        for (int i = 1; i <= 4; i++) {
            if (!mp.containsKey("val" + (i) + "_17")) {
                mp.put("val" + (i) + "_17", "0");
            }
        }
        for (int i = 0; i < listJK.size(); i++) {
            Object[] obj = (Object[]) listJK.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentTotalPriceJK = Double.valueOf(obj[3].toString());

            String total_price = df.format(currentTotalPriceJK / 10000);
            if (this.customsMap.get("col17_" + customs) != null) {
                total += currentTotalPriceJK;
            }
            mp.put(this.customsMap.get("col17_" + customs) == null ? "useless" : this.customsMap.get("col17_" + customs), total_price);
        }
        for (int i = 0; i < listCK.size(); i++) {
            double valueJK;
            double valueJC;
            Object[] obj = (Object[]) listCK.get(i);
            String customs = (null == obj[2]) ? "" : obj[2].toString();
            currentTotalPriceCK = Double.valueOf(obj[3].toString());
            String value = mp.get(this.customsMap.get("col17_" + customs)) == null ? "0" : mp.get(this.customsMap.get("col17_" + customs)).toString();
            valueJK = Double.valueOf(value);
            valueJC = (currentTotalPriceCK / 10000) + valueJK;
            String total_price = df.format(valueJC);
            mp.put(this.customsMap.get("col17_" + customs) == null ? "useless" : this.customsMap.get("col17_" + customs), total_price);
            if (this.customsMap.get("col17_" + customs) != null) {
                total += currentTotalPriceCK;
            }
        }

        mp.put("val5_17", df.format(total / 10000));
    }


}
