package com.datasquid.web.controller.api.data;

import com.datasquid.web.configuration.SQLConfiguration;
import com.datasquid.web.xn.configuration.SignConfiguration;
import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/6.
 */
@RestController
@RequestMapping("/api/data")
public class Select extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery mainQuery;

    @Autowired
    private SQLSourceProvider sourceProvider;
    @Autowired
    private SQLConfiguration sqlMap;
    @Autowired
    private SignConfiguration signMap;

    @PostConstruct
    private void init() {
        this.mainQuery = new SQLQuery(this.sourceProvider);
        this.loadUserDataSource(this.sourceProvider);
    }

    @RequestMapping(value = "/select/{source}", method = RequestMethod.GET)
    public ResponseData selectBySource(
            @PathVariable(name = "source")
                    String source,
            @RequestParam(name = "sql")
                    String sql
    ) {
        String cleanSql = sql.trim();
        return selectBySource2(source, cleanSql);
    }

    @RequestMapping(value = "/select/{source}", method = RequestMethod.POST)
    public ResponseData selectBySource2(
            @PathVariable(name = "source")
                    String source,
            @RequestParam(name = "sql")
                    String sql
    ) {
        String cleanSql = sql.trim();
        SQLQuery sourceQuery = new SQLQuery(this.sourceProvider);
        sourceQuery.setSourceName(source);

        return new ResponseData(sourceQuery.select(cleanSql));
    }

    @RequestMapping(value = "/select", method = RequestMethod.GET)
    public ResponseData select(
            @RequestParam(name = "sql")
                    String sql) {
        return new ResponseData(this.mainQuery.select(sql));
    }

    // 将单位的数字前面补0
    private String getDoubleNum(int num) {
        if (num < 10) return "0" + num;
        return String.valueOf(num);
    }


    // 消费者交易统计
    @RequestMapping(value = "/s/consumerTrade/{source}", method = RequestMethod.GET)
    public ResponseData consumerTrade(
            @PathVariable(name = "source") String source,
            @RequestParam(name = "ie") String ie,
            @RequestParam(name = "sign") String sign,
            @RequestParam(name = "legend") String legend,
            @RequestParam(name = "year") String year
    ) {
        SQLQuery sourceQuery = new SQLQuery(this.sourceProvider);
        sourceQuery.setSourceName(source);


        String time_key = "";
        String price_key= "";
        String condition = "";
        if (!StringUtils.isEmpty(sign) && !StringUtils.isEmpty(ie)) {
            condition = signMap.get(sign + "-" + ie);
        }

        if (ie.equals("E")) {
//            time_key = "stime";
            price_key = "calc_total_price";
        }else{
//            time_key = "app_time";
            price_key = "total_price";
        }


        String allProvinceMonthSQL = "SELECT " +
                " t1.hmonth as month, " +
                " SUM(t2.?price_key?) as all_total, " +
                " sum(t1.hit) as all_count " +
                " FROM ds_result_15r11426e t1, ds_result_e_15r11426e t2 " +
                " WHERE t1.rexid = t2.rexid and ?condition? " +
                " t2.order_time >= '?year?-01-01 00:00:00'    " +
                " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                " AND t1.hyear <= '?year?'  " +
                " GROUP BY month order by month asc";
//        allProvinceMonthSQL = allProvinceMonthSQL.replace("?time_key?",time_key);
        allProvinceMonthSQL = allProvinceMonthSQL.replace("?price_key?",price_key);
        allProvinceMonthSQL = allProvinceMonthSQL.replace("?year?",year);
        allProvinceMonthSQL = allProvinceMonthSQL.replace("?condition?",condition);
        allProvinceMonthSQL = allProvinceMonthSQL.replace("ieport","ie_port");
        if("E".equals(ie)){
            allProvinceMonthSQL = allProvinceMonthSQL.replace("ieport","ie_port");
        }
        SQLData allTotalSQLData = sourceQuery.select(allProvinceMonthSQL);
        List<Object[]> allTotalObjList = allTotalSQLData.getDataList();
        allTotalObjList = defaultInitObjList(allTotalObjList);

        String oneProvinceMonthSQL = "SELECT " +
                    " t1.hmonth as month?idx?, " +
                    " SUM(t2.?price_key?) as total?idx?, " +
                    " sum(t1.hit) as count?idx? " +
                " FROM ds_result_15r11426e t1, ds_result_e_15r11426e t2 " +
                " WHERE t1.rexid = t2.rexid and ?condition? " +
                    " t2.province = '?province?' " +
                    " AND t2.order_time >= '?year?-01-01 00:00:00'    " +
                    " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                    " AND t1.hyear <= '?year?'  " +
                " GROUP BY month?idx? order by month?idx? asc";
        List<List<Object[]>> allProvincesList = new ArrayList<List<Object[]>>(0);
        String[] legends = legend.split(",");
        for(int idx=0;idx < legends.length;idx++){
            String provinceSQL = oneProvinceMonthSQL.replace("?idx?",String.valueOf(idx));
//            provinceSQL = provinceSQL.replace("?time_key?",time_key);
            provinceSQL = provinceSQL.replace("?price_key?",price_key);
            provinceSQL = provinceSQL.replace("?year?",year);
            provinceSQL = provinceSQL.replace("?condition?",condition);
            provinceSQL = provinceSQL.replace("ieport","ie_port");
            provinceSQL = provinceSQL.replace("?province?",legends[idx]);
            SQLData oneProvinceSQLData = sourceQuery.select(provinceSQL);
            List<Object[]> oneProvinceObjList = oneProvinceSQLData.getDataList();
            oneProvinceObjList = defaultInitObjList(oneProvinceObjList);
            allProvincesList.add(oneProvinceObjList);
        }

        /*
        最终数据结构
        List<Obejct[]>
        {
            [0,total0,count0,0,total1,count1,0,total2,count2,0,all_total,all_count],
            [1,total0,count0,1,total1,count1,1,total2,count2,1,all_total,all_count],
            [2,total0,count0,2,total1,count1,2,total2,count2,2,all_total,all_count],
            [3,total0,count0,3,total1,count1,3,total2,count2,3,all_total,all_count],
            [4,total0,count0,4,total1,count1,4,total2,count2,4,all_total,all_count],
            [5,total0,count0,5,total1,count1,5,total2,count2,5,all_total,all_count],
            [6,total0,count0,6,total1,count1,6,total2,count2,6,all_total,all_count],
            [7,total0,count0,7,total1,count1,7,total2,count2,7,all_total,all_count],
            [8,total0,count0,8,total1,count1,8,total2,count2,8,all_total,all_count],
            [9,total0,count0,9,total1,count1,9,total2,count2,9,all_total,all_count],
            [10,total0,count0,10,total1,count1,10,total2,count2,10,all_total,all_count],
            [11,total0,count0,11,total1,count1,11,total2,count2,11,all_total,all_count],
            [12,total0,count0,12,total1,count1,12,total2,count2,12,all_total,all_count]
        }
        */
        List<Object[]> rtnObjList = new ArrayList<Object[]>(0);
        List<String> rtnSchemaList = new ArrayList<String>(0);

        for(int idx =0;idx<12;idx++ ){
            List<Object> linelist = new ArrayList<Object>(0);
            Object[] totalObjs = allTotalObjList.get(idx);
            for(int i = 0;i< allProvincesList.size();i++){
                List<Object[]> provincesObjsList = allProvincesList.get(i);
                Object[] provincesObj = provincesObjsList.get(idx);
                linelist.add(provincesObj[0]);
                linelist.add(provincesObj[1]);
                linelist.add(provincesObj[2]);
                if(idx == 0){
                    rtnSchemaList.add("month"+i);
                    rtnSchemaList.add("total"+i);
                    rtnSchemaList.add("count"+i);
                }
            }
            linelist.add(totalObjs[0]);
            linelist.add(totalObjs[1]);
            linelist.add(totalObjs[2]);
            if(idx == 0){
                rtnSchemaList.add("month");
                rtnSchemaList.add("all_total");
                rtnSchemaList.add("all_count");
            }
            rtnObjList.add(linelist.toArray());
        }

        SQLData sqlData = new SQLData();
        sqlData.setDataList(rtnObjList);
        sqlData.setSchemaList(rtnSchemaList);

        return new ResponseData(sqlData);
    }


    // 商品品类交易统计
    @RequestMapping(value = "/s/goodsTrade/{source}", method = RequestMethod.GET)
    public ResponseData goodsTrade(
            @PathVariable(name = "source") String source,
            @RequestParam(name = "ie") String ie,
            @RequestParam(name = "sign") String sign,
            @RequestParam(name = "legend") String legend,
            @RequestParam(name = "year") String year
    ) {
        SQLQuery sourceQuery = new SQLQuery(this.sourceProvider);
        sourceQuery.setSourceName(source);

        String time_key = "";
        String price_key= "";
        String condition = "";
        if (!StringUtils.isEmpty(sign) && !StringUtils.isEmpty(ie)) {
            condition = signMap.get(sign + "-" + ie);
        }

        if (ie.equals("E")) {
//            time_key = "stime";
            price_key = "calc_total_price";
        }else{
//            time_key = "app_time";
            price_key = "total_price";
        }

        String allGoodsMonthSQL = "SELECT " +
                    " t1.hmonth as month, " +
                    " sum(t2.?price_key?) as all_total, " +
                    " sum(t2.qty) as all_count " +
                " FROM ds_result_19r1f6c1 t1, ds_result_e_19r1f6c1 t2  " +
                " WHERE t1.rexid = t2.rexid " +
                    " AND ?condition? " +
                    " t2.order_time >= '?year?-01-01 00:00:00'    " +
                    " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                " GROUP BY month order by month asc";
//        allGoodsMonthSQL = allGoodsMonthSQL.replace("?time_key?",time_key);
        allGoodsMonthSQL = allGoodsMonthSQL.replace("?price_key?",price_key);
        allGoodsMonthSQL = allGoodsMonthSQL.replace("?year?",year);
        allGoodsMonthSQL = allGoodsMonthSQL.replace("?condition?",condition);
        allGoodsMonthSQL = allGoodsMonthSQL.replace("ieport","ie_port");
        SQLData allTotalSQLData = sourceQuery.select(allGoodsMonthSQL);
        List<Object[]> allTotalObjList = allTotalSQLData.getDataList();
        allTotalObjList = defaultInitObjList(allTotalObjList);

        String oneCountryMonthSQL = "SELECT " +
                    " t1.hmonth as month?idx?, " +
                    " SUM(t2.?price_key?) as total?idx?, " +
                    " sum(t2.qty) as count?idx? " +
                " FROM ds_result_19r1f6c1 t1, ds_result_e_19r1f6c1 t2  " +
                " WHERE t1.rexid = t2.rexid " +
                    " AND ?condition? " +
                    " t2.type_level_1 = '?goodsType?' " +
                    " AND t2.order_time >= '?year?-01-01 00:00:00'    " +
                    " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                " GROUP BY month?idx? order by month?idx? asc";

        List<List<Object[]>> allGoodsList = new ArrayList<List<Object[]>>(0);
        String[] legends = legend.split(",");
        for(int idx=0;idx < legends.length;idx++){
            String goodsSQL = oneCountryMonthSQL.replace("?idx?",String.valueOf(idx));
//            goodsSQL = goodsSQL.replace("?time_key?",time_key);
            goodsSQL = goodsSQL.replace("?price_key?",price_key);
            goodsSQL = goodsSQL.replace("?year?",year);
            goodsSQL = goodsSQL.replace("?condition?",condition);
            goodsSQL = goodsSQL.replace("ieport","ie_port");
            goodsSQL = goodsSQL.replace("?goodsType?",legends[idx]);
            SQLData oneCountrySQLData = sourceQuery.select(goodsSQL);
            List<Object[]> oneCountryObjList = oneCountrySQLData.getDataList();
            oneCountryObjList = defaultInitObjList(oneCountryObjList);
            allGoodsList.add(oneCountryObjList);
        }

        /*
        最终数据结构
        List<Obejct[]>
        {
            [0,total0,count0,0,total1,count1,0,total2,count2,0,all_total,all_count],
            [1,total0,count0,1,total1,count1,1,total2,count2,1,all_total,all_count],
            [2,total0,count0,2,total1,count1,2,total2,count2,2,all_total,all_count],
            [3,total0,count0,3,total1,count1,3,total2,count2,3,all_total,all_count],
            [4,total0,count0,4,total1,count1,4,total2,count2,4,all_total,all_count],
            [5,total0,count0,5,total1,count1,5,total2,count2,5,all_total,all_count],
            [6,total0,count0,6,total1,count1,6,total2,count2,6,all_total,all_count],
            [7,total0,count0,7,total1,count1,7,total2,count2,7,all_total,all_count],
            [8,total0,count0,8,total1,count1,8,total2,count2,8,all_total,all_count],
            [9,total0,count0,9,total1,count1,9,total2,count2,9,all_total,all_count],
            [10,total0,count0,10,total1,count1,10,total2,count2,10,all_total,all_count],
            [11,total0,count0,11,total1,count1,11,total2,count2,11,all_total,all_count],
            [12,total0,count0,12,total1,count1,12,total2,count2,12,all_total,all_count]
        }
        */
        List<Object[]> rtnObjList = new ArrayList<Object[]>(0);
        List<String> rtnSchemaList = new ArrayList<String>(0);

        for(int idx =0;idx<12;idx++ ){
            List<Object> linelist = new ArrayList<Object>(0);
            Object[] totalObjs = allTotalObjList.get(idx);


            for(int i = 0;i< allGoodsList.size();i++){
                List<Object[]> countryObjsList = allGoodsList.get(i);
                Object[] countryObj = countryObjsList.get(idx);
                linelist.add(countryObj[0]);
                linelist.add(countryObj[1]);
                linelist.add(countryObj[2]);
                if(idx == 0){
                    rtnSchemaList.add("month"+i);
                    rtnSchemaList.add("total"+i);
                    rtnSchemaList.add("count"+i);
                }
            }
            linelist.add(totalObjs[0]);
            linelist.add(totalObjs[1]);
            linelist.add(totalObjs[2]);
            if(idx == 0){
                rtnSchemaList.add("month");
                rtnSchemaList.add("all_total");
                rtnSchemaList.add("all_count");
            }
            rtnObjList.add(linelist.toArray());
        }

        SQLData sqlData = new SQLData();
        sqlData.setDataList(rtnObjList);
        sqlData.setSchemaList(rtnSchemaList);

        return new ResponseData(sqlData);
    }

    // 贸易国别统计
    @RequestMapping(value = "/s/tradeCountry/{source}", method = RequestMethod.GET)
    public ResponseData tradeCountry(
            @PathVariable(name = "source") String source,
            @RequestParam(name = "ie") String ie,
            @RequestParam(name = "sign") String sign,
            @RequestParam(name = "legend") String legend,
            @RequestParam(name = "year") String year
    ) {
        SQLQuery sourceQuery = new SQLQuery(this.sourceProvider);
        sourceQuery.setSourceName(source);

        String time_key = "";
        String price_key= "";
        String condition = "";
        if (!StringUtils.isEmpty(sign) && !StringUtils.isEmpty(ie)) {
            condition = signMap.get(sign + "-" + ie);
            if (ie.equals("E")) {
                condition = " ie_type='E' and ie_port='4604' and customs_code='4604' and ";
            }
        }

        if ("E".equals(ie)) {
            time_key = "stime";
            price_key = "calc_total_price";
        }else{
            time_key = "app_time";
            price_key = "total_price";
        }

        String allCountryMonthSQL = "SELECT " +
                    " t1.hmonth as month, " +
                    " SUM(t2.?price_key?) as all_total, " +
                    " sum(t1.hit) as all_count " +
                " FROM ds_result_14r14f9b t1, ds_result_e_14r14f9b t2  " +
                " WHERE t1.rexid = t2.rexid and ?condition? " +
                    " t2.order_time >= '?year?-01-01 00:00:00'    " +
                    " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                    " AND t1.hyear <= '?year?'  " +
                " GROUP BY month order by month asc";
        // allCountryMonthSQL = allCountryMonthSQL.replace("?time_key?",time_key);
         allCountryMonthSQL = allCountryMonthSQL.replace("?price_key?",price_key);
        allCountryMonthSQL = allCountryMonthSQL.replace("?year?",year);
        allCountryMonthSQL = allCountryMonthSQL.replace("?condition?",condition);
        allCountryMonthSQL = allCountryMonthSQL.replace("ieport","ie_port");
        SQLData allTotalSQLData = sourceQuery.select(allCountryMonthSQL);
        List<Object[]> allTotalObjList = allTotalSQLData.getDataList();
        allTotalObjList = defaultInitObjList(allTotalObjList);

        String oneCountryMonthSQL = "SELECT " +
                    " t1.hmonth as month?idx?, " +
                    " SUM(t2.?price_key?) as total?idx?, " +
                    " sum(t1.hit) as count?idx? " +
                " FROM ds_result_14r14f9b t1, ds_result_e_14r14f9b t2  " +
                " WHERE t1.rexid = t2.rexid and ?condition? " +
                    " t2.country = '?country?' " +
                    " AND t2.order_time >= '?year?-01-01 00:00:00'    " +
                    " AND t2.order_time <= '?year?-12-31 23:59:59'  " +
                    " AND t1.hyear <= '?year?'  " +
                " GROUP BY month?idx? order by month?idx? asc";

        List<List<Object[]>> allCountryList = new ArrayList<List<Object[]>>(0);
        String[] legends = legend.split(",");
        for(int idx=0;idx < legends.length;idx++){
            String countrySQL = oneCountryMonthSQL.replace("?idx?",String.valueOf(idx));
//            countrySQL = countrySQL.replace("?time_key?",time_key);
            countrySQL = countrySQL.replace("?price_key?",price_key);
            countrySQL = countrySQL.replace("?year?",year);
            countrySQL = countrySQL.replace("?condition?",condition);
            countrySQL = countrySQL.replace("ieport","ie_port");
            countrySQL = countrySQL.replace("?country?",legends[idx]);
            SQLData oneCountrySQLData = sourceQuery.select(countrySQL);
            List<Object[]> oneCountryObjList = oneCountrySQLData.getDataList();
            oneCountryObjList = defaultInitObjList(oneCountryObjList);
            allCountryList.add(oneCountryObjList);
        }
        /*
        最终数据结构
        List<Obejct[]>
        {
            [0,total0,count0,0,total1,count1,0,total2,count2,0,all_total,all_count],
            [1,total0,count0,1,total1,count1,1,total2,count2,1,all_total,all_count],
            [2,total0,count0,2,total1,count1,2,total2,count2,2,all_total,all_count],
            [3,total0,count0,3,total1,count1,3,total2,count2,3,all_total,all_count],
            [4,total0,count0,4,total1,count1,4,total2,count2,4,all_total,all_count],
            [5,total0,count0,5,total1,count1,5,total2,count2,5,all_total,all_count],
            [6,total0,count0,6,total1,count1,6,total2,count2,6,all_total,all_count],
            [7,total0,count0,7,total1,count1,7,total2,count2,7,all_total,all_count],
            [8,total0,count0,8,total1,count1,8,total2,count2,8,all_total,all_count],
            [9,total0,count0,9,total1,count1,9,total2,count2,9,all_total,all_count],
            [10,total0,count0,10,total1,count1,10,total2,count2,10,all_total,all_count],
            [11,total0,count0,11,total1,count1,11,total2,count2,11,all_total,all_count],
            [12,total0,count0,12,total1,count1,12,total2,count2,12,all_total,all_count]
        }
        */
        List<Object[]> rtnObjList = new ArrayList<Object[]>(0);
        List<String> rtnSchemaList = new ArrayList<String>(0);

        for(int idx =0;idx<12;idx++ ){
            List<Object> linelist = new ArrayList<Object>(0);
            Object[] totalObjs = allTotalObjList.get(idx);


            for(int i = 0;i< allCountryList.size();i++){
                List<Object[]> countryObjsList = allCountryList.get(i);
                Object[] countryObj = countryObjsList.get(idx);
                linelist.add(countryObj[0]);
                linelist.add(countryObj[1]);
                linelist.add(countryObj[2]);
                if(idx == 0){
                    rtnSchemaList.add("month"+i);
                    rtnSchemaList.add("total"+i);
                    rtnSchemaList.add("count"+i);
                }
            }
            linelist.add(totalObjs[0]);
            linelist.add(totalObjs[1]);
            linelist.add(totalObjs[2]);
            if(idx == 0){
                rtnSchemaList.add("month");
                rtnSchemaList.add("all_total");
                rtnSchemaList.add("all_count");
            }
            rtnObjList.add(linelist.toArray());
        }

        SQLData sqlData = new SQLData();
        sqlData.setDataList(rtnObjList);
        sqlData.setSchemaList(rtnSchemaList);

        return new ResponseData(sqlData);
    }

    private List<Object[]> defaultInitObjList(List<Object[]> allTotalObjList) {
        List<Object[]> rtnObjList = new ArrayList<Object[]>(0);
        if(allTotalObjList == null || allTotalObjList.size() < 1){
            allTotalObjList = new ArrayList<Object[]>(0);
            for(int idx=0;idx<12;idx++){
                Object[] total_month_obj = new Object[]{(idx+1),0,0};
                rtnObjList.add(total_month_obj);
            }
        }else{

            for(int idx=0;idx<12;idx++){
                boolean flag = false;
                int index = idx+1;
                for(Object[] objs : allTotalObjList){
                    Object obj = objs[0];
                    int month = Integer.valueOf(String.valueOf(obj));
                    if(index == month){
                        rtnObjList.add(objs);
                        flag = true;
                        break;
                    }else{
                        flag = false;
                    }
                }

                if(!flag){
                    Object[] total_month_obj = new Object[]{index,0,0};
                    rtnObjList.add(total_month_obj);
                }
            }
        }
        return rtnObjList;
    }

    @RequestMapping(value = "/s/{source}", method = RequestMethod.GET)
    public ResponseData executeSQL(@PathVariable(name = "source") String source,
                                   @RequestParam(name = "sid") String sid,
                                   @RequestParam(name = "ie") String ie,
                                   @RequestParam(name = "sign") String sign,
                                   @RequestParam(required = false, name = "unknown") String unknown,
                                   @RequestParam(required = false, name = "start") String start,
                                   @RequestParam(required = false, name = "end") String end,
                                   @RequestParam(required = false, name = "param") String param,
                                   @RequestParam(required = false, name = "threshold") String threshold) {

        SQLQuery sourceQuery = new SQLQuery(this.sourceProvider);
        sourceQuery.setSourceName(source);

        String sql = this.sqlMap.get(sid);
        String condition = "";
        // 替换不确定条件
        if (!StringUtils.isEmpty(unknown)) {
            String unknownSign = this.signMap.get("UNKNOWN") == null ? "" : this.signMap.get("UNKNOWN");
            sql = sql.replace(unknownSign, unknown);
        }
        // 替换标识条件
        if (!StringUtils.isEmpty(sign) && !StringUtils.isEmpty(ie)) {
            condition = this.signMap.get(sign + "-" + ie) == null ? "" : this.signMap.get(sign + "-" + ie);

            // 当传入threshold时 替换阈值
            if (!StringUtils.isEmpty(threshold)) {
                // 从数据库从查询对应标识业务类型的 所有阈值
                SQLData sqlData = this.mainQuery.select(this.sqlMap.get("threshold"), sign.split("-")[0]);
                List<Object[]> dataList = sqlData.getDataList();
                Map<String, String> thresholdMap = new HashMap<>();
                for (int i = 0; i < dataList.size(); i++) {
                    thresholdMap.put((String) dataList.get(i)[0], dataList.get(i)[1] + "");
                }
                String[] thresholds = threshold.split(";");
                String newThreshold;
                String oldThreshold;
                for (int i = 0; i < thresholds.length; i++) {
                    // 获取数据库中查询出来对应标识的阈值，没有则使用默认值
                    newThreshold = thresholdMap.get(thresholds[i]) == null ? this.signMap.get("DF_THRESHOLD") : thresholdMap.get(thresholds[i]);
                    // 获取对应标识的替换字符串
                    oldThreshold = this.signMap.get(thresholds[i]) == null ? "" : this.signMap.get(thresholds[i]);
                    if (sql.indexOf(oldThreshold) > 0) {
                        sql = sql.replace(oldThreshold, newThreshold);
                    }
                }
            }

        }
        String conditionKey = this.signMap.get("CONDITION");
        sql = sql.replace(conditionKey, condition);

        String sourceTypeSuffix = "";
        if (sourceQuery.getSourceType().equals(SQLQuery.DB_TYPE_MYSQL))
            sourceTypeSuffix = "_MYSQL";

        // 替换开始时间
        if (StringUtils.isEmpty(start)) {
            // 不传开始时间则取默认值（当月1日）
            start = this.signMap.get("CURRENT_MONTH" + sourceTypeSuffix);
        }
        if (sourceQuery.getSourceType().equals(SQLQuery.DB_TYPE_MYSQL))
            sql = sql.replace(this.signMap.get("START"), String.format("'%s'", start));
        else
            sql = sql.replace(this.signMap.get("START"), String.format("to_date('%s 00:00:00', 'yyyy-MM-dd hh24:mi:ss')", start));

        // 替换结束时间
        if (StringUtils.isEmpty(end)) {
            // 不传结束时间则取默认值（当前日）
            end = this.signMap.get("CURRENT_DAY" + sourceTypeSuffix);
        }

        if (sourceQuery.getSourceType().equals(SQLQuery.DB_TYPE_MYSQL))
            sql = sql.replace(this.signMap.get("END"), String.format("'%s 23:59:59'", end));
        else
            sql = sql.replace(this.signMap.get("END"), String.format("to_date('%s 23:59:59', 'yyyy-MM-dd hh24:mi:ss')", end));

        // 替换参数 ?1,?2,?3...
        if (null != param) {
            String[] params = param.split(";");
            String change;
            for (int i = 0; i < params.length; i++) {
                change = "?" + (i + 1);
                sql = sql.replace(change, params[i]);
            }
        }

        return new ResponseData(sourceQuery.select(sql));
    }

}
