public class appiontmentDetailslwc_Apxcls {
	@AuraEnabled(cacheable=true)
    public static Listings__c getRelatedDocs(Id recordId){
        Listings__c lst = [Select Id,Description__c,Property__r.Name,( Select Id,Property_Image_URL__c,Name from Property_Images__r ) from Listings__c Where Id =: recordId];
        return lst;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Object> getlookupdetails(String objectname , String searchkey,Boolean filtering, String filteringfield,String parentid){
        String queryString = 'SELECT Id, Name from '+objectname;
        if( !String.isEmpty( searchkey ) ){
             String queryName = searchkey + '%%';
            queryString += ' Where Name like :queryName';
            if( filtering == true ){
                if( !String.isEmpty( parentid ) && parentid !='blank'){
                    queryString += ' AND '+filteringfield+' =:parentid';
                }
                
            }
            System.debug(queryString);
            return Database.query(queryString);
        }else{
            return new List<object>();
        }
        
        
    }
    
    
}