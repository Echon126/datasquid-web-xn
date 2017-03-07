package com.datasquid.web.data;

import com.datasquid.web.data.sql.SQLData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;

/**
 * Created by shixu on 16-11-23.
 */
public class ResponseData extends ResponseEntity<Object> {
    public ResponseData() {
        this(HttpStatus.OK);
    }

    public ResponseData(HttpStatus status) {
        super(status);
    }

    public ResponseData(Object body, HttpStatus status) {
        super(body, status);
    }

    public ResponseData(Object body) {
        this(body, HttpStatus.OK);
    }

    public ResponseData(SQLData data, HttpStatus status) {
        this(data.toMapList(), status);
    }

    public ResponseData(SQLData data) {
        this(data, HttpStatus.OK);
    }

    public ResponseData(MultiValueMap<String, String> headers, HttpStatus status) {
        super(headers, status);
    }

    public ResponseData(Object body, MultiValueMap<String, String> headers, HttpStatus status) {
        super(body, headers, status);
    }

    @Override
    public Object getBody() {
        Object data = super.getBody();

        return new HashMap() {{
            put("data", data);
            put("timestamp", System.currentTimeMillis());
            put("status", getStatusCodeValue());
            put("message", getStatusCode().getReasonPhrase());
        }};

    }
}
