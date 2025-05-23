import { LightningElement,api,track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import IMAGE from "@salesforce/resourceUrl/sharepointlogo";
import IMAGE1 from "@salesforce/resourceUrl/sflogo";

export default class Filesmainscreen extends LightningElement {
    sharepointlogo = IMAGE;
    sflogo = IMAGE1;
    activeTab='1';
    @api recordId;
    @track recid;
    lwcloaded = false;
    lwcchild = false;


    @track folderurl='';
    @track metadata;
    
    set recordId(value) {
        this.recid = value;
        this.lwcloaded = true;
    }
    
    get recordId() {
        return this._recordId;
    }
    
    handleActive(event) {
        this.activeTab = event.target.value;//`Tab with value ${event.target.value} is now active`;
        if( this.activeTab == "2"){
            this.lwcchild = true;
        }else{
            this.lwcchild = false; 
        }
    }

    filedetailsMethod(event){
       // /${this.currentRecordName}
       this.folderurl='';
        var data = JSON.parse(event.detail.detail1);
        var size = data.length;
        for(var i=size-1; i>=0; i--){
            this.folderurl = this.folderurl+`/${data[i].fileName}_${data[i].objectName}`;
        }
    }

    metadataMethod(event){
        this.metadata = event.detail;
    }


    handleRefresh(){
        this.template.querySelector('c-sharepointfileslwc').refreshPage('call');
    }

    handleRefresh1(){
        //alert('test');
        this.template.querySelector('c-salesforcefilesscreenlwc').refreshPage('call');
    }

    closeRefresh(){
        this.dispatchEvent(new CloseActionScreenEvent());
        //window.location.reload();
    }
    
}