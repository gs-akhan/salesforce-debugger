#Streaming Salesforce Debugger
An indispensable tool for speeding up debugging in Salesforce Apex.

### Three simple steps to get started.
1. Add Remote site settings.
2. Add Apex RestLogger class in your environment and trigger events.
3. Subscribe with your Org Username to view logs at [SDebugger](https://sdebugger.herokuapp.com)

#####Step 1 : Add Remote site settings.
SDebugger uses APEX call outs to a [heroku app](https://sdebugger.herokuapp.com) to give you live streaming of logs, so it is necessary you add this URL https://sdebugger.herokuapp.com as remote site.

#####Step 2 : Add Apex RestLogger Class to your Org.
```

public with sharing class RestLogger {

    private static String userName = UserInfo.getUserName();
    private static Map<String,String> logMap = new Map<String,String>();
    private static Http h = new Http();
    private static HttpRequest req = new HttpRequest();

    public static void debug(String logname,String logs){
       logMap.put('logs',logs);
       logMap.put('logName',logname);
       req.setHeader('userName',userName);
       req.setHeader('Content-Type', 'application/json');
       req.setEndpoint('https://sdebugger.herokuapp.com/debug');
       req.setMethod('POST');
       req.setBody(JSON.serialize(logMap));
       HttpResponse res = h.send(req);
    }   
}
```
#####Step 2.1 : Trigger events 

Instead of using ```System.debug("logName", JSON.serialize(identifier));```, you can use ```RestLogger.debug('logName',JSON.serialize(identifier));```

This will stream logs directly to [heroku app](https://sdebugger.herokuapp.com). Make sure you subscribe with SFDC Org Username to view logs.

 
###License
Copyright (c) 2015, gs-akhan,gs-skumar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
