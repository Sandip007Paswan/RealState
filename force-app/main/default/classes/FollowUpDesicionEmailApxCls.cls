/* Name:FollowUpDesicionEmailApxCls
* Description:This class is used for the to run the chat gpt component in the leads and contacts and opportunities and spaces/Units.
* Created Date: 31/10/2023
* Created By: Valuehub
*/
public class FollowUpDesicionEmailApxCls {
    @auraEnabled(cacheable=true)
    public static wrap getDetails(String recordId){
        wrap wrp = new wrap();
        wrp.userName = userinfo.getLastName();
        if(recordId.startsWithIgnoreCase('00Q') == true ){
            Lead ld = [Select Id,Name from Lead Where Id=: recordId];  
            wrp.contactName= ld.Name;
            //wrp.nextStep = ld.NextStep__c;
        }
        
        if(recordId.startsWithIgnoreCase('003') == true ){
            Contact cn = [Select Id,Name from Contact Where Id=: recordId];  
            wrp.contactName= cn.Name;
            //wrp.nextStep = cn.NextStep__c;
        }
        
        if(recordId.startsWithIgnoreCase('006') == true ){
            Opportunity opp = [Select Id,Name from Opportunity Where Id=: recordId];  
            wrp.contactName= opp.Name;
        }
  
        return wrp;
    }
    
    @auraEnabled
    public static String apiRequest(String subject,String currentUserName, String contactName){
        String message=null;
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:OpenAI_API_NC/chat/completions');
        req.setMethod('POST');
        req.setTimeout(1000*120);
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setBody('{ "model": "gpt-4-0613", "messages": [{"role": "system", "content": "Generate Follow-up Email with subject from '+currentUserName+' to '+contactName+' '+subject+'."}] }');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        if(res.getStatusCode() == 200 ){
            //System.debug('message'+res.getBody());
            Map<String,Object> data =(Map<String,Object>)JSON.deserializeUntyped(res.getBody());
            List<Object> data1 =(list<Object>) data.get('choices');
            for( Object obj : data1){
                Map<String,Object> obj1 = (Map<String,Object>)obj;
                // System.debug('message'+obj1);
                Map<String,Object> obj2 = (Map<String,Object>)obj1.get('message');
                // System.debug('message'+obj2);
                message = (String)obj2.get('content');
                //System.debug('message'+message);
            }
        }else{
            message = 'Failed please contact System Admin';
            System.debug('failed class');
        }
        return message;
    }
    
    public class wrap{
        @auraEnabled public string userName;
        @auraEnabled public string nextStep;
        @auraEnabled public string contactName;
    }
}