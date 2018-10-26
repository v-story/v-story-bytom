package common.util;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.univocity.parsers.common.processor.BeanListProcessor;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import net.sf.jsefa.common.converter.DateConverter;
import net.sf.jsefa.common.converter.SimpleTypeConverterConfiguration;
import net.sf.jsefa.csv.CsvIOFactory;
import net.sf.jsefa.csv.CsvSerializer;
import net.sf.jsefa.csv.config.CsvConfiguration;
import spark.Request;

/*
 * author jong-hun park
 */
public class StringUtil {
	Logger logger = Logger.getLogger(StringUtil.class);
	private static StringUtil instance = null;
	public final String NULL_STR = "null";
	public final String ZERO_STR = "0";
	public final String DUBZERO_STR = "0.00";
	public final String EMPTY_STR = "";

	public synchronized static StringUtil getInstance() {
		if (instance == null) {
			instance = new StringUtil();
		}
		return instance;
	}

	public synchronized final Map<String, Object> ParamMap(Request req, Object[] array) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.clear();
		String paramName = null;
		if (null == array)
			return paramMap;
		for (int i = 0; i < array.length; i++) {

			if (null == array[i])
				continue;
			paramName = (String) array[i];

			paramMap.put(paramName.toUpperCase(), EmptyStringCheck(req.queryParams(paramName)));
		}
		// paramMap.put("OPER_ID",LoginUtil.getUserId(req));
		return paramMap;
	}

	public synchronized final Map<String, Object> ParamMap(Request req) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.clear();
		String paramName = null;
		Enumeration<String> enums = req.raw().getParameterNames();
		while (enums.hasMoreElements()) {
			paramName = (String) enums.nextElement();
			System.out.println("paramName value is:::::::::::::::::::::" + paramName);
		}

		return null;

	}

	public synchronized final Object ParamMap(Request req, Object[] array, Object obj) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.clear();
		String paramName = null;
		Object paramValue = null;
		if (null == array)
			return paramMap;
		JSONObject jsonObject = new JSONObject();
		for (int i = 0; i < array.length; i++) {

			if (null == array[i])
				continue;
			paramName = (String) array[i];
			paramValue = EmptyStringCheck(req.queryParams(paramName));
			if (paramValue instanceof JSONObject) {
				paramValue = JsonObjectToUpperCase((JSONObject) paramValue);
			}
			jsonObject.put(paramName.toUpperCase(), paramValue);
			// paramMap.put(paramName.toUpperCase(),
			// EmptyStringCheck(req.queryParams(paramName)));
		}
		// jsonObject.put("OPER_ID",LoginUtil.getUserId(req));
		Gson gson = new Gson();
		return gson.fromJson(jsonObject.toString(), obj.getClass());
	}

	public synchronized final Object ParamObject(Request req, Object obj) {
		String param = req.queryParams("param");
		System.out.println("before StringUtil.ParamObject - " + param);
		if (null == EmptyStringCheck(param))
			return null;
		JSONObject resultJsonObject = new JSONObject(param);
		JSONObject jsonObject = new JSONObject();
		jsonObject = JsonObjectToUpperCase(resultJsonObject);
		// jsonObject.put("OPER_ID", LoginUtil.getUserId(req));
		param = jsonObject.toString();
		System.out.println("after StringUtil.ParamObject - " + param);
		Gson gson = new Gson();
		return gson.fromJson(param, obj.getClass());
	}

	private JSONObject JsonObjectToUpperCase(JSONObject jsonObj) {
		JSONObject resultJsonObject = new JSONObject();
		for (Object key : jsonObj.keySet()) {
			// based on you key types
			String keyStr = (String) key;
			Object keyvalue = EmptyStringCheck(jsonObj.get(keyStr));

			// Print key and value
			// System.out.println("key: "+ keyStr + " value: " + keyvalue);

			// for nested objects iteration if required
			JSONArray jsonarray = new JSONArray();
			if (keyvalue instanceof JSONObject)
				JsonObjectToUpperCase((JSONObject) keyvalue);

			if (keyvalue instanceof JSONArray) {
				JSONArray array = (JSONArray) keyvalue;
				keyvalue = EmptyStringCheck(JSONArrayToUpperCase(array));
			}

			resultJsonObject.put(keyStr.toUpperCase(), keyvalue);
		}
		return resultJsonObject;
	}

	private Object JSONArrayToUpperCase(Object obj) {
		JSONArray jsonarray = new JSONArray();

		if (obj instanceof JSONArray) {
			JSONArray array = ((JSONArray) obj);
			int arrayLen = array.length();
			for (int i = 0; i < arrayLen; i++) {
				JSONObject object = array.optJSONObject(i);
				JSONObject resultJsonObject = new JSONObject();
				try {
					for (Object key : object.keySet()) {
						String keyStr = (String) key;
						Object keyvalue = object.get(keyStr);
						// System.out.println(key);
						// System.out.println(keyvalue);
						resultJsonObject.put(keyStr.toUpperCase(), keyvalue);
					}
					jsonarray.put(resultJsonObject);
				} catch (Exception e) {
					jsonarray.put(array.get(i));
				}

				// jsonarray.put(resultJsonObject);

				/*
				 * Iterator<String> iterator = object.keys(); while(iterator.hasNext()) { String
				 * currentKey = iterator.next(); //String keyvalue = object.get(currentKey);
				 * resultJsonObject.put(currentKey.toLowerCase(), object.get(currentKey));
				 * jsonarray.put(resultJsonObject); }
				 */
				// jsonarray.put(object);
			}
			// System.out.println(jsonarray.toString());
			return jsonarray;
		} else
			return obj;
	}

	private JSONObject recursiveJsonKeyConverterToLower(JSONObject jsonObject) throws JSONException {
		JSONObject resultJsonObject = new JSONObject();
		@SuppressWarnings("unchecked")
		Iterator<String> keys = jsonObject.keys();
		while (keys.hasNext()) {
			String key = keys.next();

			Object value = null;
			try {
				JSONObject nestedJsonObject = jsonObject.getJSONObject(key);
				value = this.recursiveJsonKeyConverterToLower(nestedJsonObject);
			} catch (JSONException jsonException) {
				value = jsonObject.get(key);
			}

			resultJsonObject.put(key.toLowerCase(), value);
		}

		return resultJsonObject;
	}

	public synchronized void ConvertCsvToObject(BeanListProcessor rowProcessor, String fileName, boolean headExtract) {
		CsvParserSettings parserSettings = new CsvParserSettings();
		// parserSettings.setRowProcessor(rowProcessor);
		parserSettings.setProcessor(rowProcessor);
		// parserSettings.setHeaderExtractionEnabled(true);
		parserSettings.setHeaderExtractionEnabled(headExtract);
		CsvParser parser = new CsvParser(parserSettings);
		parser.parse(new File(fileName));
	}

	public synchronized void ConvertObjectToCsv(String header, Object obj, List<Object> list, String fileName)
			throws Exception {
		CsvConfiguration config = new CsvConfiguration();
		config.setFieldDelimiter(',');
		final File file = new File(fileName);
		file.getParentFile().mkdirs();
		// Serializer serializer =
		// CsvIOFactory.createFactory(config,obj.getClass()).createSerializer();
		// CsvSerializer serializer =
		// (CsvSerializer)CsvIOFactory.createFactory(config,obj.getClass()).createSerializer();
		CsvSerializer serializer = CsvIOFactory.createFactory(config, obj.getClass()).createSerializer();
		// serializer.open(new FileWriter(file));
		// ANSI로 저장한다.
		OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(file), "MS949");
		serializer.open(out);

		serializer.getLowLevelSerializer().writeLine(header); // the header
		// Serializer serializer =
		// CsvIOFactory.createFactory(config,obj.getClass()).createSerializer();
		// serializer.getLowLevelSerializer().writeLine("NAME;BIRTHDATE"); // the header
		int objectSize = list != null ? list.size() : 0;
		for (int i = 0; i < objectSize; i++) {
			Object excelObj = list.get(i);

			serializer.write(excelObj);
		}
		serializer.close(true);
	}

	public final HttpServletResponse DownloadExcelFile(spark.Response res, Path path, String fileName)
			throws Exception {
		byte[] data = null;
		data = Files.readAllBytes(path);
		HttpServletResponse raw = res.raw();
		// res.type("vnd.ms-excel;charset=UTF-8");

		res.header("Content-Type", "application/vnd.ms-excel;charset=UTF-8");
		res.header("Content-Disposition", "attachment; filename=" + fileName);
		res.type("application/force-download");
		raw.getOutputStream().write(data);
		raw.getOutputStream().flush();
		raw.getOutputStream().close();
		return raw;

	}

	public final HttpServletResponse DownloadExcelFile2(spark.Response res, Path path, String fileName)
			throws Exception {
		byte[] data = null;
		data = Files.readAllBytes(path);
		HttpServletResponse raw = res.raw();
		// res.type("vnd.ms-excel;charset=UTF-8");

		res.header("Content-Type", "application/vnd.ms-excel;charset=UTF-8");
		res.header("Content-Disposition", "attachment; filename=" + fileName);
		res.type("application/force-download");

		raw.setCharacterEncoding("Cp1252");
		OutputStream outputStream = raw.getOutputStream();
		outputStream.write(0xEF);
		outputStream.write(0xBB);
		outputStream.write(0xBF);
		raw.getOutputStream().write(data);
		raw.getOutputStream().flush();
		raw.getOutputStream().close();
		return raw;

	}

	public final HttpServletResponse DownloadBinaryFile(spark.Response res, Path path) throws Exception {
		byte[] data = null;
		data = Files.readAllBytes(path);
		HttpServletResponse raw = res.raw();

		res.header("Content-Type", "application/octet-stream");
		// res.header("Content-Disposition", "attachment; filename="+fileName);
		res.type("application/force-download");
		raw.getOutputStream().write(data);
		raw.getOutputStream().flush();
		raw.getOutputStream().close();
		return raw;

	}

	public Date createDate(String date) {
		return DateConverter.create(SimpleTypeConverterConfiguration.EMPTY).fromString(date);
	}

	public final void ModifyLogPrint(String task, Object seq, Object name) {

		logger.info("************************************************************************************");
		logger.info(task + "를 수정하였습니다.");
		logger.info("************************************************************************************");
	}

	/**
	 * 객체가 null 또는 "null"이면 ""으로 만들어 준다.
	 * 
	 * @param obj
	 *            not null로 만들 Object
	 * @return "" 또는 객체의 toString()을 리턴
	 */
	public final String notNull(Object obj) {
		if (null == obj || NULL_STR.equals(obj) || EMPTY_STR.equals(obj))
			return EMPTY_STR;
		else
			return obj.toString();
	}

	public final Object EmptyStringCheck(Object obj) {
		if (null == obj || "".equals(obj))
			return null;
		else
			return obj;
	}

	public String FindMyIP(HttpServletRequest request) {

		String ip = request.getHeader("X-FORWARDED-FOR");
		if (null == ip || 0 == ip.length()) {
			ip = request.getHeader("Proxy-Client-IP");
		}

		if (null == ip || 0 == ip.length()) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	public boolean FileWrite(File file, Part uploadFile) {
		// System.out.println("File Write Call!!!!!!!!");
		OutputStream outStream = null;
		InputStream is = null;
		try {
			outStream = new FileOutputStream(file);
			is = uploadFile.getInputStream();
			byte[] buf = new byte[1024 * 12];
			int len = 0;
			while ((len = is.read(buf)) > 0) {
				outStream.write(buf, 0, len);
			}
			return true;
			// outStream.close();
			// is.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			try {
				outStream.close();
				is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public List<String> FindHashTag(String str) {
		// Pattern hashTagPattern = Pattern.compile("#(\\S+)");
		// Pattern hashTagPattern = Pattern.compile("\\#([0-9a-zA-Z가-힣]*)");
		Pattern hashTagPattern = Pattern.compile("\\#([0-9a-zA-Z가-힣-$%@_?^!&*()-+<>,.;:\\\\]*)");
		Matcher mat = hashTagPattern.matcher(str);
		List<String> listTags = new ArrayList<String>();
		while (mat.find()) {
			// System.out.println(mat.group(1));
			String strTag = mat.group(1);
			if (!listTags.contains(strTag))
				listTags.add(strTag);
		}
		return listTags;
	}

	public void imageSumNail(File image) {
		try {
			BufferedImage bi = ImageIO.read(image);
			// width, height는 원하는 thumbnail 이미지의 크기
			// aspect ratio 유지하기 위해 크기 조정
			int width = 50;
			int height = 50;
			if ((float) width / bi.getWidth() > (float) height / bi.getHeight())
				width = (int) (bi.getWidth() * ((float) height / bi.getHeight()));
			else
				height = (int) (bi.getHeight() * ((float) width / bi.getWidth()));

			BufferedImage thImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D g2 = thImg.createGraphics();
			g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g2.drawImage(bi, 0, 0, width, height, null);
			g2.dispose();
			// thumbnail 이미지를 JPEG 형식으로 저장
			// ImageIO.write(thImg, "jpg", thPath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public String padLeftZeros(String str,int n)
	{
		return String.format("%1$" + n + "s", str).replace(' ', '0');
	}
	

	public static String padRightZeros(String str, int n) {
	    return String.format("%1$-" + n + "s", str).replace(' ', '0');
	}
	
	/*
	 * public String FindMyIP(spark.Request req) { return LoginUtil.getUserIp(req);
	 * }
	 */

}
