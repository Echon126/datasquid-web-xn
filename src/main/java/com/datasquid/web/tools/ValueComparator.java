package com.datasquid.web.tools;

import java.util.Comparator;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/22.
 */
public class ValueComparator implements Comparator<Map.Entry<String, Double>> {

    public int compare(Map.Entry<String, Double> m, Map.Entry<String, Double> n) {
        return n.getValue().compareTo(m.getValue());
    }

}
