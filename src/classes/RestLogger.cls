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
		//Map<String, String> headers=new Map<String, String>();
	    //system.debug('Class name '+className);
	   // Striing url = 'https://sdebugger.herokuapp.com/debug?log=test';
	 	HttpRequest req = new HttpRequest();
	 	//for(Integer i =0 ;i<10;i++){
	 		req.setHeader('_orgId',UserInfo.getOrganizationId().subString(0,UserInfo.getOrganizationId().length()-3));
	 		req.setHeader('orgId',UserInfo.getOrganizationId());
	 		req.setHeader('userName',UserInfo.getUserName());
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