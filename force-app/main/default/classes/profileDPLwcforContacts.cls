public class profileDPLwcforContacts {
    @AuraEnabled( Cacheable=true )
    public static detailsCon getFilesData(String recordId){
        List<ContentDocumentLink> cdl = [Select Id , ContentDocumentId from ContentDocumentLink where LinkedEntityId=: recordId ];
        List<String> str = new List<String>();
        for( ContentDocumentLink co : cdl ){
            str.add(co.ContentDocumentId);
        }
        
        List<ContentVersion> cvLst = new List<ContentVersion>();
        if(str.Size()>0){
            cvLst = [Select Id,versionData,ContentDocumentId,Title,FileType,VersionNumber,CreatedDate,FileExtension from ContentVersion where ContentDocumentId in :str AND profileDp__c=true Order By CreatedDate,VersionNumber DESC limit 1];
        }
        
        detailsCon dc = new detailsCon();
        if( String.ValueOf(recordId).startsWithIgnoreCase('003') == true){
            Contact cn = [Select Id,Name,Phone,Title,RecordType.Name,Birthdate,Account.Name,Email from Contact where Id=:recordId];
            dc.fullNm=cn.Name;
            dc.phone=cn.Phone;
            dc.email = cn.Email;
            dc.Accname = cn.Account.Name;
            //dc.title=cn.Title;
            dc.recordtype=cn.RecordType.Name;
            dc.birthdate=cn.Birthdate;
            
            
        }
        
        dc.orgUrl= URL.getOrgDomainURL().toExternalForm();
        //dc.nationality= cn.Nationality__c;
        System.debug('Size=='+cvLst.Size());
        if( cvLst.Size() > 0 ){
            dc.contentDoc = cvLst[0].ContentDocumentId;
        }else{
            dc.contentDoc='blank';
        }
        
        return dc;
        
    }
    @AuraEnabled
    public static string createFile(String existingDocId,String recordId, String fileWrp1){
        System.debug('existingDocId'+existingDocId);
        System.debug('recordId'+recordId);
        System.debug('fileWrp1'+fileWrp1);
        if(existingDocId !='blank'){
            Database.Delete([select id from ContentDocument where Id =:existingDocId]);
        }
        
        fileWrp fil1 = (fileWrp)System.JSON.deserialize(fileWrp1, fileWrp.class);
        ContentVersion cv = new ContentVersion();
        cv.Title = fil1.isfileName;
        cv.PathOnClient = fil1.isfileName;
        cv.VersionData = fil1.isBase64;
        cv.IsMajorVersion = true;
        cv.profileDp__c = true;
        insert cv;
        
        //Get Content Documents
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
        
        //Create ContentDocumentLink 
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = recordId;
        cdl.ContentDocumentId = conDocId;
        cdl.shareType = 'V';
        Insert cdl;        
        return conDocId;
        
    }
    
    public class fileWrp{
        public string isfileName;
        public blob isBase64;
    }
    public class detailsCon{
        @AuraEnabled  public string fullNm;
        @AuraEnabled  public String phone;
        @AuraEnabled public String email;
        @AuraEnabled public String Accname;
        @AuraEnabled public String recordtype;
        @AuraEnabled public Date birthdate;
        @AuraEnabled public String contentDoc;
        @AuraEnabled public String orgUrl;
    }
    
}