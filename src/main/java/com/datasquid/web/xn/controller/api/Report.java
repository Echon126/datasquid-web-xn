package com.datasquid.web.xn.controller.api;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.datasquid.web.configuration.WebConfiguration;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import com.datasquid.web.tools.DownloadUtils;
import com.datasquid.web.xn.controller.api.export.BaseExport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2017/2/15.
 */
@RestController
@RequestMapping("/api/report")
public class Report extends BaseExport {
    @Autowired
    protected WebConfiguration webMap;
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery sqlQuery;
    private SQLQuery sqlQueryMH;
    private SQLQuery sqlQueryWT;
    @Autowired
    private SQLSourceProvider sqlSourceProvider;

    private String getCustomsCondition(String tableAlias) {
        SQLData data = this.sqlQuery.select("SELECT code FROM ds_customs");
        if (data.isEmpty())
            return "";

        List<String> conditions = new ArrayList<>();
        data.getDataList().forEach(item -> conditions.add("'" + item[0].toString() + "'"));
        return String.format(" AND %s.customs_code IN(%s) ", tableAlias, String.join(",", conditions));
    }

    @PostConstruct
    private void init() {
        this.sqlQuery = new SQLQuery(this.sqlSourceProvider);
        this.sqlQueryMH = new SQLQuery(this.sqlSourceProvider);
        this.sqlQueryMH.setSourceName("MH");

        this.sqlQueryWT = new SQLQuery(this.sqlSourceProvider);
        this.sqlQueryWT.setSourceName("WT");
    }

    //加载关区下拉菜单
    @RequestMapping(value = "/customs", method = RequestMethod.GET)
    public ResponseData customsList() {
        SQLData data = this.sqlQuery.select("select gqid,code,name from ds_customs  order by create_time");
        return new ResponseData(data);
    }

    //根据关区代码和企业代码查询企业信息
    @RequestMapping(value = "/transaction01", method = RequestMethod.GET)
    public ResponseData enterpriseList(@RequestParam String code,
                                       @RequestParam(name = "date_time") long time,
                                       @RequestParam String ieType
    ) {
        if (ieType.equals("I"))
            return this.enterpriseListExport(code, time);

        return this.enterpriseListImport(code, time);
    }

    private ResponseData enterpriseListExport(String code, long time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        Date date = new Date(time);
        String times = sdf.format(date);
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT sum(lst.total_price) AS ordersum, ivt.ebc_code as code, ivt.EBC_NAME as name FROM ecssent.ceb2_invt_head ivt, ecssent.ceb2_invt_list lst WHERE lst.head_guid = ivt.head_guid AND ivt.dist_status = '8' ");
        if (!StringUtils.isEmpty(code)) {
            sql.append(" and ivt.customs_code ='").append(code).append("' ");
        } else {
            sql.append(this.getCustomsCondition("ivt"));
        }

        if (!StringUtils.isEmpty(time)) {
            sql.append("and ivt.app_time >= to_date('").append(times).append("', 'yyyy-MM') and ivt.app_time < add_months(to_date('").append(times).append("' ,'yyyy-mm'), 1)");
        }
        sql.append(" group by ivt.ebc_code, ivt.EBC_NAME ORDER BY ordersum DESC");
        SQLData data = this.sqlQueryWT.select(sql);
        return new ResponseData(data);
    }

    private ResponseData enterpriseListImport(String code, long time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        Date date = new Date(time);
        String times = sdf.format(date);
        StringBuilder sql = new StringBuilder();
        sql.append("select cbe_name as name, cbe_code as code,sum(ordersum) as ordersum from (select bill.cbe_name,bill.cbe_code, (select sum(prd.ordersum) from " +
                "mhckdb.tb_bonded_import_bill_product prd  where prd.bill_id = bill.bill_id) ordersum from mhckdb.tb_bonded_import_bill bill " +
                " where bill.last_status in ('13', '6') and 1=1");
        if (!StringUtils.isEmpty(code)) {
            sql.append(" and bill.customs_code ='").append(code).append("' ");
        } else {
            sql.append(this.getCustomsCondition("bill"));
        }

        if (!StringUtils.isEmpty(time)) {
            sql.append("and bill.stime >= to_date('").append(times).append("', 'yyyy-MM') and bill.stime < add_months(to_date('").append(times).append("' ,'yyyy-mm'), 1)");
        }
        sql.append(") group by cbe_code, cbe_name ORDER BY ordersum DESC");
        SQLData data = this.sqlQueryMH.select(sql);
        return new ResponseData(data);
    }

    //根据url从服务器下载文件
    @RequestMapping(value = "/reportDownload")
    public void reportDownload(@RequestParam String sign,
                               @RequestParam String fileName,
                               HttpServletResponse response

    ) {
        try {
            String newFileName = fileName;
            String outFolderPath = "";
            switch (sign) {
                case "report1": {
                    newFileName = "口岸办业务月报-";
                    outFolderPath = this.webMap.getOutFolder1();
                    break;
                }
                case "report2": {
                    newFileName = "商务厅跨境企业月报-";
                    outFolderPath = this.webMap.getOutFolder2();
                    break;
                }
                case "report3": {
                    newFileName = "商务厅跨境交易月报-";
                    outFolderPath = this.webMap.getOutFolder3();
                    break;
                }
                case "report4": {
                    newFileName = "商务厅跨境汇总月报-";
                    outFolderPath = this.webMap.getOutFolder4();
                    break;
                }
            }
            String url = outFolderPath + File.separator + fileName;
            File file = new File(url);
            if (!file.exists()) {
                this.log.error("下载报表不存在：url=" + url);
                return;
            }
            String time = fileName.split("-")[1].substring(0, 6);
            String reportName = newFileName + time + ".xls";

            DownloadUtils.download(response, file, reportName, "utf-8");
        } catch (Exception e) {
            this.log.error("下载报表异常", e);
        }
    }


    // 报表删除
    @RequestMapping(value = "removeFile", method = RequestMethod.POST)
    public ResponseData removeFile(@RequestParam String fileName, @RequestParam String sign) {
        try {
            String outFolderPath = "";
            switch (sign) {
                case "report1": {
                    outFolderPath = this.webMap.getOutFolder1();
                    break;
                }
                case "report2": {
                    outFolderPath = this.webMap.getOutFolder2();
                    break;
                }
                case "report3": {
                    outFolderPath = this.webMap.getOutFolder3();
                    break;
                }
                case "report4": {
                    outFolderPath = this.webMap.getOutFolder4();
                    break;
                }
            }
            String url = outFolderPath + File.separator + fileName;
            File file = new File(url);
            if (!file.exists()) {
                return new ResponseData("该报表不存在", HttpStatus.NOT_FOUND);
            }
            file.delete();
        } catch (Exception e) {
            this.log.error("报表删除异常", e);
            return new ResponseData("报表删除异常（已占用）", HttpStatus.FAILED_DEPENDENCY);

        }
        return new ResponseData("报表删除成功");
    }
}
