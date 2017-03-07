package com.datasquid.web.tools;

/**
 * Created by Administrator on 2017/2/16.
 */
public class RateConversion {

    //汇率换算(美元换算成人民币)
    public static double rateConversion(double rate, String money) {
        double result = 0;
        if(!money.isEmpty()){
            float conversion = Float.parseFloat(money);
            result=rate*conversion;
        }
        return result;
    }
}
