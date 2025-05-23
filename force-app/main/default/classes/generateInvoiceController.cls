public with sharing class generateInvoiceController {
    
    public String companyLogo {get;set;}
    public InvoiceClass invoice {get;set;}

    public generateInvoiceController() {
        try{
            String invoice_id = ApexPages.currentPage().getParameters().get('id');

            this.invoice = new InvoiceClass();
            this.invoice.company_logo = 'https://vusr-dev-ed--c.develop.vf.force.com/resource/1700436470000/CompanyLogo';
            
            List<Invoice__c> invoice = [SELECT Id, Name, Amount__c, Broker__c, Buyer__r.Name, Buyer__r.MailingAddress, Full_Payment__c, Listing__r.Name, Invoice_Date__c, Opportunity__c FROM Invoice__c WHERE Id =: invoice_id];
            List<Listings__c> unit = [SELECT Id, Name, Property__r.Name, Property__r.Country__r.Name, Property__r.City__r.Name, Property__r.State__r.Name, Property__r.Street__c, 
                                        Country__r.Name, City__r.Name, State__r.Name, Description__c, Lot__c, Listing_Price__c,
                                        Type_of_unit__c, No_of_Bathrooms__c, No_of_Bedrooms__c, Street_Name__c, Year_built__c, Square_footage__c 
                                        FROM Listings__c WHERE Id =: invoice.get(0).Listing__c];

            
            this.invoice.invoice_number = invoice.get(0).Name;
            this.invoice.buyer_name = invoice.get(0).Buyer__r.Name;
            this.invoice.invoice_date = invoice.get(0).Invoice_Date__c;
            this.invoice.acquired_unit = invoice.get(0).Listing__r.Name;
            this.invoice.street = unit.get(0).Street_Name__c;
            
            this.invoice.unit_price = unit.get(0).Listing_Price__c;
            this.invoice.amount = invoice.get(0).Amount__c;

            this.invoice.unit_name = unit.get(0).Name;
            this.invoice.type_of_unit = unit.get(0).Type_of_unit__c;
            this.invoice.square_foot = unit.get(0).Square_footage__c;
            this.invoice.no_of_bedrooms = unit.get(0).No_of_Bedrooms__c;
            this.invoice.no_of_bathrooms = unit.get(0).No_of_Bathrooms__c;
            this.invoice.year_built = unit.get(0).Year_built__c;

            this.invoice.description = unit.get(0).Name + ' ' + unit.get(0).Type_of_unit__c + ' ' + unit.get(0).Square_footage__c + ' ' + String.valueOf(unit.get(0).No_of_Bedrooms__c);
                
            

            // this.invoice.description = 

            this.invoice.property_name = unit.get(0).Property__r.Name;
            this.invoice.property_country = unit.get(0).Property__r.Country__r.Name;
            this.invoice.property_city = unit.get(0).Property__r.City__r.Name;
            this.invoice.property_state = unit.get(0).Property__r.State__r.Name;
            this.invoice.property_street = unit.get(0).Property__r.Street__c;

            System.Address c = invoice.get(0).Buyer__r.MailingAddress;

            this.invoice.street = c.street;
            this.invoice.city = c.city;
            this.invoice.state = c.state;
            this.invoice.postal_code = c.postalcode;
            this.invoice.country = c.country;
            
            System.debug('*** country *** ' + c.country);

            System.debug('*** invoice *** ' + this.invoice);

        }catch(Exception e){
            System.debug('*** PRINT INVOICE: *** ' + e.getMessage());
        }
    }

    public class InvoiceClass{
        public String buyer_name {get;set;}
        public String broker_name {get;set;}
        public Decimal amount {get;set;}
        public Decimal unit_price {get;set;}
        public Date invoice_date {get;set;}
        public String invoice_number {get;set;} 
        public String fully_paid {get;set;} 
        public String acquired_unit {get;set;} 
        public String company_logo {get;set;}
        public String country {get;set;}
        public String state {get;set;}
        public String city {get;set;}
        public String street {get;set;}
        public String postal_code {get;set;}
        public String property_name {get;set;}
        public String property_city {get;set;}
        public String property_state {get;set;}
        public String property_country {get;set;}
        public String property_street {get;set;}

        public String type_of_unit {get;set;}
        public String square_foot {get;set;}
        public Decimal no_of_bedrooms {get;set;}
        public Decimal no_of_bathrooms {get;set;}
        public String year_built {get;set;}
        public String unit_name {get;set;}
        
        public String description {get;set;}

        public InvoiceClass(){
            this.buyer_name = '';
            this.broker_name = '';
            this.amount = 0.00;
            this.invoice_number = '';
        }
    }


}