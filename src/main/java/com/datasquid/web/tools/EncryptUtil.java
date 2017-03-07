package com.datasquid.web.tools;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 加密工具（MD5 / SHA）
 * Created by xcp on 2016/11/30.
 */
public class EncryptUtil {
    public static final String ALGORITHM_SHA = "SHA";
    public static final String ALGORITHM_MD5 = "MD5";

    /**
     * MD5加密
     *
     * @param data
     * @return
     * @throws NoSuchAlgorithmException
     * @throws Exception
     */
    public static byte[] encryptMD5(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest md5 = MessageDigest.getInstance(ALGORITHM_MD5);
        md5.update(data);
        return md5.digest();

    }

    /**
     * SHA加密
     *
     * @param data
     * @return
     * @throws NoSuchAlgorithmException
     * @throws Exception
     */
    public static byte[] encryptSHA(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest sha = MessageDigest.getInstance(ALGORITHM_SHA);
        sha.update(data);
        return sha.digest();
    }
}
