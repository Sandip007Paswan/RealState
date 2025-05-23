import { LightningElement,wire,track } from 'lwc';
import getCustomMetaData from '@salesforce/apex/SharepointUploadCtrl.getCustomMetadata';
import updateCustomMetadata from '@salesforce/apex/SharepointUploadCtrl.updateCustomMetadata';

export default class Sharepointconfiglwc extends LightningElement {
   @track handleEdits = true;
   spinner = true;
    details ={
        "Id":"",
        "MasterLabel":"",
        "Client_Id__c":"",
        "Client_Secret__c":"",
        "EndPoint_Url__c":"",
        "Grant_Type__c":"",
        "Parent_Folder__c":"",
        "Resource__c":"",
        "Site_ID__c":""
    };
    copydetails ={
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
    error;
   @track disabled = true;
   // expression1 = true;

    @wire(getCustomMetaData)
    wiredCustomMetaData({ error, data }) {
        if (data) {   
            this.details = data;
            this.copydetails = data;
            this.spinner = false;
            //console.log(JSON.stringify(this.details));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.details = undefined;
        }
    }

    handleEdit(){
        this.handleEdits = false;
        this.disabled = false;
    }

    handleCancal(){
        this.handleEdits = true;
        this.disabled = true;
        this.details = this.copydetails;
    }

    handleSave(){
        this.spinner = true;
        updateCustomMetadata({ mdt: JSON.stringify(this.details) })
		.then(result => {
			//this.details = result;
			this.error = undefined;
            this.handleEdits = true;
            this.disabled = true;
            this.copydetails = this.details;
            this.spinner = false;
		})
		.catch(error => {
			this.error = error;
			//this.details = undefined;
		})
        
    }

    input1(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Client_Id__c = event.detail.value;
        this.details = record;
    }

    input2(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Client_Secret__c = event.target.value;
        this.details = record;
    }

    input3(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.EndPoint_Url__c = event.target.value;
        this.details = record;
    }

    input4(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Grant_Type__c = event.target.value;
        this.details = record;
    }

    input5(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Parent_Folder__c = event.target.value;
        this.details = record;
    }

    input6(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Resource__c = event.target.value;
        this.details = record;
    }

    input7(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Site_ID__c = event.target.value;
        this.details = record;
    }

    input8(event){
        var record = JSON.parse(JSON.stringify(this.details));
        record.Tenant_Id__c = event.target.value;
        this.details = record;
    }

    
}