package common.util;


import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import spark.ResponseTransformer;

/*
 * author jong-hun park
 */
public class JsonUtilManager implements ResponseTransformer
{
	private static JsonUtilManager instance = null;
	
	public synchronized static JsonUtilManager getInstance()
	{
		if (instance == null)
		{
			instance = new JsonUtilManager();
		}
		return instance;	
	}
	
	
    @Override     
    public String render(Object model) {
        return new Gson().toJson(model);
    }	  
	
	public static String toJson(Object object) {
	    return new Gson().toJson(object);
	}
	 
	public static ResponseTransformer json() {
	    return JsonUtil::toJson;
	}
	
	public String renderNoData(int iResult, String strMessage)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("result", iResult);
		map.put("rows", new java.util.ArrayList<>());
		map.put("message", strMessage);
		/*
		map.put("RESULT", iResult);
		map.put("ROWS", new java.util.ArrayList<>());
		map.put("MESSAGE", strMessage);
		*/
		return new Gson().toJson(map);
	}
}
