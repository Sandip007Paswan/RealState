public class ComputeMorgage {
    
    @InvocableMethod(label='Generate Mortgage Schedule' description='Generate Mortgage Schedule via Apex Action')
    public static List<Integer> runScheduler(List<InputVariables> inputVariables) {
        List<Integer> result = new List<Integer>(); 
        List<Payment_Schedule__c> payment_schedule = generatePaymentSchedule(inputVariables);

        if (!payment_schedule.isEmpty()){
            result.add(1);
        }
        return result;
    }

    private static List<Payment_Schedule__c> generatePaymentSchedule(List<InputVariables> inputVariables){

        // COMPUTE THE MONTHLY MORGAGE
        Decimal monthly_mortgage = computeMonthlyMortgage(inputVariables);

        // INITIALIZE THE COLLECTION OBJECT
        List<Payment_Schedule__c> batch_schedule = new List<Payment_Schedule__c>();  

        // GET THE PAYMENT START DATE FROM THE SCREENFLOW
        Date start_of_payment = inputVariables.get(0).paymentStartDate;
        Decimal outstanding_balance = (inputVariables.get(0).principal-monthly_mortgage);
        
        // PREPARING THE PAYMENT SCHEDULE RECORD
        Payment_Schedule__c details = new Payment_Schedule__c();
        details.Payment_Schedule_Date__c = start_of_payment;
        details.Amortization__c = monthly_mortgage;
        details.Payment_Frequency__c = inputVariables.get(0).paymentFrequency;
        details.Principal__c = inputVariables.get(0).principal;
        details.Deal__c =  inputVariables.get(0).deal_id; 
        details.Interest_Rate__c = inputVariables.get(0).rate;
        details.Total_Outstanding_Balance__c = outstanding_balance;
        details.Downpayment__c = inputVariables.get(0).downpayment;

        batch_schedule.add(details);

        System.debug('*** first payment date **** '+  start_of_payment);

        Integer total_terms_in_month = getTermsByFrequency(inputVariables.get(0).term, inputVariables.get(0).paymentFrequency);
        Date next_schedule_date = start_of_payment;

        for (Integer i=1; i<total_terms_in_month; i++){            
            next_schedule_date = getNextDate(next_schedule_date, inputVariables.get(0).paymentFrequency);
            System.debug('*** next payment date **** '+  next_schedule_date);

            outstanding_balance = (outstanding_balance-monthly_mortgage);

            details = new Payment_Schedule__c();
            details.Payment_Schedule_Date__c = next_schedule_date;
            details.Payment_Frequency__c = inputVariables.get(0).paymentFrequency;
            details.Amortization__c = monthly_mortgage;
            details.Total_Outstanding_Balance__c = outstanding_balance;
            details.Principal__c = inputVariables.get(0).principal;
            details.Interest_Rate__c = inputVariables.get(0).rate;
            details.Deal__c =  inputVariables.get(0).deal_id; 
            details.Downpayment__c = inputVariables.get(0).downpayment;
            batch_schedule.add(details);
        }

        if (!batch_schedule.isEmpty()){
            System.debug('*** batch_schedule **** '+  batch_schedule);
            insert batch_schedule;
        }

        return batch_schedule;
    }

    private static Integer getTermsByFrequency(Integer terms_in_year, String frequency){
        if (frequency.equals('Monthly')){
            return (terms_in_year * 12);
        }else if (frequency.equals('Semi-Monthly')){
            return ((terms_in_year * 12) * 2);
        }else if (frequency.equals('Annual')){
            return (terms_in_year * 2);
        }
        return 0;
    }

    private static Date getNextDate(Date currentDate, String frequency){
        Date next_date = Date.today();
        if (frequency.equals('Monthly')){
            next_date = currentDate.addMonths(1);
        }else if (frequency.equals('Semi-Monthly')){
            
            Integer daysInMonth = Date.daysInMonth(currentDate.year(), currentDate.month());

            System.debug('*** currentDate **** '+  currentDate);
            System.debug('*** daysInMonth **** '+  daysInMonth);

            next_date = currentDate.addDays(15);

        }else if (frequency.equals('Annual')){
            next_date = currentDate.addYears(1);
        }
        return next_date;
    }


    private static Decimal computeMonthlyMortgage(List<InputVariables> inputVariables){
        Decimal total_loan = (inputVariables.get(0).principal-inputVariables.get(0).downpayment);
        Integer months_in_a_year = 12;
        Integer total_terms_in_month = inputVariables.get(0).term * months_in_a_year;
        Decimal rate_percentage = inputVariables.get(0).rate/100;        
        Decimal interest = (rate_percentage/12);  
        Decimal base = interest+1;

        Decimal pow = 1 / base.pow(total_terms_in_month); 
        pow = 1 - pow;

        Decimal divisor = (pow/interest);
        Decimal mortgage = (inputVariables.get(0).principal/divisor);
        Decimal rounded = mortgage.setScale(2, RoundingMode.HALF_UP);
        return rounded;
    }
    
    public class InputVariables{
        @InvocableVariable
        public Decimal principal;

        @InvocableVariable
        public Decimal downpayment;

        @InvocableVariable
        public Decimal rate;

        @InvocableVariable
        public Integer term;

        @InvocableVariable
        public Date paymentStartDate;

        @InvocableVariable
        public String paymentFrequency;

        @InvocableVariable
        public String deal_id;

    }


    public class ReturnVariables{
        @InvocableVariable
        public Boolean success;

    }


}