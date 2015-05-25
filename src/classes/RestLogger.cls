public with sharing class RestLogger {
	
	private String className = '';
		
	public RestLogger(Object srcObject){
		className = String.valueOf(srcObject).substring(0,String.valueOf(srcObject).indexOf(':'));
	}

	public  void debug(String logname,String logs){
		
		Http h = new Http(); 
		Map<String,String> logMap = new Map<String,String>();
		logMap.put('orgId',UserInfo.getOrganizationId());
		logMap.put('logs',logs);
		logMap.put('logName',className);
	 	HttpRequest req = new HttpRequest();
	 	req.setHeader('userName',UserInfo.getUserName());
	  	req.setHeader('Content-Type', 'application/json');
	 	req.setEndpoint('https://sdebugger.herokuapp.com/debug');
		req.setMethod('POST');
		req.setBody(JSON.serialize(logMap));
		HttpResponse res = h.send(req);
		
		
	}	
}

new RestLOgger.debug()