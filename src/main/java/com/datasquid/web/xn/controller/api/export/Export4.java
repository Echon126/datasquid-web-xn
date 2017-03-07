package com.datasquid.web.xn.controller.api.export;

import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.report.BuildTemplate;
import com.datasquid.web.tools.DateUtil;
import com.datasquid.web.tools.ValueComparator;
import freemarker.template.TemplateException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.*;


/**
 * Created by Administrator on 2017/2/16.
 */
@RestController
@RequestMapping("/api/export4")
public class Export4 extends BaseExport {

    private Log log = LogFactory.getLog(this.getClass());


    // 报表目录查询
    @RequestMapping(value = "query", method = RequestMethod.GET)
    public ResponseData download() {
        String[] fileList = this.report4Folder.list();
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
                map.put("sign", "report4");
                map.put("name", fileName);
                map.put("createTime", createTime);
                list.add(map);
            }
        }
        return new ResponseData(list);
    }

    // 下载报表3
    @RequestMapping(value = "download_excel4", method = RequestMethod.GET)
    public ResponseData downloadReport4(@RequestParam(name = "time") String time, @RequestParam(name = "custom") String custom) {
        // 获取查询map数据
        String outPath;
        Map map;
        try {
            map = getReport4Data(time, custom);
            // 生成excel
            BuildTemplate template = new BuildTemplate();

            // 生成excel报表名称
            String fileName = "report4-" + time.replace("-", "") + "_" + DateUtil.getTimesStrNum_yyyyMMddHHmmssSSS() + ".xls";
            outPath = this.outFolder4Path + File.separator + fileName;
            File outFile = new File(outPath);
            map.put("file4Name", fileName);

            // 报表4和报表2使用同一个模版 ftl2
            template.buildExcel(this.ftlFolder, webMap.getFtl2Name(), map, outFile);
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


    private Map getReport4Data(String time, String custom) {
        Map<String, String> map = new HashMap();
        String[] times = time.split("-");
        map.put("date", times[0] + "年" + times[1] + "月");
        map.put("val1", " ");
        String customsCodeStr = this.getCustomsCodeStr();

        // 进口月份交易额
        this.getImportCurrentMonthData4(map, time, custom, customsCodeStr);
        // 进口年内累计交易额
        this.getImportCurrentYearData4(map, times[0], time, custom, customsCodeStr);
        // 出口月份交易额
        this.getExportCurrentMonthData4(map, time, custom, customsCodeStr);
        // 出口年内累计交易额
        this.getExportCurrentYearData4(map, times[0], time, custom, customsCodeStr);
        // 进口商品交易额
        this.getImportGoodsMoneyData4(map, time, custom, customsCodeStr);
        // 出口商品交易额
        this.getExportGoodsMoneyData4(map, time, custom, customsCodeStr);
        return map;
    }

    // 进口月份交易额
    private void getImportCurrentMonthData4(Map<String, String> map, String time, String custom, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report4i_month_money");
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and ivt.customs_code = '" + custom + "'");
        }
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
        map.put("val3", total);
    }

    // 进口年内累计交易额
    private void getImportCurrentYearData4(Map<String, String> map, String year, String time, String custom, String customsCodeStr) {
        // 当前选中年年内累计交易额
        String sql1 = this.sqlMap.get("report4i_year_money");
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and ivt.customs_code = '" + custom + "'");
        }
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
        map.put("val17", total);
    }

    // 出口月份交易额
    private void getExportCurrentMonthData4(Map<String, String> map, String time, String custom, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report4e_month_money");
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and bill.customs_code = '" + custom + "'");
        }
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
        map.put("val2", total);

    }

    // 出口年内累计交易额
    private void getExportCurrentYearData4(Map<String, String> map, String year, String time, String custom, String customsCodeStr) {
        // 当前选中年年内累计交易额
        String sql1 = this.sqlMap.get("report4e_year_money");
        sql1 = sql1.replace("?year?", year);
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and bill.customs_code = '" + custom + "'");
        }
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
        map.put("val16", total);
    }

    // 进口商品交易额
    private void getImportGoodsMoneyData4(Map<String, String> map, String time, String custom, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report4i_goods_money");
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and ivt.customs_code = '" + custom + "'");
        }
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and ivt.customs_code in(" + customsCodeStr + ")");

        String[] times = time.split("-");
        SQLData sqlData1 = this.wtQuery.select(sql1);
        List<Object[]> list1 = sqlData1.getDataList();
        this.getGoodsMapData1(map,list1,times);
        // 补充不存在的数据
        for (int i = 10; i <= 15; i++) {
            if (!map.containsKey("val" + i)) {
                map.put("val" + i, " ");
            }
        }
    }

    // 出口商品交易额
    private void getExportGoodsMoneyData4(Map<String, String> map, String time, String custom, String customsCodeStr) {
        // 查询选中月数据
        String sql1 = this.sqlMap.get("report4e_goods_money");
        sql1 = sql1.replace("?time?", time);
        if (StringUtils.isEmpty(custom)) {
            sql1 = sql1.replace("?condition?", "");
        } else {
            sql1 = sql1.replace("?condition?", "and bill.customs_code = '" + custom + "'");
        }
        sql1 = sql1.replace(this.signMap.get("CUSTOMS"), "and bill.customs_code in(" + customsCodeStr + ")");

        String[] times = time.split("-");
        SQLData sqlData1 = this.mhQuery.select(sql1);
        List<Object[]> list1 = sqlData1.getDataList();
        this.getGoodsMapData2(map, list1, times);
        // 补充不存在的数据
        for (int i = 4; i <= 9; i++) {
            if (!map.containsKey("val" + i)) {
                map.put("val" + i, " ");
            }
        }
    }
}
