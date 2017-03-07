package com.datasquid.web.filter;

import com.datasquid.web.data.ResponseData;
import com.alibaba.druid.support.json.JSONUtils;
import com.alibaba.druid.util.DruidWebUtils;
import com.alibaba.druid.util.PatternMatcher;
import com.alibaba.druid.util.ServletPathMatcher;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

/**
 * 登陆过滤器
 * Created by xcp on 2016/12/01.
 */
@WebFilter(filterName = "loginFilter", urlPatterns = "/*",
        initParams = {
                @WebInitParam(name = "pass", value = "/,/api/login*,/css/*,/js/*,/image/*,/lib/*,/druid/*,/health*,/metrics*"),
                @WebInitParam(name = "loginURL", value = "/")
        })
public class LoginFilter implements Filter {
    private Log log = LogFactory.getLog(this.getClass());

    private HashSet<String> passSet;
    private String contextPath;
    private PatternMatcher pathMatcher = new ServletPathMatcher();
    private String loginURL;

    public boolean isExclusion(String requestURI) {
        if (this.passSet == null || requestURI == null) {
            return false;
        }

        if (contextPath != null && requestURI.startsWith(contextPath)) {
            requestURI = requestURI.substring(contextPath.length());
            if (!requestURI.startsWith("/")) {
                requestURI = "/" + requestURI;
            }
        }

        for (String pattern : this.passSet) {
            if (this.pathMatcher.matches(pattern, requestURI)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.contextPath = DruidWebUtils.getContextPath(filterConfig.getServletContext());
        this.loginURL = filterConfig.getInitParameter("loginURL");
        String pass = filterConfig.getInitParameter("pass");

        this.log.info("初始化 loginFilter 登陆过滤器，放行路径为：" + pass);

        if (null != pass && pass.length() != 0) { // 放行不为空
            this.passSet = new HashSet<>(Arrays.asList(pass.split("\\s*,\\s*")));
        }

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain) throws IOException, ServletException {
        req.setCharacterEncoding("utf-8");
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        HttpSession session = request.getSession();

        if (this.isExclusion(request.getRequestURI())) {   // 转发到下一步
            this.log.debug("loginFilter 登陆过滤器拦截了一个请求： " + request.getRequestURI() + " ->资源放行");
            filterChain.doFilter(req, res);
            return;
        }

        if (session.getAttribute("user") != null) {   // 转发到下一步
            this.log.debug("loginFilter 登陆过滤器拦截了一个请求： " + request.getRequestURI() + " ->身份放行");
            filterChain.doFilter(req, res);
            return;
        }

        //返回到登录页面
        String requestedWith = request.getHeader("X-Requested-With");
        if ((requestedWith != null) && ("XMLHttpRequest".equals(requestedWith))) {
            this.log.debug("loginFilter 登陆过滤器拦截了一个请求： " + request.getRequestURI() + " ->REST拦截");

            HashMap<String, String> responseData = new HashMap<>();
            responseData.put("message", "会话超时，请重新登录");
            responseData.put("login", this.loginURL);

            String responseJSON = JSONUtils.toJSONString(new ResponseData(responseData, HttpStatus.UNAUTHORIZED).getBody());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json");
            response.getWriter().write(responseJSON);
            response.flushBuffer();
            return;
        }

        this.log.debug("loginFilter 登陆过滤器拦截了一个请求： " + request.getRequestURI() + " ->Web拦截");
        response.sendRedirect(this.loginURL);
    }


    @Override
    public void destroy() {
        this.log.info("loginFilter 登陆过滤器销毁");
    }
}
