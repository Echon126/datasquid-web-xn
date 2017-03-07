package com.datasquid.web.xn.controller.api.export;

import com.datasquid.web.configuration.SQLConfiguration;
import com.datasquid.web.configuration.WebConfiguration;
import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import com.datasquid.web.tools.ValueComparator;
import com.datasquid.web.xn.configuration.SignConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.File;
import java.text.DecimalFormat;
import java.util.*;

/**
 * Created by Administrator on 2017/2/16.
 */
@Component
public class BaseExport extends BaseController {
    //本地库
    protected SQLQuery mainQuery;
    //美华出口库
    protected SQLQuery mhQuery;
    //物通进口库
    protected SQLQuery wtQuery;

    @Autowired
    protected SQLConfiguration sqlMap;
    @Autowired
    protected SignConfiguration signMap;
    @Autowired
    protected WebConfiguration webMap;

    @Autowired
    protected SQLSourceProvider sourceProvider;

    protected File ftlFolder;

    protected String outFolder1Path;
    protected String outFolder2Path;
    protected String outFolder3Path;
    protected String outFolder4Path;

    protected File report1Folder;
    protected File report2Folder;
    protected File report3Folder;
    protected File report4Folder;
    protected Map<String, String> customsMap;//报表1


    @PostConstruct
    private void init() {
        this.loadUserDataSource(this.sourceProvider);

        this.mainQuery = new SQLQuery(this.sourceProvider);
        this.mhQuery = new SQLQuery(this.sourceProvider);
        this.mhQuery.setSourceName("MH");
        this.wtQuery = new SQLQuery(this.sourceProvider);
        this.wtQuery.setSourceName("WT");
        // 初始化模版路径
        String ftlFolderPath = webMap.getFtlFolder();
        this.ftlFolder = new File(ftlFolderPath);
        if (!this.ftlFolder.exists()) {
            this.ftlFolder.mkdirs();
        }
        // 初始化输出路径
        this.outFolder1Path = webMap.getOutFolder1();
        report1Folder = new File(outFolder1Path);
        if (!report1Folder.exists()) {
            report1Folder.mkdirs();
        }
        this.outFolder2Path = webMap.getOutFolder2();
        report2Folder = new File(outFolder2Path);
        if (!report2Folder.exists()) {
            report2Folder.mkdirs();
        }
        this.outFolder3Path = webMap.getOutFolder3();
        report3Folder = new File(outFolder3Path);
        if (!report3Folder.exists()) {
            report3Folder.mkdirs();
        }
        this.outFolder4Path = webMap.getOutFolder4();
        report4Folder = new File(outFolder4Path);
        if (!report4Folder.exists()) {
            report4Folder.mkdirs();
        }
        customsMap = new HashMap<>();
        loadCustomsMap();
    }

