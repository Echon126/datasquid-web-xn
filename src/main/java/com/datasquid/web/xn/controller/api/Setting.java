package com.datasquid.web.xn.controller.api;

import com.datasquid.web.controller.BaseController;
import com.datasquid.web.data.ResponseData;
import com.datasquid.web.data.sql.SQLData;
import com.datasquid.web.data.sql.SQLQuery;
import com.datasquid.web.data.sql.SQLSourceProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Date;

/**
 * Created by zhangwenjie on 2017/1/19.
 */
@RestController
@RequestMapping("/api/setting")
public class Setting extends BaseController {
    private Log log = LogFactory.getLog(this.getClass());
    private SQLQuery sqlQuery;

    @Autowired
    private SQLSourceProvider sqlSourceProvider;

    @PostConstruct
    private void init() {
        this.sqlQuery = new SQLQuery(this.sqlSourceProvider);
    }

    /**
     * 业务类型的下拉菜单值
     *
     * @return
     */
    @RequestMapping(value = "/service", method = RequestMethod.GET)
    public ResponseData serviceSelect() {
        SQLData data = this.sqlQuery.select("select stid, st_name from ds_service_type t order by t.serial_no");
        return new ResponseData(data);
    }

    /**
     * 环节名称的下拉菜单值
     *
     * @return
     */
    @RequestMapping(value = "/link", method = RequestMethod.GET)
    public ResponseData linkSelect() {
        SQLData data = this.sqlQuery.select("select lnid, ln_name from ds_link_name t order by t.serial_no");
        return new ResponseData(data);
    }

    /**
     * 根据业务类型查询
     *
     * @param type 业务类型表的主键
     * @return
     */
    @RequestMapping(value = "/abnormal", method = RequestMethod.GET)
    public ResponseData paramsList(
            @RequestParam String type
    ) {
        StringBuilder sql = new StringBuilder();
        sql.append("select t.isopen, t.thid as thid ,l.ln_name as pname,s.st_name AS sname,t.threshold as threshold ,t.start_validity_time as starttime, t.end_validity_time as endtime, t.isopen  from ds_threshold t,ds_service_type s,ds_link_name l where t.stid=s.stid and t.lnid=l.lnid and 1=1");
        if (!StringUtils.isEmpty(type)) {
            sql.append(String.format(" and s.stid='%s'", type));
        }
        sql.append(" order by l.serial_no,s.st_name ASC");
        SQLData data = this.sqlQuery.select(sql);
        return new ResponseData(data);
    }

    @RequestMapping(value = "/abnormals/{thid}", method = RequestMethod.GET)
    public ResponseData abnormalList(@PathVariable(value = "thid") int thid) {
        SQLData data = this.sqlQuery.select("select isopen,stid,lnid,threshold,start_validity_time,end_validity_time from ds_threshold where thid=?", thid);
        return new ResponseData(data);
    }

    /**
     * 新增业务阈值
     */
    @RequestMapping(value = "/abnormal", method = RequestMethod.POST)
    public ResponseData abnormalCreate(
            @RequestParam String ywlx,
            @RequestParam String hjmc,
            @RequestParam int threshold,
            @RequestParam(name = "date_start") long dateStart,
            @RequestParam(name = "date_end") long dateEnd,
            @RequestParam(required = false, defaultValue = "N")
            String isopen
    ) throws SQLException {
        SQLData data = new SQLData();
        String thid = String.format("%s%s", ywlx, hjmc);
        if (this.nameRepeat(thid)) {
            return new ResponseData("该环节已存在", HttpStatus.FORBIDDEN);
        }
        data.addSchema("thid", "stid", "lnid", "threshold", "start_validity_time", "end_validity_time", "isopen");
        data.add(thid, ywlx, hjmc, threshold, new Date(dateStart), new Date(dateEnd), isopen);

        int thresholdId = this.sqlQuery.insertOne("ds_threshold", data);
        return new ResponseData(thresholdId);
    }

