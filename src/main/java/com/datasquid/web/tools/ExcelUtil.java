package com.datasquid.web.tools;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by Administrator on 2017/2/14.
 */
public class ExcelUtil {
    XSSFWorkbook wb = null;
    XSSFSheet sheet = null;
    private String srcXlsPath = "";
    private String desXlsPath = "";
    private String sheetName = "";

    /* public static void main(String[] args) throws IOException, InvalidFormatException {
         ExcelUtil excelUtil = new ExcelUtil();
         excelUtil.setSrcPath("D:\\跨境统计报表-1.xlsx");
         excelUtil.setDesPath("D:/export.xlsx");
         excelUtil.setSheetName("Sheet2");
         excelUtil.getSheet();
         for(int i=1;i<=19;i++){
             excelUtil.setCellIntValue(7, i, i);
         }
         for(int i=1;i<=19;i++){
             excelUtil.setCellIntValue(8, i, i);
         }
         for(int i=1;i<=19;i++){
             excelUtil.setCellIntValue(9, i, i);
         }
         for(int i=1;i<=19;i++){
             excelUtil.setCellIntValue(10, i, i);
         }
         excelUtil.exportToNewFile();
     }*/
    public void setSrcPath(String srcXlsPath) {
        this.srcXlsPath = srcXlsPath;
    }

    public void setDesPath(String desXlsPath) {
        this.desXlsPath = desXlsPath;
    }

    public void setSheetName(String sheetName) {
        this.sheetName = sheetName;
    }

    public void getSheet() {
        try {
            File fi = new File(srcXlsPath);
            if (!fi.exists()) {
                System.out.println("模板文件:" + srcXlsPath + "不存在!");
                return;
            }
            //读取excel模板
            wb = new XSSFWorkbook(OPCPackage.open(String.valueOf(fi)));
            //读取了模板内所有sheet内容
            //sheet = wb.getSheetAt(0);
            sheet = wb.getSheet(sheetName);
        } catch (InvalidFormatException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void setCellStrValue(int rowIndex, int cellnum, String value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    public void setCellIntValue(int rowIndex, int cellnum, int value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    public void setCellDateValue(int rowIndex, int cellnum, Date value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    public void setCellDoubleValue(int rowIndex, int cellnum, double value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    public void setCellBoolValue(int rowIndex, int cellnum, boolean value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    public void setCellCalendarValue(int rowIndex, int cellnum, Calendar value) {
        XSSFCell cell = sheet.getRow(rowIndex).getCell(cellnum);
        cell.setCellValue(value);
    }

    // 导出
    public void exportToNewFile() {
        FileOutputStream out;
        try {
            out = new FileOutputStream(desXlsPath);
            wb.write(out);
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public   XSSFWorkbook getWorkBook(){
        return wb;
    }
}