    private void loadCustomsMap() {
        customsMap.put("col1_4612", "val1_1");
        customsMap.put("col1_4604", "val2_1");
        customsMap.put("col1_4606", "val3_1");
        customsMap.put("col1_4620", "val4_1");

        customsMap.put("col2_4612", "val1_2");
        customsMap.put("col2_4604", "val2_2");
        customsMap.put("col2_4606", "val3_2");
        customsMap.put("col2_4620", "val4_2");

        customsMap.put("col3_4612", "val1_3");
        customsMap.put("col3_4604", "val2_3");
        customsMap.put("col3_4606", "val3_3");
        customsMap.put("col3_4620", "val4_3");

        customsMap.put("col4_4612", "val1_4");
        customsMap.put("col4_4604", "val2_4");
        customsMap.put("col4_4606", "val3_4");
        customsMap.put("col4_4620", "val4_4");

        customsMap.put("col5_4612", "val1_5");
        customsMap.put("col5_4604", "val2_5");
        customsMap.put("col5_4606", "val3_5");
        customsMap.put("col5_4620", "val4_5");

        customsMap.put("col6_4612", "val1_6");
        customsMap.put("col6_4604", "val2_6");
        customsMap.put("col6_4606", "val3_6");
        customsMap.put("col6_4620", "val4_6");

        customsMap.put("col7_4612", "val1_7");
        customsMap.put("col7_4604", "val2_7");
        customsMap.put("col7_4606", "val3_7");
        customsMap.put("col7_4620", "val4_7");

        customsMap.put("col8_4612", "val1_8");
        customsMap.put("col8_4604", "val2_8");
        customsMap.put("col8_4606", "val3_8");
        customsMap.put("col8_4620", "val4_8");

        customsMap.put("col9_4612", "val1_9");
        customsMap.put("col9_4604", "val2_9");
        customsMap.put("col9_4606", "val3_9");
        customsMap.put("col9_4620", "val4_9");

        customsMap.put("col10_4612", "val1_10");
        customsMap.put("col10_4604", "val2_10");
        customsMap.put("col10_4606", "val3_10");
        customsMap.put("col10_4620", "val4_10");

        customsMap.put("col11_4612", "val1_11");
        customsMap.put("col11_4604", "val2_11");
        customsMap.put("col11_4606", "val3_11");
        customsMap.put("col11_4620", "val4_11");

        customsMap.put("col12_4612", "val1_12");
        customsMap.put("col12_4604", "val2_12");
        customsMap.put("col12_4606", "val3_12");
        customsMap.put("col12_4620", "val4_12");

        customsMap.put("col13_4612", "val1_13");
        customsMap.put("col13_4604", "val2_13");
        customsMap.put("col13_4606", "val3_13");
        customsMap.put("col13_4620", "val4_13");

        customsMap.put("col14_4612", "val1_14");
        customsMap.put("col14_4604", "val2_14");
        customsMap.put("col14_4606", "val3_14");
        customsMap.put("col14_4620", "val4_14");

        customsMap.put("col15_4612", "val1_15");
        customsMap.put("col15_4604", "val2_15");
        customsMap.put("col15_4606", "val3_15");
        customsMap.put("col15_4620", "val4_15");

        customsMap.put("col16_4612", "val1_16");
        customsMap.put("col16_4604", "val2_16");
        customsMap.put("col16_4606", "val3_16");
        customsMap.put("col16_4620", "val4_16");

        customsMap.put("col17_4612", "val1_17");
        customsMap.put("col17_4604", "val2_17");
        customsMap.put("col17_4606", "val3_17");
        customsMap.put("col17_4620", "val4_17");
    }


    //获取币种汇率（返回人民币）
    protected double getCurrencyRate(String year, String month, String currency, double money) {
        // 去掉月份首位0
        String newMonth = month.replaceAll("^(0+)", "");
        String sql = sqlMap.get("currencyRate2");
        SQLData sqlData = mainQuery.select(sql, year, newMonth, currency);
        Map<String, Object> map = sqlData.getRow();
        //换算美元汇率
        double dollarRate = 1.0d;
        if (null != map && map.containsKey("rate")) {
            dollarRate = Double.parseDouble((String) sqlData.getRow().get("rate"));
        }
        double dollar = money * dollarRate;

        String sql1 = sqlMap.get("currencyRate3");
        SQLData sqlData1 = mainQuery.select(sql1, year, newMonth);
        Map<String, Object> map1 = sqlData.getRow();
        //换算人民币汇率
        double rmbRate = 1.0d;
        if (null != map1 && map1.containsKey("rate")) {
            rmbRate = Double.parseDouble((String) sqlData1.getRow().get("rate"));
        }
        return dollar / rmbRate;
    }

    // 查询维护的关区代码 字符串
    protected String getCustomsCodeStr() {
        String sql = "select code from ds_customs";
        SQLData data = this.mainQuery.select(sql);
        if (data.isEmpty())
            return "";

        StringBuilder code = new StringBuilder();
        data.getDataList().forEach(item -> code.append(String.format("'%s',", item)));
        code.deleteCharAt(code.length() - 1);
        return code.toString();
    }

