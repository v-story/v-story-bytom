package common.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * author jong-hun park
 */
public class JQGridDataUtil<T> {

	private static JQGridDataUtil<?> instance = null;
	
	@SuppressWarnings("rawtypes")
	public synchronized static JQGridDataUtil getInstance()
	{
		if (instance == null)
		{
			instance = new JQGridDataUtil();
		}
		return instance;	
	}	
	
	
	 public Map<String, Object> GetJqgridMap(int page,int total,int records,List<T> rows)
	 {
		  Map<String, Object> map = new HashMap<String, Object>();
		  map.put("page", page);
		  map.put("total", total);
		  map.put("records", records);
		  map.put("rows", rows);
		  return map;
	 }
}
