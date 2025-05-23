global without sharing class AppointmentBookingScreenFlow_Apxcls {
   @InvocableMethod
   public static List<String> getDetails(List<data> dt) {
       
      publicevent__e eve = new publicevent__e();
      eve.Message__c = JSON.serialize(dt[0]);
      eve.Type__c = 'Appointment';
      List<Database.SaveResult> results = EventBus.publish(new List<publicevent__e> {eve});
      //AppointmentBookingScreenFlow_Apxcls.createDetails( JSON.serialize(dt[0]) );
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
        if( !String.isEmpty(dt.cityId) && dt.cityId !='blank'  ){
            cn.City__c = dt.cityId;
        } 
        if( !String.isEmpty(dt.stateId) && dt.stateId !='blank' ){
            cn.State__c = dt.stateId;
        } 
        if( !String.isEmpty(dt.countryId) && dt.countryId !='blank'){
            cn.Country__c = dt.countryId;
        } 
        cn.AccountId='0015j00001SFbHnAAL';
        upsert cn;

        Reservation__c res = new Reservation__c();
        res.Buyer__c = cn.Id;
        if( !String.isEmpty(dt.cityId) && dt.cityId !='blank'  ){
            res.City__c = dt.cityId;
        }
        if( !String.isEmpty(dt.stateId) && dt.stateId !='blank' ){
            res.State__c = dt.stateId;
        }
        
        if( !String.isEmpty(dt.countryId) && dt.countryId !='blank'){
            res.Country__c = dt.countryId;
        }
        
        res.Reservation_Date__c = dt.DatTime;
        res.Listing__c = dt.listingid;
        res.Property__c = dt.propertyId;
        insert res;
        
        Map<String,String> eml_Names = new Map<String,String>();
        
        List<OrgWideEmailAddress> owa = [select id, Address, DisplayName from OrgWideEmailAddress where DisplayName ='Valuehub' limit 1];
        
        
        Messaging.SingleEmailMessage msg = new Messaging.SingleEmailMessage();
        System.debug('sndEmail'+dt.sndEmail);
        System.debug('email'+dt.email);
        if(owa.Size()>0){
            msg.setOrgWideEmailAddressId(owa[0].id);
        }
        if( !String.isEmpty( dt.sndEmail ) ){
            msg.setToAddresses(new List<String>{dt.sndEmail});
            eml_Names.put(dt.sndEmail,dt.lastName +' '+dt.firstName);
        }else{
            msg.setToAddresses(new List<String>{dt.email});
            eml_Names.put(dt.email,dt.lastName +' '+dt.firstName);
        }
        msg.setSubject('Schedule Meeting with Valuehub Team');
        msg.setPlainTextBody('New Meeting is Scheduled');
        Messaging.EmailFileAttachment efa1 = new Messaging.EmailFileAttachment();
        efa1.setFileName('Salesforce-Meeting1.ics');
        Blob b1 = calenderinvite_ApxCls.doIcsAttachment( String.valueOf( cn.Id ), dt.DatTime, dt.DatTime.addHours(1), 'salesforce', 'New Meeting is Scheduled', 'Schedule Meeting with Valuehub Team', eml_Names, 1);
        efa1.setBody(b1);
        efa1.setContentType('text/calendar');
        msg.setFileAttachments(new Messaging.EmailFileAttachment[] {efa1});
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{msg});
    }
    
   public class data{
        @InvocableVariable public String contactId;
        @InvocableVariable public String listingid;
        @InvocableVariable public String countryId;
		@InvocableVariable public String stateId;
        @InvocableVariable public String cityId;
        @InvocableVariable public String salutation;
		@InvocableVariable public String firstName;
        @InvocableVariable public String lastName;
        @InvocableVariable public String phn;
		@InvocableVariable public String email;
        @InvocableVariable public DateTime DatTime;
        @InvocableVariable public String sndEmail;
        @InvocableVariable public String propertyId;
        @InvocableVariable public String recordTypeId;
    }

}