    // 根据文件名，获取创建时间
    protected String getCreateTime(String createTimeStr) {
        String year = createTimeStr.substring(0, 4);
        String month = createTimeStr.substring(4, 6);
        String day = createTimeStr.substring(6, 8);
        String hour = createTimeStr.substring(8, 10);
        String minute = createTimeStr.substring(10, 12);
        String second = createTimeStr.substring(12, 14);
        String createTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        return createTime;
    }

    protected double getYearSumPrice(List<Object[]> list1) {
        double currentTotalPrice;
        double sumPrice = 0;
        for (int i = 0; i < list1.size(); i++) {
//            String year_month = (String) list1.get(i)[0];
//            String[] times = year_month.split("-");
//            String currency = (String) list1.get(i)[1];
            currentTotalPrice = (double) (null == list1.get(i)[2] ? 0 : list1.get(i)[2]);
//            double rmbPrice = this.getCurrencyRate(times[0], times[1], currency, currentTotalPrice);
            sumPrice += currentTotalPrice;
        }
        return sumPrice;
    }

    protected Map<String, Double> getGoodsMap(List<Object[]> list1, String year, String month) {
        Map<String, Double> goodsMap = new HashMap<>();
//        String currency;
        String goodsName;
        long total_price;
//        double rmbPrice;
        for (int i = 0; i < list1.size(); i++) {
//            currency = (String) list1.get(i)[0];
            goodsName = (null == list1.get(i)[1]) ? " " : this.getGoodsLevel1((String) list1.get(i)[1]);
            total_price = (null == list1.get(i)[2]) ? 0 : (long) list1.get(i)[2];
//            rmbPrice = this.getCurrencyRate(year, month, currency, total_price);
            if (goodsMap.containsKey(goodsName)) {
                goodsMap.put(goodsName, (goodsMap.get(goodsName) + (double) total_price));
            } else {
                goodsMap.put(goodsName, (double) total_price);
            }
        }
        return goodsMap;
    }

    protected String getGoodsLevel1(String code) {
        String scriptStr = "function getGoodsLevel(code) {\n" +
                "    if (code == null)\n" +
                "        return \"其它\";\n" +
                "\n" +
                "    var topMap = [\n" +
                "        {name: \"美妆个护\", value: [\"33\", \"960329\", \"9615\", \"9616\"]},\n" +
                "        {\n" +
                "            name: \"食品保健\",\n" +
                "            value: [\"24\", \"02\", \"03\", \"04\", \"05\", \"07\", \"08\", \"09\", \"10\", \"11\", \"12\", \"13\", \"14\", \"15\", \"16\", \"17\", \"18\", \"19\", \"20\", \"21\", \"21069090\", \"22\", \"25\", \"27\", \"28\", \"29\"]\n" +
                "        },\n" +
                "        {name: \"母婴用品\", value: [\"19011010\", \"19011090\", \"9619001\"]},\n" +
                "        {name: \"皮包饰品\", value: [\"41\", \"42\", \"43\", \"71\", \"91\"]},\n" +
                "        {\n" +
                "            name: \"服饰鞋帽\",\n" +
                "            value: [\"50\", \"51\", \"52\", \"53\", \"54\", \"55\", \"56\", \"57\", \"58\", \"59\", \"60\", \"61\", \"62\", \"63\", \"64\", \"65\"]\n" +
                "        },\n" +
                "        {name: \"数码家电\", value: [\"84\", \"844\", \"847\", \"85\", \"8516\", \"8510\", \"88\"]},\n" +
                "        {\n" +
                "            name: \"生活用具\",\n" +
                "            value: [\"30\", \"32\", \"36\", \"66\", \"67\", \"68\", \"69\", \"70\", \"72\", \"73\", \"74\", \"75\", \"76\", \"77\", \"78\", \"79\", \"80\", \"81\", \"82\", \"83\", \"86\", \"87\", \"89\", \"900\", \"90\", \"9617\", \"92\", \"93\", \"94\", \"95\", \"96\", \"97\", \"35\", \"37\", \"39\", \"40\", \"44\", \"45\", \"46\", \"48\", \"49\", \"23\"]\n" +
                "        },\n" +
                "        {name: \"卫生清洁\", value: [\"34\", \"9619002\", \"38\", \"960321\"]},\n" +
                "        {name: \"工农业原料\", value: [\"26\", \"31\"]}\n" +
                "    ];\n" +
                "\n" +
                "    var resultList = [];\n" +
                "\n" +
                "    for (var idx in topMap) {\n" +
                "        var item = topMap[idx];\n" +
                "        for (var jdx in item.value) {\n" +
                "            item.value.sort(function (a, b) {\n" +
                "                return (b + \"\").length - (a + \"\").length;\n" +
                "            });\n" +
                "            var c1 = item.value[jdx];\n" +
                "            if (code.indexOf(c1) == 0)\n" +
                "                resultList.push({name: item.name, value: c1});\n" +
                "        }\n" +
                "    }\n" +
                "    if (resultList.length == 0)\n" +
                "        return \"其它\";\n" +
                "    resultList.sort(function (a, b) {\n" +
                "        return (b.value + \"\").length - (a.value + \"\").length;\n" +
                "    });\n" +
                "    return resultList[0].name;\n" +
                "}";
        try {
            ScriptEngineManager manager = new ScriptEngineManager();
            ScriptEngine engine = manager.getEngineByName("js");
            engine.eval(scriptStr);
            Invocable invoke = (Invocable) engine;
            Object goodsType = invoke.invokeFunction("getGoodsLevel", code);

            return goodsType.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "未知";
        }
    }

