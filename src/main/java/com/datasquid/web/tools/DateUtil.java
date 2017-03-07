package com.datasquid.web.tools;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * 日期转换
 * Created by xcp on 2016/12/1.
 */
public class DateUtil {

    private final static SimpleDateFormat sdfYear = new SimpleDateFormat("yyyy");

    private final static SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");

    private final static SimpleDateFormat sdfDays = new SimpleDateFormat("yyyyMMdd");

    private final static SimpleDateFormat sdfTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取YYYY格式
     *
     * @return
     */
    public static String getYear() {
        return sdfYear.format(new Date());
    }

    /**
     * 获取YYYY-MM-DD格式
     *
     * @return
     */
    public static String getDay() {
        return sdfDay.format(new Date());
    }

    /**
     * 获取YYYYMMDD格式
     *
     * @return
     */
    public static String getDays() {
        return sdfDays.format(new Date());
    }

    /**
     * 获取YYYY-MM-DD HH:mm:ss格式
     *
     * @return
     */
    public static String getTime() {
        return sdfTime.format(new Date());
    }

    /**
     * @param s
     * @param e
     * @return boolean
     * @throws
     * @Title: compareDate
     * @Description: TODO(日期比较，如果s>=e 返回true 否则返回false)
     * @author luguosui
     */
    public static boolean compareDate(String s, String e) {
        if (fomatDate(s) == null || fomatDate(e) == null) {
            return false;
        }
        return fomatDate(s).getTime() >= fomatDate(e).getTime();
    }