    /**
     * 修改业务阈值
     */
    @RequestMapping(value = "/abnormals/{thid}", method = RequestMethod.PUT)
    public ResponseData abnormalUpdate(
            @PathVariable(value = "thid") int thid,
            @RequestParam String ywlx,
            @RequestParam String hjmc,
            @RequestParam int threshold,
            @RequestParam(name = "date_start") long dateStart,
            @RequestParam(name = "date_end") long dateEnd,
            @RequestParam(required = false, defaultValue = "N")
            String isopen) {
        SQLData data = new SQLData();
        data.addSchema("thid", "stid", "lnid", "threshold", "start_validity_time", "end_validity_time", "isopen");
        data.add(thid, ywlx, hjmc, threshold, new Date(dateStart), new Date(dateEnd), isopen);
        this.sqlQuery.update("ds_threshold", new String[]{"thid"}, data);
        return new ResponseData(1);
    }

    // 流程名称重复校验
    private boolean nameRepeat(String thid) throws SQLException {
        long count;
        String sql = "select count(1) from ds_threshold where thid=?";
        count = (long) this.sqlQuery.selectScalar(sql, thid);
        return count > 0;
    }

    // 环节删除
    @RequestMapping(value = "/abnormal/{thid}", method = RequestMethod.DELETE)
    public ResponseData abnormalDelete(@PathVariable(value = "thid") String duid) {
        SQLData data = new SQLData();
        data.addSchema("thid");
        data.add(duid);
        this.sqlQuery.delete(data, "ds_threshold");
        return new ResponseData(1);
    }

    // 修改isopen的值
    @RequestMapping(value = "/abnormal/{thid}", method = RequestMethod.PUT)
    public ResponseData abnormalState(@PathVariable(value = "thid") String thid,
                                      @RequestParam String isopen) throws SQLException {
        SQLData data = new SQLData();
        String status = "N".equals(isopen) ? "Y" : "N";
        data.addSchema("thid", "isopen");
        data.add(thid, status);
        this.sqlQuery.update("ds_threshold", new String[]{"thid"}, data);
        return new ResponseData(1);
    }

    //根据业务类型查询关区
    @RequestMapping(value = "/customs", method = RequestMethod.GET)
    public ResponseData customsLists(@RequestParam String code) {
        StringBuilder sql = new StringBuilder();
        sql.append("select gqid,name,code from ds_customs where 1=1");
        if (!StringUtils.isEmpty(code)) {
            sql.append(String.format(" and s.code='%s'", code));
        }
        sql.append(" order by create_time");
        SQLData data = this.sqlQuery.select(sql);
        return new ResponseData(data);
    }

    @RequestMapping(value = "/custom/{gqid}", method = RequestMethod.GET)
    public ResponseData customsList(@PathVariable(value = "gqid") int gqid) {
        SQLData data = this.sqlQuery.select("select name, code  from ds_customs where gqid=?", gqid);
        return new ResponseData(data);
    }

    //关区代码维护删除
    @RequestMapping(value = "/customs/{gqid}", method = RequestMethod.DELETE)
    public ResponseData customsDelete(
            @PathVariable(value = "gqid") int gqid
    ) {
        SQLData data = new SQLData();
        data.addSchema("gqid");
        data.add(gqid);
        this.sqlQuery.delete(data, "ds_customs");
        return new ResponseData(1);

    }

