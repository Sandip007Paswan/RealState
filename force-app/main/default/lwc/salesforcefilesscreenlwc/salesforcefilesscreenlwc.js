import { LightningElement,wire,track,api } from 'lwc';
import getSharePointAccessToken from '@salesforce/apex/SharepointUploadCtrl.getSharePointAccessToken';
import getSalesforceAccessToken from '@salesforce/apex/SharepointUploadCtrl.getSalesforceAccessToken';
import getCustomMetadata from '@salesforce/apex/SharepointUploadCtrl.getCustomMetadata';
import getRelatedDocs from '@salesforce/apex/SharepointUploadCtrl.getRelatedDocs';
import getFolderName from '@salesforce/apex/SharepointUploadCtrl.getFolderName';
import getDocURL from '@salesforce/apex/SharepointUploadCtrl.getDocURL';
import deleteDoc from '@salesforce/apex/SharepointUploadCtrl.deleteDoc';
import getContentVersion from '@salesforce/apex/SharepointUploadCtrl.getContentVersion';
import { NavigationMixin } from "lightning/navigation";
import IMAGE from "@salesforce/resourceUrl/sflogo";
import { refreshApex } from '@salesforce/apex';
export default class Salesforcefilesscreenlwc extends NavigationMixin(LightningElement) {
    sflogo = IMAGE;
    @api recordId;
    filesData;
    cdList;
    error;
    folderDetails=[];
    spinner = true;
    folderurl='';
    mdtdetails ={
        "Id":null,
        "MasterLabel":"",
        "Client_Id__c":"",
        "Client_Secret__c":"",
        "EndPoint_Url__c":"",
        "Grant_Type__c":"",
        "Parent_Folder__c":"",
        "Resource__c":"",
        "Site_ID__c":"",
        "Tenant_Id__c":""
    };


    getApiDetails(){
        getCustomMetadata()
		.then(result => {
			this.mdtdetails = result;
            this.dispatchEvent(new CustomEvent('metadata', {
                detail: JSON.stringify(this.mdtdetails)    
            }));
			this.error = undefined;
            this.getFolderDetails();
		})
		.catch(error => {
			this.error = error;
			//this.details = undefined;
		})
    }

    getFolderDetails(event){
        getFolderName({ recordId:this.recordId })
		.then(result => {
            this.folderurl='';
            this.folderDetails = result;
            this.dispatchEvent(new CustomEvent('filedetails', {
                detail : {
                "detail1": JSON.stringify(this.folderDetails),
                "loadchild" : true
                }
            }));
            this.error = undefined;
            var size = result.length;
            for(var i=size-1; i>=0; i--){
                var filename = `${result[i].fileName}_${result[i].objectName}`;
                this.folderurl = this.folderurl+`/${filename}`;
            }
            
           this.spinner = false;
        }) 
        .catch(error => {
			this.error = error;
            this.folderDetails = [];
		})
        
    }

    @wire( getRelatedDocs ,{recordId: '$recordId'})
    wiredRelatedDocuments(result) {
        
        this.filesData = result;
        const {data,error} = result;
        if (data) {
            this.spinner = true;
            this.cdList = data;
            this.error = undefined;
            if(this.mdtdetails.Id == null ){
                this.getApiDetails();
            }else{
                this.spinner = false;
            }
        } else if (error) {
            this.error = error;
            this.cdList = undefined;
        }   
    }

    
    navigateToFiles(event) {
        var rec = event.currentTarget.dataset.id;
       // alert(rec);
        this[NavigationMixin.Navigate]({
            type: "standard__namedPage",
            attributes: {
            pageName: "filePreview",
            },
            state: {
            recordIds: rec ,
            selectedRecordId: rec ,
            },
        });
    }

    handleRedirectToUserRecord(event){
        const recordId = event.currentTarget.dataset.id;
        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, "_blank");
        });
    }

    handleOnselect(event) {
        this.spinner = true;
        var rec = event.currentTarget.dataset.id;
        var title = event.currentTarget.dataset.title;
        this.selectedItemValue = event.detail.value;
        //alert(JSON.stringify(this.selectedItemValue));
        if( this.selectedItemValue == 'Download'){
            this.downloadFile(rec);
        }
        if( this.selectedItemValue == 'Delete'){
            this.deleteFile(rec);
        }
        if( this.selectedItemValue == 'Upload To Sharepoint'){
            this.uploadSharePoint(rec,title);
        }        
    }

    downloadFile(docId){
        getDocURL({docId ,docId})
		.then(result => {
            window.open(result, "_blank");
            this.spinner = false;
		})
		.catch(error => {
			this.error = error;
			//this.details = undefined;
		});
    }

    deleteFile(docId){
        deleteDoc({docId ,docId})
		.then(result => {
            refreshApex(this.filesData);
		})
		.catch(error => {
			this.error = error;
			//this.details = undefined;
		});
    }

    uploadSharePoint(docId,title){
        getContentVersion({docId :docId,data:JSON.stringify(this.folderDetails)})
		.then(result => {
            var url = 'https://vusr-dev-ed.develop.my.salesforce.com/services/data/v59.0/sobjects/ContentVersion/'+result.content.Id+'/VersionData'  
            var parentThis = this;
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState === 4) {
                        var fileName = title+'_'+result.today+'.'+result.content.FileExtension;
                        var fileType = 'application/'+result.content.FileType;
                        var vlob=xhttp.response;   
                        parentThis.newFileUploadMethod(fileName,vlob,fileType,docId,result.sharepointtoken );        
                    }
                };
                xhttp.open("GET", url);
                xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhttp.setRequestHeader("Authorization", "Bearer " +  result.sf_AccessToken);
                xhttp.responseType = 'blob';
                xhttp.send();
                
		})
		.catch(error => {
			this.error = error;
		});
    }

    newFileUploadMethod(fileName,vlob,fileType,docId,sharepointtoken){
        var url = `${this.mdtdetails.EndPoint_Url__c}/${this.mdtdetails.Site_ID__c}/drive/root:/${this.mdtdetails.Parent_Folder__c}`;
            url = url+`${this.folderurl}/${fileName}:/content`;
        var parentThis= this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                parentThis.deleteFile(docId);
            }
        };
        xhttp.open("PUT", url);
        xhttp.setRequestHeader("Authorization", "Bearer " + sharepointtoken);
        xhttp.setRequestHeader("Content-Type","multipart/form-data");
        xhttp.setRequestHeader("Content-Type",fileType);
        xhttp.send(vlob);
    }

    @api
    refreshPage(event) {
        refreshApex(this.filesData);
        //this.spinner = false;
    }
}