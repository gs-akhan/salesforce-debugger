public with sharing class RestLogger {
	
	public static void debug(String logname,String logs){
		
		Http h = new Http();
		Map<String,String> logMap = new Map<String,String>();
		logMap.put('orgId',UserInfo.getOrganizationId());
		logMap.put('logs',logs);
		logMap.put('logName',logname);
		
		HttpRequest req = new HttpRequest();

		req.setHeader('_orgId',UserInfo.getOrganizationId().subString(0,UserInfo.getOrganizationId().length()-3));
		req.setHeader('orgId',UserInfo.getOrganizationId());
		req.setHeader('userName',UserInfo.getUserName());
		req.setHeader('Content-Type', 'application/json');
		req.setEndpoint('https://sdebugger.herokuapp.com/debug');
		req.setMethod('POST');
		req.setBody(JSON.serialize(logMap));
			
		HttpResponse res = h.send(req);

	}
}