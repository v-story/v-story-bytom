package common.util;

import com.google.gson.Gson;

import spark.ResponseTransformer;

/*
 * author jong-hun park
 */
public class JsonUtil implements ResponseTransformer {
	 
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
}