    /**
     * 格式化日期
     *
     * @return
     */
    public static Date fomatDate(String date) {
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return fmt.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 校验日期是否合法
     *
     * @return
     */
    public static boolean isValidDate(String s) {
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        try {
            fmt.parse(s);
            return true;
        } catch (Exception e) {
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            return false;
        }
    }

    public static int getDiffYear(String startTime, String endTime) {
        DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        try {
            long aa = 0;
            int years = (int) (((fmt.parse(endTime).getTime() - fmt.parse(startTime).getTime()) / (1000 * 60 * 60 * 24)) / 365);
            return years;
        } catch (Exception e) {
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            return 0;
        }
    }

    /**
     * <li>功能描述：时间相减得到天数
     *
     * @param beginDateStr
     * @param endDateStr
     * @return long
     * @author Administrator
     */
    public static long getDaySub(String beginDateStr, String endDateStr) {
        long day = 0;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date beginDate = null;
        Date endDate = null;

        try {
            beginDate = format.parse(beginDateStr);
            endDate = format.parse(endDateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        day = (endDate.getTime() - beginDate.getTime()) / (24 * 60 * 60 * 1000);
        //System.out.println("相隔的天数="+day);

        return day;
    }

    /**
     * 得到n天之后的日期
     *
     * @param days
     * @return
     */
    public static String getAfterDayDate(String days) {
        int daysInt = Integer.parseInt(days);

        Calendar canlendar = Calendar.getInstance(); // java.util包
        canlendar.add(Calendar.DATE, daysInt); // 日期减 如果不够减会将月变动
        Date date = canlendar.getTime();

        SimpleDateFormat sdfd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateStr = sdfd.format(date);

        return dateStr;
    }

    /**
     * 得到n天之后是周几
     *
     * @param days
     * @return
     */
    public static String getAfterDayWeek(String days) {
        int daysInt = Integer.parseInt(days);

        Calendar canlendar = Calendar.getInstance(); // java.util包
        canlendar.add(Calendar.DATE, daysInt); // 日期减 如果不够减会将月变动
        Date date = canlendar.getTime();

        SimpleDateFormat sdf = new SimpleDateFormat("E");
        String dateStr = sdf.format(date);

        return dateStr;
    }

    /**
     * 获取当前时间对象
     *
     * @return
     */
    public static Date getNowDate() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 获取当前时间,并将其转换为形式:"2006-06-06 09:54:29"的字符串
     *
     * @return
     */
    public static Date getNowDateAndTime() {
        return DateUtil.convertToDateAndTime(DateUtil.getNowDateAndTimeStr());
    }

    /**
     * 获取当前时间,并将其转换为形式:"2006-06-06"的字符串
     *
     * @return
     */
    public static String getNowDateStr() {
        return DateUtil.convertToDateStr(getNowDate());
    }

    /**
     * 获取当前时间,并将其转换为形式:"2006-06-06 09:54:29"的字符串
     *
     * @return
     */
    public static String getNowDateAndTimeStr() {
        return DateUtil.convertToDateAndTimeStr(getNowDate());
    }

    /**
     * 更具给定的pattern时间形式进行时间字符串转换得到当前时间
     *
     * @param pattern
     * @return
     */
    public static String getDateStrByPattern(String pattern) {
        return getDateStrByPattern(pattern, getNowDate());
    }

    /**
     * 更具给定的pattern时间形式进行时间字符串转换得到当前时间
     *
     * @param pattern
     * @return
     */
    public static String getDateStrByPattern(Locale locale, String pattern) {
        return getDateStrByPattern(locale, pattern, getNowDate());
    }

    /**
     * 更具给定的pattern时间形式进行时间date的字符串转换
     *
     * @param pattern
     * @param date
     * @return
     */
    public static String getDateStrByPattern(String pattern, Date date) {
        if (date == null) return null;
        if (pattern == null) return convertToDateAndTimeStr(date);
        SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
        return dateFormat.format(date);
    }

    /**
     * 更具给定的pattern时间形式进行时间date的字符串转换
     *
     * @param pattern
     * @param date
     * @return
     */
    public static String getDateStrByPattern(Locale locale, String pattern, Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(pattern, locale);
        return dateFormat.format(date);
    }

    /**
     * 把String类型的日期表示转换为Date类型,转换的类型必须2008-09-27"形式,忽略时分秒
     *
     * @return
     */
    public static String convertToDateStr(Date date) {
        if (date == null) return null;
        DateFormat formatParse = new SimpleDateFormat("yyyy-MM-dd");
        return formatParse.format(date);
    }

    /**
     * 把String类型的日期表示转换为Date类型,转换的类型必须2008-09-27"形式,忽略时分秒
     *
     * @return
     */
    public static String convertToDateAndTimeStr(Date date) {
        if (date == null) return null;
        DateFormat formatParse = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return formatParse.format(date);
    }

    /**
     * 把String类型的日期表示转换为Date类型,转换的类型必须2008-09-27"形式,忽略时分秒
     *
     * @param dateStr
     * @return
     */
    public static Date convertToDate(String dateStr) {
        if (dateStr == null || "".equals(dateStr)) return null;
        DateFormat formatParse = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return formatParse.parse(dateStr);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            throw new RuntimeException("传入的String类型格式错误,正确的格式必须为‘yyyy-MM-dd�?�?006-02-07");
        }
    }

    /**
     * 将日期类型的时分秒置为00:00:00的日期
     *
     * @param date
     * @return
     */
    public static Date convertToDate(Date date) {
        return convertToDateAndTime(convertToDateStr(date) + " 00:00:00");
    }

    /**
     * 把String类型的日期表示转换为Date类型,转换的类型必须2006-02-07 17:09:30"形式,忽略时分秒
     *
     * @param dateStr
     * @return
     */
    public static Date convertToDateAndTime(String dateStr) {
        if (dateStr == null || "".equals(dateStr)) return null;
        DateFormat formatParse = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return formatParse.parse(dateStr);
        } catch (ParseException e) {
            throw new RuntimeException("传入的String类型格式错误,正确的格式必须为‘yyyy-MM-dd HH:mm:ss006-02-07 17:09:30");
        }
    }

    /**
     * 把String类型的日期表示转换为Date类型,转换的类型必须2006-02-07 17:09:30"形式,忽略时分秒
     *
     * @param dateStr
     * @return
     */
    public static Date convertToDateAndTime(String dateStr, String parsePattern) {
        if (dateStr == null) return null;
        DateFormat formatParse = new SimpleDateFormat(parsePattern);
        try {
            return formatParse.parse(dateStr);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            throw new RuntimeException("传入的String类型格式错误,正确的格式必须为‘yyyy-MM-dd HH:mm:ss006-02-07 17:09:30");
        }
    }


    /**
     * 通过年份，得到年初的第一天的第一时刻，如010-01-01 00:00:00.0
     *
     * @param year
     * @return
     */
    public static Date getFristDate(int year) {
        return getFristDate(year, Calendar.getInstance().getActualMinimum(Calendar.MONTH));
    }


    /**
     * 通过年份，得到年初的����的最后时刻，如：2010-12-30 23:59:59.999
     *
     * @param year
     * @return
     */
    public static Date getLastDate(int year) {
        return getLastDate(year, Calendar.getInstance().getActualMaximum(Calendar.MONTH));
    }

    /**
     * 通过年份、月份，得到年初的第��的第��刻，如：2010-01-01 00:00:00.0
     *
     * @param year  如： 2008, 2009, 2010
     * @param month 如： Calendar.JANUARY, Calendar.FEBRUARY
     * @return
     */
    public static Date getFristDate(int year, int month) {
        return getFristDate(year, month, Calendar.getInstance().getActualMinimum(Calendar.DAY_OF_MONTH));
    }


    /**
     * 通过年份、月份，得到年初的最后一天的��时刻，如010-12-30 23:59:59.999
     *
     * @param year  如： 2008, 2009, 2010
     * @param month 如： Calendar.JANUARY, Calendar.FEBRUARY
     * @return
     */
    public static Date getLastDate(int year, int month) {
        return getLastDate(year, month, Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH));
    }

