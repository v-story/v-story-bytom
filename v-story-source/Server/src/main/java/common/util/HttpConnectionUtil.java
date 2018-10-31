package common.util;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;

import com.ndoctor.framework.config.QProperties;

public class HttpConnectionUtil {

	private static PoolingHttpClientConnectionManager connectionManager = null;
	
	public static synchronized HttpClient getHttpClient()
	{
		int maxTotal			= 0;
		int defaultMaxPerRoute	= 0;
		try
		{
			QProperties prop 	= new QProperties();
			maxTotal 			= prop.getInt("com.http.maxTotal", 500);
			defaultMaxPerRoute	= prop.getInt("com.http.defaultMaxPerRoute", 50);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		if (connectionManager == null)
		{
			connectionManager = new PoolingHttpClientConnectionManager();
			connectionManager.setMaxTotal(maxTotal);
			connectionManager.setDefaultMaxPerRoute(defaultMaxPerRoute);
		}
		return HttpClients.custom().setConnectionManager(connectionManager).build();
	}

	public static void abort(HttpRequestBase httpRequest)
	{
		if (httpRequest != null) {
			try {
				httpRequest.abort();
			} catch (Exception e) {}
		}
	}

	public static void release(HttpResponse response)
	{
		if (response != null && response.getEntity() != null)
			EntityUtils.consumeQuietly(response.getEntity());
	}
	
}
