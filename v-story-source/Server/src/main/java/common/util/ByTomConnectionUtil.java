package common.util;

import org.apache.log4j.Logger;

import com.ndoctor.framework.config.QProperties;

import io.bytom.common.Configuration;
import io.bytom.http.Client;

public class ByTomConnectionUtil {
	
	public static Logger logger = Logger.getLogger(ByTomConnectionUtil.class);
			
	public static Client generateClient() throws Exception {
		//QProperties prop 		= new QProperties("D:/dev/apache-tomcat-9.0.0.M9/webapps/funfactory-1.0/WEB-INF/classes/conf/wincsweb.properties");
		QProperties prop 		= new QProperties();
		String ip		= prop.getString("com.funfactory.bytom.ip");
		//String ip		= "http://182.162.62.232:9888";
		String coreURL = Configuration.getValue("bytom.api.url");
        String accessToken = Configuration.getValue("client.access.token");

        if (coreURL == null || coreURL.isEmpty()) {
            coreURL = ip;
        }

        if (coreURL.endsWith("/")) {
            //split the last char "/"
            coreURL = coreURL.substring(0, coreURL.length()-1);
        }

        return new Client(coreURL, accessToken);		
	}
}
