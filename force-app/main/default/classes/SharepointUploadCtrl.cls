Public Class SharepointUploadCtrl {
    
    public static boolean check = false;

    @AuraEnabled(cacheable=true)
    Public Static List<ContentDocument> getRelatedDocs(Id recordId){
        List<ContentDocument> cdList = new List<ContentDocument>();
        List<ContentDocumentLink> cdlList = [SELECT ContentDocumentId FROM ContentDocumentLink
                                             WHERE LinkedEntityId = :recordId];
        Set<Id> cdIds = new Set<Id>();
        for (ContentDocumentLink cdl : cdlList) {
            cdIds.add(cdl.ContentDocumentId); 
        }        
        cdList = [SELECT Id, Title, FileType, OwnerId, Owner.Name, CreatedDate,
                  CreatedById, CreatedBy.Name, ContentSize
                  FROM ContentDocument WHERE Id IN :cdIds];
        return cdList;
    }
     
    @AuraEnabled(cacheable=true)
    Public Static string getDocURL(Id docId){
        ContentVersion cv = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :docId AND IsLatest = true];
        String cvDownloadURL = URL.getOrgDomainUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + cv.Id;
        return cvDownloadURL;
    }
    
    @AuraEnabled
    Public Static void deleteDoc(Id docId){
        delete [SELECT Id from ContentAsset where contentDocumentId =: docId];
        ContentDocument conDoc = new ContentDocument(Id = docId);
        delete conDoc;
    }
    
    @AuraEnabled(cacheable=true)
    public Static List<SharePoint_Schema__c> getAllFolderDetails(){
        List<SharePoint_Schema__c> ss_Lst = [Select Id,Name,Query__c,Parent_Object_Name_Field_Api__c,Parent__c,Is_It_Parent__c,Field_Name__c,Sequence__c,Object_Name__c,Child_Object_Names__c from SharePoint_Schema__c  Order By CreatedDate ASC];
        return ss_Lst; 
    }
    
    @AuraEnabled
    public Static void createFolderDetails( SharePoint_Schema__c rec){
        system.debug('==>'+rec);
        upsert rec;
    }
    
    @AuraEnabled
    public Static void deleteFolderDetails( String recId){
        SharePoint_Schema__c rec = new SharePoint_Schema__c(Id=recId);
        delete rec;
    }
    
    
    @AuraEnabled
    Public Static List<folderNames> getFolderName( Id recordId ){
        try{
            
            List<folderNames> fld_Lst = new List<folderNames>();
            String folderName;
            String objectName = String.valueOf(recordId.getSobjectType());
            List<SharePoint_Schema__c> ss_Lst = [Select Id,Query__c,Parent_Object_Name_Field_Api__c,Parent__c,Is_It_Parent__c,Field_Name__c,Sequence__c,Object_Name__c from SharePoint_Schema__c where Child_Object_Names__c like: '%'+objectName+'%' OR Object_Name__c=:objectName Order By Sequence__c DESC];
            
            for( SharePoint_Schema__c ss : ss_Lst ){
                folderNames fld_Rec = new folderNames();
                String query = ss.Query__c;
                Sobject obj = Database.query(query);
                Map<String,Object> rec = obj.getPopulatedFieldsAsMap();
                if(ss.Sequence__c != 1 && ss.Is_It_Parent__c == false ){
                	fld_Rec.fileName = (String)rec.get(ss.Field_Name__c);
                    fld_Rec.objectName = (ss.Object_Name__c).replace('__c','');
                    fld_Rec.isParent = false;
                }else{
                    if( ss.Sequence__c == 1 && ss.Parent_Object_Name_Field_Api__c == null && ss.Parent__c == null ){
                        fld_Rec.fileName = (String)rec.get(ss.Field_Name__c);
                        fld_Rec.objectName = (ss.Object_Name__c).replace('__c','');
                        fld_Rec.isParent = true;
                    }else{
                        fld_Rec.fileName = (String)rec.get(ss.Field_Name__c);
                        fld_Rec.objectName = (ss.Object_Name__c).replace('__c','');
                        fld_Rec.isParent = true;
                   }
                }
                fld_Rec.fileName = (fld_Rec.fileName).replaceAll(' ','');
                fld_Rec.objectName = (fld_Rec.objectName).replaceAll('_','');
                fld_Lst.add(fld_Rec);
                if( ss.Parent__c != null ){
                    recordId = String.valueOf(rec.get(ss.Parent_Object_Name_Field_Api__c));
                }
                
            }
            
            If( SharepointUploadCtrl.check == false){
                apiresponse resp = getSharePointAccessToken();
        		Integer fld_Size = fld_Lst.Size()-1;
        		String folderUrl = '';
                while (fld_Size >= 0 ) {
                    //if res is 0 then folder is not created in sharepoint
                    //if res is 1 then folder is already exist in sharepoint
                    String current_FldNm = fld_Lst[fld_Size].fileName+'_'+fld_Lst[fld_Size].objectName;
                    //Integer res = checkSharePointFolder( current_FldNm,accessToken );
                    // if( res == 0 ){
                    createSharePointFolder( folderUrl,current_FldNm,resp.response );
                    //}
                    folderUrl = folderUrl+'/'+current_FldNm;
                    fld_Size--;            
                }
                SharepointUploadCtrl.check = true;
            }
            
            
                      
            return fld_Lst;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
        
    @AuraEnabled(cacheable=true)
    Public Static contentWrapper getContentVersion(Id docId){
        

        //getingfile data
        ContentVersion cv = [SELECT Id,FileType,FileExtension,versionData FROM ContentVersion WHERE ContentDocumentId =: docId AND IsLatest = true];
        Datetime dToday = System.now();
        String dateStr = dToday.format('yyyy_MM_dd_h_mm_ss_a','GMT+08:00');
        apiresponse resp = getSharePointAccessToken();
        contentWrapper wrap = new contentWrapper();
        wrap.today = dateStr;
        wrap.sf_AccessToken = getSalesforceAccessToken();//getFileData();
        wrap.content = cv;
        wrap.sharepointtoken= resp.response;
        return wrap;
    }

    
    @AuraEnabled(cacheable=true)
    Public Static apiresponse getSharePointAccessToken(){
        SharePoint_Details__mdt mdt = SharepointUploadCtrl.getCustomMetadata();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://login.microsoftonline.com/'+mdt.Tenant_Id__c+'/oauth2/token');
        request.setMethod('GET');    
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        String payload = 'grant_type='+mdt.Grant_Type__c+'&client_id='+mdt.Client_Id__c+'&client_secret='+mdt.Client_Secret__c+'&resource='+mdt.Resource__c;

        request.setBody(payload);
        HttpResponse response = http.send(request);
        apiresponse apires = new apiresponse();
        apires.code = response.getStatusCode();
        Map<String,Object> resp = (Map<String,Object>)JSON.deserializeUntyped(response.getBody());
        apires.response = String.valueof(resp.get('access_token'));
        
        return apires;

    }
    
    
    Public Static Integer checkSharePointFolder( String parentFolderName,String accessToken){
        SharePoint_Details__mdt mdt = SharepointUploadCtrl.getCustomMetadata();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        System.debug('accessToken'+accessToken);
        request.setEndpoint(mdt.EndPoint_Url__c+'/'+mdt.Site_ID__c+'/drive/root:/'+mdt.Parent_Folder__c+':/search(q=\''+parentFolderName+'\')');
        request.setMethod('GET');    
        request.setHeader('Authorization', 'Bearer '+accessToken);
        request.setHeader('Accept', '*/*');
        
        HttpResponse response = http.send(request);
        System.debug('checkfile'+response.getBody());
        Map<String,object> data=(Map<String,object>)JSON.deserializeUntyped(response.getBody());
        List<object> result = (List<object>)data.get('value');
        return result.Size();
        
    }
    
    Public Static Void createSharePointFolder( String folderUrl, String parentFolderName,String accessToken){
        SharePoint_Details__mdt mdt = SharepointUploadCtrl.getCustomMetadata();
        String folderDetails = '{ "name": "'+parentFolderName+'", "folder": { }, "@microsoft.graph.conflictBehavior": "replace" }';
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String url = mdt.EndPoint_Url__c+'/'+mdt.Site_ID__c+'/drive/root:/'+mdt.Parent_Folder__c;
        if( !String.isEmpty(folderUrl) ){
              url+=folderUrl+':/children\')';
        }else{
           url+=':/children\')'; 
        }
        request.setEndpoint(url);
        request.setMethod('POST');    
        request.setHeader('Authorization', 'Bearer '+accessToken);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept', '*/*');
        request.setBody(folderDetails);
        System.debug('url==>'+url);
        HttpResponse response = http.send(request);
    }
    
    
    
    @AuraEnabled(cacheable=true)
    public static String getSalesforceAccessToken(){
        try{
          
            
             String sessionId = '';
             // Refer to the Page
             PageReference reportPage = Page.GetSessionId;
             // Get the content of the VF page
             String vfContent = reportPage.getContent().toString();
             System.debug('vfContent '+vfContent);
             // Find the position of Start_Of_Session_Id and End_Of_Session_Id
             Integer startP = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
             endP = vfContent.indexOf('End_Of_Session_Id');
             // Get the Session Id
             sessionId = vfContent.substring(startP, endP);
             System.debug('sessionId '+sessionId);
             // Return Session Id
             return sessionId;
   			
        }
        catch(Exception e){
			 throw new AuraHandledException(e.getMessage());            
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static SharePoint_Details__mdt getCustomMetadata(){
        SharePoint_Details__mdt mdt = new SharePoint_Details__mdt();     
        mdt = [ Select Id,MasterLabel,Client_Id__c,Client_Secret__c,EndPoint_Url__c,Grant_Type__c,Parent_Folder__c,Resource__c,Site_ID__c,Tenant_Id__c from SharePoint_Details__mdt where MasterLabel='Sharepoint_Details'];
        return mdt;
    }
    
    
    @AuraEnabled
    public static void updateCustomMetadata( String mdt ){
        SharePoint_Details__mdt mdtRec = (SharePoint_Details__mdt) System.JSON.deserialize(mdt,SharePoint_Details__mdt.class);
        Metadata.CustomMetadata cMetadata = new Metadata.CustomMetadata();
        cMetadata.fullName = 'SharePoint_Details.Sharepoint_Details';
        cMetadata.label = 'Sharepoint_Details';
        
        Metadata.CustomMetadataValue field1 = new Metadata.CustomMetadataValue();
        field1.Field = 'Client_Id__c';
        field1.Value = mdtRec.Client_Id__c; 
        cMetadata.values.add(field1);
        
        Metadata.CustomMetadataValue field2 = new Metadata.CustomMetadataValue();
        field2.Field = 'Client_Secret__c';
        field2.Value = mdtRec.Client_Secret__c; 
        cMetadata.values.add(field2);
        
        Metadata.CustomMetadataValue field3 = new Metadata.CustomMetadataValue();
        field3.Field = 'EndPoint_Url__c';
        field3.Value = mdtRec.EndPoint_Url__c; 
        cMetadata.values.add(field3);
        
        Metadata.CustomMetadataValue field4 = new Metadata.CustomMetadataValue();
        field4.Field = 'Parent_Folder__c';
        field4.Value = mdtRec.Parent_Folder__c;
        cMetadata.values.add(field4);
        
        Metadata.CustomMetadataValue field5 = new Metadata.CustomMetadataValue();
        field5.Field = 'Resource__c';
        field5.Value = mdtRec.Resource__c;
        cMetadata.values.add(field5);
        
        Metadata.CustomMetadataValue field6 = new Metadata.CustomMetadataValue();
        field6.Field = 'Site_ID__c';
        field6.Value = mdtRec.Site_ID__c;
        cMetadata.values.add(field6);
        
        Metadata.CustomMetadataValue field7 = new Metadata.CustomMetadataValue();
        field7.Field = 'Grant_Type__c';
        field7.Value = mdtRec.Grant_Type__c;
        cMetadata.values.add(field7);
        
        Metadata.CustomMetadataValue field8 = new Metadata.CustomMetadataValue();
        field8.Field = 'Tenant_Id__c';
        field8.Value = mdtRec.Tenant_Id__c;
        cMetadata.values.add(field8);
         
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
        mdContainer.addMetadata(cMetadata);
        Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, null);
    }
    
    public class contentWrapper{
        @AuraEnabled 
        public ContentVersion content{get;set;}
        @AuraEnabled 
        public String today{get;set;} 
        @AuraEnabled 
        public String sf_AccessToken{get;set;}
        @AuraEnabled 
        public String sharepointtoken{get;set;}
    }
    
    public class apiresponse{
        @AuraEnabled 
        public Integer code{get;set;}
        @AuraEnabled 
        public String response{get;set;}
        
            
    }
    
    public class folderNames{
       @AuraEnabled  public String fileName;
       @AuraEnabled  public String objectName;
       @AuraEnabled  public Boolean isParent;
    }
    
    
}