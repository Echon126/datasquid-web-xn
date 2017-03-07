## datasquid-web-xn

效能监测系统


###HTTPS证书
+ 生成keystore
```
keytool -genkey -alias jetty -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore kstore2 -validity 3650
```

+ 生成csr文件
```
keytool -keystore kstore2 -certreq -alias jetty -keyalg rsa -file kstore2.csr
```

+ 自签证书
```
keytool -selfcert -alias jetty -keystore kstore2 -v
```

+ 导出cer证书
```
keytool -export -alias jetty -keystore kstore2 -storepass changeit -rfc -file kstore_jetty.cer
```
