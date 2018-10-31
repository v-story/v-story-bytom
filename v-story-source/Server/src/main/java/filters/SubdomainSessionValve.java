package filters;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;

import org.apache.catalina.Globals;
import org.apache.catalina.connector.Request;
import org.apache.catalina.connector.Response;
import org.apache.catalina.valves.ValveBase;
//import org.apache.tomcat.util.http.ServerCookie;



public class SubdomainSessionValve extends ValveBase  {

	private static final String DOMAIN = "domain.xx";
	
	@Override
	  public String getInfo() {
	    return "my.tomcat.SubdomainSessionValve/1.0a";
	  }

	  @Override
	  public void invoke(Request req, Response res)
	    throws IOException, ServletException {
	    
	    fixSessionIdCookie(req);
	    
	    getNext().invoke(req, res);
	  }

	  private void fixSessionIdCookie(Request request) {
	    if(getJsessionCookie(request.getCookies()) != null)
	      return;
	    
	    request.getSession();
	    
	    Cookie cookie = getJsessionCookie(request.getResponse().getCookies());
	    if(cookie == null)
	      return;
	    
	    cookie.setDomain(DOMAIN);
	    
	    StringBuffer sb = new StringBuffer();
	    /*
	    ServerCookie.appendCookieValue(sb, 
	        cookie.getVersion(), cookie.getName(), cookie.getValue(),
	        cookie.getPath(), cookie.getDomain(), cookie.getComment(), 
	        cookie.getMaxAge(), cookie.getSecure());
	    */
	    request.getResponse().setHeader("Set-Cookie", sb.toString());
	  }
	  
	  
	  Cookie getJsessionCookie(Cookie[] cc) {
	    for (int i = 0; cc != null &&i < cc.length; i++) {
	      if(Globals.SESSION_COOKIE_NAME.equals(cc[i].getName()))
	        return cc[i];
	    }
	    return null;
	  }	
	
}
