public class PricingActive {
    public static void updatepricingrecord(){
        //List<Pricing__c> priceToUpdate = new List<Pricing__c>();
        // Get all pricing records records.
        list<Pricing__c> pricings = [SELECT Id, Active__c FROM Pricing__c WHERE Active__c = false];
        for (Pricing__c record : pricings) {
        	record.Active__c= true;
            
        }
        update pricings;
           
        
    }

}