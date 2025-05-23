global without sharing class AgentRequestScreenFlow_Apxcls {
    @InvocableMethod
   public static List<String> getDetails(List<data> dt) {
       
      publicevent__e eve = new publicevent__e();
      eve.Message__c = JSON.serialize(dt[0]);
      eve.Type__c = 'Agent';
      List<Database.SaveResult> results = EventBus.publish(new List<publicevent__e> {eve});
      //AgentRequestScreenFlow_Apxcls.createDetails( JSON.serialize(dt[0]) );
      return new List<String>{'success'};
   }
   
    public static void createDetails( String jsn){
        data dt = (data)JSON.deserialize(jsn,data.class);
		System.debug('contactId'+dt.contactId);
        dt.recordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Buyer').getRecordTypeId();
        Contact cn = new Contact(  Salutation =dt.salutation, FirstName =dt.firstName, LastName =dt.lastName, Phone =dt.phn, Email =dt.email, recordTypeId = dt.recordTypeId  );
        if( !String.isEmpty(dt.contactId) && dt.contactId !='blank' ){
            cn.Id = dt.contactId;
        } 
        cn.AccountId='0015j00001SFbHnAAL';
        //cn.OwnerId = dt.userid;
        upsert cn;
        
        Task tsk = new Task();
        tsk.Subject = 'Customer Request Query on '+dt.propertyName;
        tsk.Description = dt.description;
        tsk.ActivityDate = system.today()+7;
        tsk.WhoId = cn.Id;
        tsk.OwnerId = dt.userid;
        insert tsk;
    }
    
    

    public class data{
        @InvocableVariable public String contactId;
        @InvocableVariable public String userid;
        @InvocableVariable public String salutation;
		@InvocableVariable public String firstName;
        @InvocableVariable public String lastName;
        @InvocableVariable public String phn;
		@InvocableVariable public String email;
        @InvocableVariable public String propertyName;
        @InvocableVariable public String description;
        @InvocableVariable public String recordTypeId;
    }
}