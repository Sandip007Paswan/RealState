public with sharing class ContractController {

    public String companyLogo {get;set;}
    public ContractWrapperClass cwc {get;set;}

    public ContractController() {
        try{
            String contract_id = ApexPages.currentPage().getParameters().get('id');

            cwc = new ContractWrapperClass();

            List<Contract__c> contract = [SELECT Id, Listing__r.Name, Deals__c, Buyer__r.Name, Buyer__r.MailingAddress, Listing__r.Property__r.Name,
                                          Buyer__r.City__r.Name, Buyer__r.Country__r.Name, Buyer__r.State__r.Name, Buyer__r.Street__c,
                                          Listing__r.Property__r.Street__c, Listing__r.Property__r.City__r.Name, 
                                          Listing__r.Property__r.State__r.Name, Listing__r.Property__r.Country__r.Name,
                                          Listing__r.Property__r.Seller__r.Name, Listing__r.No_of_Bedrooms__c, Listing__r.No_of_Bathrooms__c,
                                          Listing__r.Square_footage__c
                                          FROM Contract__c WHERE Id =: contract_id];
            
            if (!contract.isEmpty()){
                cwc.company_logo = 'https://vusr-dev-ed--c.develop.vf.force.com/resource/1700436470000/CompanyLogo';             
                cwc.buyer_address = contract.get(0).Buyer__r.Street__c + ' ' + contract.get(0).Buyer__r.City__r.Name + ' ' + contract.get(0).Buyer__r.State__r.Name + ' ' + contract.get(0).Buyer__r.Country__r.Name;
                cwc.buyer_name = contract.get(0).Buyer__r.Name;
                cwc.buyer_state = contract.get(0).Buyer__r.State__r.Name;
                cwc.property_name = contract.get(0).Listing__r.Property__r.Name;
                cwc.property_address = contract.get(0).Listing__r.Property__r.Street__c + ' ' + contract.get(0).Listing__r.Property__r.City__r.Name + ' ' + contract.get(0).Listing__r.Property__r.State__r.Name + ' ' + contract.get(0).Listing__r.Property__r.Country__r.Name;
                cwc.property_state = contract.get(0).Listing__r.Property__r.State__r.Name;
                cwc.property_city = contract.get(0).Listing__r.Property__r.City__r.Name;

                cwc.unit_name = contract.get(0).Listing__r.Name;
                cwc.unit_description = contract.get(0).Listing__r.Name + ' | ' + contract.get(0).Listing__r.No_of_Bedrooms__c + ' bd | ' + contract.get(0).Listing__r.No_of_Bathrooms__c + ' ba | ' + contract.get(0).Listing__r.Square_footage__c + ' Sqft';

                cwc.seller_name = contract.get(0).Listing__r.Property__r.Seller__r.Name;

            }

            System.debug('*** wrapper *** ' + cwc);

            this.companyLogo = 'https://vusr-dev-ed--c.develop.vf.force.com/resource/1700436470000/CompanyLogo';
        
        }catch(Exception e){
            System.debug('*** Exception ContractController *** ' + e.getMessage());
        }
    }

    private class ContractWrapperClass{
        public String company_logo {get;set;}
        public String property_name {get;set;}
        public String property_address {get;set;}
        public String property_state {get;set;}
        public String property_city {get;set;}
    
        public String unit_name {get;set;}
        public String unit_description {get;set;}

        public String seller_name {get;set;}

        public String buyer_name {get;set;}
        public String buyer_address {get;set;}
        public String buyer_street {get;set;}
        public String buyer_city {get;set;}
        public String buyer_state {get;set;}
        public String buyer_country {get;set;}
    }

}