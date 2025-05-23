// ***************************************************************************************************************
// * @fileName    : Sharepointfileslwc
// * @created     : RALPH DOLLENTE
// * @Description : Share Point Files LWC
// * Modification Log : Set the access point token and do file posting 
// * Developer                 Date                        Description
// * **************************************************************************************************************
// * Ralph Dollente            12/03/2023                  Initial Development
// ****************************************************************************************************************


import { LightningElement,wire,api } from 'lwc';
import getSharePointAccessToken from '@salesforce/apex/SharepointUploadCtrl.getSharePointAccessToken';
import IMAGE from "@salesforce/resourceUrl/sharepointlogo";

export default class Sharepointfileslwc extends LightningElement {
    sharepointlogo = IMAGE;
    @api recordID;
    sharepointAccessTkn;
    cdList;
    error;
    @api folderurl;
    @api folderObject;
    @api metadata;
    spinner = true;
    message = '';
    showMessage=false;

    mdtdetails ={
        "Id":"",
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


    sharepointaccesstoken(event){
        getSharePointAccessToken()
		.then(result => {
            if( result.code == 200 ){
                this.sharepointAccessTkn =  result.response;
                if( event==true){
                    this.dataget();
                }    
            }	
			this.error = undefined;
		})
		.catch(error => {
			this.error = error;
			//this.details = undefined;
		})
    }

    connectedCallback(){
        this.sharepointaccesstoken(true);      
        
    }

    dataget(){
        this.mdtdetails = JSON.parse(this.metadata);
        var url = `${this.mdtdetails.EndPoint_Url__c}/${this.mdtdetails.Site_ID__c}/drive/root:/${this.mdtdetails.Parent_Folder__c}`;
        url = url+`${this.folderurl}:/children`;
        var parentThis= this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status === 200) {
                    console.log(JSON.stringify(xhttp.response));
                    var resp = xhttp.response.replaceAll('@microsoft.graph.downloadUrl','downloadUrl');
                    var data = JSON.parse(resp).value;
                    var images=[];
                    for(var i=0;i<data.length;i++){
                        var imgData ={'Id':'','Title':'','FileType':'','CreatedDate':'','dowloadUrl':'','publicUrl':''};
                        if (data[i].hasOwnProperty("downloadUrl")) {
                            imgData.Id = data[i].id;
                            imgData.Title =data[i].name;
                            imgData.FileType =data[i].file.mimeType;
                            imgData.CreatedDate = data[i].createdDateTime;
                            imgData.dowloadUrl = data[i].downloadUrl;
                            imgData.publicUrl = data[i].webUrl;
                            console.log(data[i].webUrl);
                            images.push(imgData);
                        }
                    }
                
                    parentThis.cdList = images;
                    parentThis.spinner = false;
                    parentThis.showMessage = false;
                    parentThis.message = '';
                }else{
                    parentThis.spinner = false;
                    parentThis.showMessage = true;
                    parentThis.message = xhttp.response;
                }
            }
        };
        xhttp.open("GET", url);
        xhttp.setRequestHeader("Authorization", "Bearer " + this.sharepointAccessTkn);
        xhttp.send();
    }

    navigateToFiles(event){

        /* var url = `${this.mdtdetails.EndPoint_Url__c}/${this.mdtdetails.Site_ID__c}/drive/items/${event.currentTarget.dataset.id}/thumbnails`;
        var parentThis= this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status === 200) {
                    alert('test');
                    console.log(JSON.stringify(xhttp.response));
                    
                    parentThis.spinner = false;
                    parentThis.showMessage = false;
                    parentThis.message = '';
                }else{
                    parentThis.spinner = false;
                    parentThis.showMessage = true;
                    parentThis.message = xhttp.response;
                }
            }
        };
        xhttp.open("GET", url);
        xhttp.setRequestHeader("Authorization", "Bearer " + this.sharepointAccessTkn);
        xhttp.send(); */

        window.open(event.currentTarget.dataset.id,'_blank');
    }

    handleOnselect(event) {
        this.spinner = true;
        var rec = event.currentTarget.dataset.id;
        this.selectedItemValue = event.detail.value;
        if( this.selectedItemValue == 'Download'){
            window.open(event.currentTarget.dataset.title,'_blank');
            this.spinner = false;
        }
        if( this.selectedItemValue == 'Delete'){
            this.deleteFile(rec);
        }      
    }

    deleteFile(docId){
        this.mdtdetails = JSON.parse(this.metadata);
        var url = `${this.mdtdetails.EndPoint_Url__c}/${this.mdtdetails.Site_ID__c}/drive/items/${docId}/permanentDelete`;
        var parentThis= this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status === 200) {
                    var data = JSON.parse(JSON.stringify(parentThis.cdList));
                    var index = data.findIndex((el) => (el.id === docId));//data.map(function(x) {return x.id; }).indexOf(docId);
                    data.splice(index, 1);
                    parentThis.cdList = data;
                    parentThis.spinner = false;
                    parentThis.showMessage = false;
                    parentThis.message = '';
                }else{
                    parentThis.showMessage = true;
                    parentThis.message = xhttp.response;
                }
                
            }
        };
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Authorization", "Bearer " + this.sharepointAccessTkn);
        xhttp.send();
    }

    @api
    refreshPage(data) {
        this.spinner = true;
        this.sharepointaccesstoken(true);
    }

}