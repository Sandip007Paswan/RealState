global class BatchInvoiceGenarator implements Database.Batchable<sObject>,schedulable{
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // collect the batches of records or objects to be passed to execute
        
        String query = 'SELECT Id, Deal__c,  Deal__r.Buyer__c, Deal__r.Listing__c, Amortization__c FROM Payment_Schedule__c WHERE Invoice__c = NULL';
        System.debug('*** query *** ' + query);

        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, List<Payment_Schedule__c> paymentScheduleList) {
        try {
            System.debug('*** paymentScheduleList *** ' + paymentScheduleList);

            // Generate the invoice per payment schedule
            List<Invoice__c> batchInvoices = new List<Invoice__c>();         
            List<Payment_Schedule__c> batchSchedule = new List<Payment_Schedule__c>();               

            // process each batch of records default size is 200
            for(Payment_Schedule__c ps :  paymentScheduleList) {        
                Invoice__c invoice = new Invoice__c();
                invoice.Opportunity__c = ps.Deal__c;
                invoice.Buyer__c = ps.Deal__r.Buyer__c;
                invoice.Listing__c = ps.Deal__r.Listing__c;
                invoice.Amount__c = ps.Amortization__c;
                invoice.Payment_Schedule__c = ps.Id;
                invoice.Invoice_Date__c = System.today();
                batchInvoices.add(invoice);
            }            

            // insert invoices
            if(!batchInvoices.isEmpty()){
                insert batchInvoices;
            }  
            
            // loop into invoices to update the payment schedules
            System.debug('*** batchInvoices *** ' + batchInvoices);
            if (!batchInvoices.isEmpty()){
                for (Invoice__c i: batchInvoices){
                    Payment_Schedule__c ps = new Payment_Schedule__c();
                    ps.id = i.Payment_Schedule__c;
                    ps.Invoice__c = i.Id;
                    batchSchedule.add(ps);
                }

                if (!batchSchedule.isEmpty()){
                    update batchSchedule;
                }
            }
        } catch(Exception e) {
            // put email notification here in case of error
            System.debug(e.getMessage());
        } 
    }   
     
    global void finish(Database.BatchableContext BC) {
        list<string> eml = new list<string>();
        // execute any post-processing operations like sending email
        list<user> UserList = [Select id,email from user where Profile.Name = 'System Administrator'];
        for(user us: UserList){
            if(us.email != null){
                // eml.add(us.email);
            }
        }
        String email = 'rd@valuehubit.com';
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

        mail.setToAddresses(new String[] {email});
       
        mail.setSenderDisplayName('Batch Processing');
        mail.setSubject('Batch Process has Completed');
        mail.setPlainTextBody('Batch Processing for Create Invoce has been Completed');
        
        //mail.setToAddresses(new List<string>(eml));
        

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });

    }
    
     public  void execute(Schedulablecontext sc){
        BatchInvoiceGenarator  cr=new BatchInvoiceGenarator();
        Database.executeBatch(cr, 40);
    }
    


}