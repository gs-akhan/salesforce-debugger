public with sharing class RestLogger {
	
	public static void loggerRestCall(String logname,String logs){
		
		Http h = new Http();
		Map<String,String> logMap = new Map<String,String>();
		logMap.put('orgId',UserInfo.getOrganizationId());
		logMap.put('logs',logs);
		logMap.put('logName',logname);
		//Map<String, String> headers=new Map<String, String>();
	    
	   // Striing url = 'https://sdebugger.herokuapp.com/debug?log=test';
	 	HttpRequest req = new HttpRequest();
	 	//for(Integer i =0 ;i<10;i++){
	 		req.setHeader('orgId',UserInfo.getOrganizationId());
	  		req.setHeader('Content-Type', 'application/json');
	 		req.setEndpoint('https://sdebugger.herokuapp.com/debug');
			req.setMethod('POST');
			req.setBody(JSON.serialize(logMap));
			//HttpResponse res = HTTPHandler.doPOST(url,headers,JSON.serialize(reqbody));
			HttpResponse res = h.send(req);
	 	//}
		
		system.debug('Rest call sent ');
		
	}
}