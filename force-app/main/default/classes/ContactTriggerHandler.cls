Public without sharing class ContactTriggerHandler{
    
    public static void assignSalesAgent(List<Contact>conList){
        
	List<User> listOfUserId = [Select Id FROM User WHERE Profile.Name='Agent' AND IsActive = True]; 
        
        for (contact con: conList){
            con.Sales_Agent__c = listOfUserId[0].Id;
        }
    }
}