import { LightningElement,wire,api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAllFolderDetails from '@salesforce/apex/SharepointUploadCtrl.getAllFolderDetails';
import createFolderDetails from '@salesforce/apex/SharepointUploadCtrl.createFolderDetails';
import deleteFolderDetails from '@salesforce/apex/SharepointUploadCtrl.deleteFolderDetails';

export default class Sharepointfolderconfiglwc extends LightningElement {
    cdList;
    spinner = true;
    popspinner = false;
    filesData;
    popup = false;
    popupheading='';
    error;
    recordDetails={
        "Id":null,
        "Name":"",
        "Query__c":"",
        "Is_It_Parent__c":false,
        "Field_Name__c":"",
        "Sequence__c":null,
        "Object_Name__c":"",
        "Child_Object_Names__c":"",
        "Parent__c":"",
        "Parent_Object_Name_Field_Api__c":""
    };
    dummyrecordDetails={
        "Id":null,
        "Name":"",
        "Query__c":"",
        "Is_It_Parent__c":false,
        "Field_Name__c":"",
        "Sequence__c":null,
        "Object_Name__c":"",
        "Child_Object_Names__c":"",
        "Parent__c":"",
        "Parent_Object_Name_Field_Api__c":""
    };


    @wire( getAllFolderDetails )
    wiredFolderDetails(result) {
        this.filesData = result;
        const {data,error} = result;
        if (data) {
            this.cdList = data;
            this.error = undefined;
            this.spinner = false;
        } else if (error) {
            this.error = error;
            this.cdList = undefined;
            this.spinner = false;
        }
        this.spinner = false;
    }

    handleOnselect(event){
        //this.spinner = true;
        var rec = event.currentTarget.dataset.id;
        //var title = event.currentTarget.dataset.title;
        var selectedItemValue = event.detail.value;
        if( selectedItemValue == 'Edit'){ 
            this.popspinner = true;
            this.editFolder(rec);
        }
        if( selectedItemValue == 'Delete'){
            this.spinner = true;
            this.deleteFile(rec);
        }
        if( selectedItemValue == 'Clone'){
            this.popspinner = true;
            this.cloneFolder(rec);
        }
    }

    createFolder(){
        this.popupheading='Create Folder Schema';
        this.popup = true;
        this.popspinner = false;
    }

    editFolder(recordId){
        var index = this.cdList.findIndex(rec => rec.Id == recordId);
        var rec = this.cdList[index];
        this.recordDetails.Id = rec.Id;
        this.recordDetails.Name = rec.Name;
        this.recordDetails.Child_Object_Names__c = rec.Child_Object_Names__c;
        this.recordDetails.Field_Name__c = rec.Field_Name__c;
        this.recordDetails.Is_It_Parent__c = rec.Is_It_Parent__c;
        this.recordDetails.Object_Name__c = rec.Object_Name__c;
        this.recordDetails.Parent_Object_Name_Field_Api__c = rec.Parent_Object_Name_Field_Api__c;
        this.recordDetails.Parent__c = rec.Parent__c;
        this.recordDetails.Query__c = rec.Query__c;
        this.recordDetails.Sequence__c = rec.Sequence__c;
        this.popupheading='Edit Folder Schema';
        this.popspinner = false; 
        this.popup = true;
    }

    cloneFolder(recordId){
        var index = this.cdList.findIndex(rec => rec.Id == recordId);
        var rec = this.cdList[index];
        //this.recordDetails.Id = rec.Id;
        this.recordDetails.Name = rec.Name;
        this.recordDetails.Child_Object_Names__c = rec.Child_Object_Names__c;
        this.recordDetails.Field_Name__c = rec.Field_Name__c;
        this.recordDetails.Is_It_Parent__c = rec.Is_It_Parent__c;
        this.recordDetails.Object_Name__c = rec.Object_Name__c;
        this.recordDetails.Parent_Object_Name_Field_Api__c = rec.Parent_Object_Name_Field_Api__c;
        this.recordDetails.Parent__c = rec.Parent__c;
        this.recordDetails.Query__c = rec.Query__c;
        this.recordDetails.Sequence__c = rec.Sequence__c;
        this.popupheading='Clone Folder Schema';
        this.popspinner = false; 
        this.popup = true;
    }

    @api
    parentFire(event) {
        this.popspinner = true;        
        this.createFolder();
    }

    cancelpopup(){
        this.popup = false;
        this.popspinner=false;
    }

    saveData(){
        createFolderDetails({ rec: this.recordDetails })
		.then(result => {
            this.popspinner = false;
            this.popup = false;
            this.spinner = true;
            this.recordDetails = this.dummyrecordDetails;
            refreshApex(this.filesData);
		})
		.catch(error => {
			this.error = error;
		})
    }

    deleteFile(docId){
        deleteFolderDetails({ recId:docId})
		.then(result => {
            refreshApex(this.filesData);
		})
		.catch(error => {
			this.error = error;
		});
    }

    handle1(event){
        this.recordDetails.Name = event.target.value;
    }
    handle2(event){
        this.recordDetails.Parent__c = event.target.value;
    }
    handle3(event){
        this.recordDetails.Query__c = event.target.value;
    }
    handle4(event){
        this.recordDetails.Parent_Object_Name_Field_Api__c = event.target.value;
    }
    handle5(event){
        this.recordDetails.Child_Object_Names__c = event.target.value;
    }
    handle6(event){
        this.recordDetails.Object_Name__c = event.target.value;
    }
    handle7(event){
        this.recordDetails.Field_Name__c = event.target.value;
    }
    handle8(event){
        this.recordDetails.Sequence__c = event.target.value;
    }
    handle9(event){
        this.recordDetails.Is_It_Parent__c = event.target.value;
    }

}