    /**
     * 新增关区代码维护
     */
    @RequestMapping(value = "/customs", method = RequestMethod.POST)
    public ResponseData customsCreate(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String code
    ) throws SQLException {
        if (StringUtils.isEmpty(name)) {
            return new ResponseData("关区名称名称不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(code)) {
            return new ResponseData("关区代码不能为空", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("name", "code");
        data.add(name, code);
        int gqid = this.sqlQuery.insertOne("ds_customs", data);
        return new ResponseData(gqid);
    }

    @RequestMapping(value = "/customs/{gqid}", method = RequestMethod.PUT)
    public ResponseData customsUpdate(
            @PathVariable(value = "gqid") int gqid,
            @RequestParam String name,
            @RequestParam String code
    ) {
        SQLData data = new SQLData();
        data.addSchema("gqid", "name", "code");
        data.add(gqid, name, code);
        this.sqlQuery.update("ds_customs", new String[]{"gqid"}, data);
        return new ResponseData(1);
    }


    @RequestMapping(value = "/goods", method = RequestMethod.GET)
    public ResponseData goodsLists(@RequestParam String type) {
        StringBuilder sql = new StringBuilder();
        sql.append("select spid, code,name,species,type from ds_goods where 1=1");
        if (!StringUtils.isEmpty(type)) {
            sql.append(String.format(" and type='%s'", type));
        }
        sql.append(" order by create_time");
        SQLData data = this.sqlQuery.select(sql);
        return new ResponseData(data);
    }

    @RequestMapping(value = "/good/{spid}", method = RequestMethod.GET)
    public ResponseData goodsList(@PathVariable(value = "spid") int spid) {
        SQLData data = this.sqlQuery.select("select code, name ,species,type from ds_goods where spid=?", spid);
        return new ResponseData(data);
    }

    /**
     * 新增商品品类归类维护
     */
    @RequestMapping(value = "/goods", method = RequestMethod.POST)
    public ResponseData goodsCreate(
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam String species,
            @RequestParam String type
    ) throws SQLException {
        if (StringUtils.isEmpty(code)) {
            return new ResponseData("商品代码不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(name)) {
            return new ResponseData("商品名称名称不能为空", HttpStatus.FORBIDDEN);
        }
        if (StringUtils.isEmpty(species)) {
            return new ResponseData("商品品类不能为空", HttpStatus.FORBIDDEN);
        }
        SQLData data = new SQLData();
        data.addSchema("code", "name", "species", "type");
        data.add(code, name, species, type);
        int spid = this.sqlQuery.insertOne("ds_goods", data);
        return new ResponseData(spid);
    }

    //商品归类表删除
    @RequestMapping(value = "/goods/{spid}", method = RequestMethod.DELETE)
    public ResponseData goodsDelete(
            @PathVariable(value = "spid") int spid
    ) {
        SQLData data = new SQLData();
        data.addSchema("spid");
        data.add(spid);
        this.sqlQuery.delete(data, "ds_goods");
        return new ResponseData(1);
    }

    @RequestMapping(value = "/goods/{spid}", method = RequestMethod.PUT)
    public ResponseData goodsUpdate(
            @PathVariable(value = "spid") int spid,
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam String species,
            @RequestParam String type) {
        SQLData data = new SQLData();
        data.addSchema("spid", "code", "name", "species", "type");
        data.add(spid, code, name, species, type);
        this.sqlQuery.update("ds_goods", new String[]{"spid"}, data);
        return new ResponseData(1);
    }

    //汇率值查询,根据年度和月份进行查询
    @RequestMapping(value = "/exrate/{month}/{year}", method = RequestMethod.GET)
    public ResponseData exrateSelect(@PathVariable(value = "month") String month, @PathVariable(value = "year") String year) {
        SQLData data = this.sqlQuery.select("select s.rid,s.country,s.currency,s.code,s.rateid,(select t.rate from ds_exrate t where t.rid = s.rid and  t.month = ? and t.year=?) as rate," +
                "(select t.year from ds_exrate t where t.rid = s.rid and  t.month = ? and t.year=?) as year,(select t.month from ds_exrate t where t.rid = s.rid and   t.month = ? and t.year=?) as month " +
                "from ds_exrate_info s order by serial_no", month, year, month, year, month, year);
        return new ResponseData(data);
    }

    @RequestMapping(value = "/exrate", method = RequestMethod.GET)
    public ResponseData exratesSelect() {
        SQLData data = this.sqlQuery.select("select distinct year,month from ds_exrate order by create_time");
        return new ResponseData(data);
    }

    //汇率折算编辑
    @RequestMapping(value = "/exrate/{rid}", method = RequestMethod.PUT)
    public ResponseData exrateEdit(
            @PathVariable(value = "rid") int rid,
            @RequestParam(name = "rate", required = false, defaultValue = "") String rate,
            @RequestParam(name = "date_years") String year,
            @RequestParam String month
    ) throws ParseException, SQLException {
        int count = 0;
        SQLData data = new SQLData();
        SQLData dataList = this.sqlQuery.select("select erid from ds_exrate where rid=? and year=? and month=?", rid, year, month);
        count = dataList.getDataList().size();
        if (count > 0) {
            data.addSchema("rid", "year", "month", "rate");
            data.add(rid, year, month, rate);
            this.sqlQuery.update("ds_exrate", new String[]{"rid", "year", "month"}, data);
        } else {
            data.addSchema("rid", "year", "month", "rate");
            data.add(rid, year, month, rate);
            int spid = this.sqlQuery.insertOne("ds_exrate", data);
        }
        return new ResponseData(1);
    }


}