    /**
     * 通过年份、月份月份中的某天，得到年初的第一天的第一时刻，如010-01-01 00:00:00.0
     *
     * @param year  如： 2008, 2009, 2010
     * @param month 如： Calendar.JANUARY, Calendar.FEBRUARY
     * @return
     */
    public static Date getFristDate(int year, int month, int dayOfMonth) {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month);
        c.set(Calendar.DAY_OF_MONTH, dayOfMonth);
        c.set(Calendar.HOUR_OF_DAY, c.getActualMinimum(Calendar.HOUR_OF_DAY));
        c.set(Calendar.MINUTE, c.getActualMinimum(Calendar.MINUTE));
        c.set(Calendar.SECOND, c.getActualMinimum(Calendar.SECOND));
        c.set(Calendar.MILLISECOND, c.getActualMinimum(Calendar.MILLISECOND));
        return c.getTime();
    }


    /**
     * 通过年份、月份月份中的某天，得到年初的的最后时刻，如：2010-12-30 23:59:59.999
     *
     * @param year  如： 2008, 2009, 2010
     * @param month 如： Calendar.JANUARY, Calendar.FEBRUARY
     * @return
     */
    public static Date getLastDate(int year, int month, int dayOfMonth) {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month);
        c.set(Calendar.DAY_OF_MONTH, dayOfMonth);
        c.set(Calendar.HOUR_OF_DAY, c.getActualMaximum(Calendar.HOUR_OF_DAY));
        c.set(Calendar.MINUTE, c.getActualMaximum(Calendar.MINUTE));
        c.set(Calendar.SECOND, c.getActualMaximum(Calendar.SECOND));
        c.set(Calendar.MILLISECOND, c.getActualMaximum(Calendar.MILLISECOND));
        return c.getTime();
    }

    public static int getYear(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.YEAR);
    }

    public static int getMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.MONTH);
    }

    public static int[] getMonths() {
        return new int[]{Calendar.JANUARY, Calendar.FEBRUARY, Calendar.MARCH, Calendar.APRIL, Calendar.MAY, Calendar.JUNE, Calendar.JULY, Calendar.AUGUST, Calendar.SEPTEMBER, Calendar.OCTOBER,
                Calendar.NOVEMBER, Calendar.DECEMBER};
    }

    public static String convertMsToDDHHSSMM(long ms) {
        long days = ms / (1000 * 60 * 60 * 24);
        long hours = (ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
        long minutes = (ms % (1000 * 60 * 60)) / (1000 * 60);
        long seconds = (ms % (1000 * 60)) / 1000;
        return days + "日" + hours + "小时" + minutes + "分" + seconds + "秒";
    }

    public static String convertMsToHHSSMM(long ms) {
        long hours = ms / (1000 * 60 * 60);
        long minutes = (ms % (1000 * 60 * 60)) / (1000 * 60);
        long seconds = (ms % (1000 * 60)) / 1000;
        return hours + "小时" + minutes + "分" + seconds + "秒";
    }
//	public static void main(String[] args) {
//		System.out.println(DateUtil.convertToDateAndTimeStr(getLastDayOfYearMonthDate()));
//	}

    public static String dateDiff(String startTime, String endTime) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date stime = null;
        Date etime = null;
        try {
            stime = df.parse(startTime);
            etime = df.parse(endTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        long l = etime.getTime() - stime.getTime();
        long day = l / (24 * 60 * 60 * 1000);
        long hour = (l / (60 * 60 * 1000) - day * 24);
        long min = ((l / (60 * 1000)) - day * 24 * 60 - hour * 60);
        long s = (l / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
        return "" + hour + "小时" + min + "分" + s + "秒";
    }

    public static Date getDateTime(String createTime) {
        if (createTime == null || "".equals(createTime)) {
            return new Date();
        } else {
            try {
                return DateUtil.convertToDateAndTime(createTime);
            } catch (Exception ex) {
                return new Date();
            }
        }
    }

    /**
     * 获取当前时间,并将其转换为形式:"20161026093455"的字符串
     *
     * @return String
     */
    public static String getTimesStrNum_yyyyMMddHHmmss() {
        Date date = new Date();
        DateFormat formatParse = new SimpleDateFormat("yyyyMMddHHmmss");
        return formatParse.format(date);
    }


    /**
     * 获取当前时间,并将其转换为形式:"20161026093455045"的字符串
     *
     * @return String
     */
    public static String getTimesStrNum_yyyyMMddHHmmssSSS() {
        Date date = new Date();
        DateFormat formatParse = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        return formatParse.format(date);
    }

//    public static void main(String[] args) {
//        System.out.println(getTimesStrNum_yyyyMMddHHmmssSSS());
//        System.out.println(System.currentTimeMillis());
//        System.out.println(System.currentTimeMillis() / 1000);
//    }

}