    protected void getGoodsMapData1(Map<String, String> map, List<Object[]> list1, String[] times) {
        if (!CollectionUtils.isEmpty(list1)) {
            DecimalFormat df;
            String total;
            Map<String, Double> goodsMap = this.getGoodsMap(list1, times[0], times[1]);
            List<Map.Entry<String, Double>> list = new ArrayList<>();
            list.clear();
            list.addAll(goodsMap.entrySet());
            ValueComparator vc = new ValueComparator();
            Collections.sort(list, vc);
            int count = 0;
            String name;
            Double value;
            for (Iterator<Map.Entry<String, Double>> it = list.iterator(); it.hasNext(); ) {
                if (count == 3) break;
                Map.Entry<String, Double> entry = it.next();
                name = entry.getKey();
                value = entry.getValue();
                df = new DecimalFormat("0.00");//格式化小数
                total = df.format(value / 10000);
                map.put("val1" + (count * 2), name);
                map.put("val1" + ((count * 2) + 1), total);
                count++;
            }

        }
    }

    protected void getGoodsMapData2(Map<String, String> map, List<Object[]> list1, String[] times) {
        if (!CollectionUtils.isEmpty(list1)) {
            DecimalFormat df;
            String total;

            Map<String, Double> goodsMap = this.getGoodsMap(list1, times[0], times[1]);
            List<Map.Entry<String, Double>> list = new ArrayList<>();
            list.clear();
            list.addAll(goodsMap.entrySet());
            ValueComparator vc = new ValueComparator();
            Collections.sort(list, vc);
            int count = 0;
            String name;
            Double value;
            for (Iterator<Map.Entry<String, Double>> it = list.iterator(); it.hasNext(); ) {
                if (count == 3) break;
                Map.Entry<String, Double> entry = it.next();
                name = entry.getKey();
                value = entry.getValue();
                df = new DecimalFormat("0.00");//格式化小数
                total = df.format(value / 10000);
                map.put("val" + (4 + (count * 2)), name);
                map.put("val" + ((4 + (count * 2)) + 1), total);
                count++;
            }
        }
    }
}
