import { LightningElement,api,wire } from 'lwc';
import getlookupdetails from '@salesforce/apex/appiontmentDetailslwc_Apxcls.getlookupdetails';
export default class Customlookupscreenlwc extends LightningElement {
    message='';
    selectedId='';
    @api objectname = 'Contact';
    @api filtering=false;
    @api filteringfield='';
    recordsList=[];
    @api searchkey='';
    selectedRecordId='';
    parentrelatedid='';
    checkingclear = true;
    @api filterst;
    @api eventname;
    @api disablecheck=false;
    @api requiredcheck=false;
    //@api parentid='';

    selectedValue='';
    showcombobox = false;
    @wire(getlookupdetails, { objectname: '$objectname',searchkey:'$searchkey',
    filtering:'$filtering', filteringfield:'$filteringfield', parentid:'$parentid'})
        wiredData({ error, data }) {
            if (data) {
                this.message='';
                this.recordsList = [];
                if( data != undefined){
                    this.recordsList = data;
                    //this.showcombobox = true;
                }else{
                   // this.showcombobox = false;
                    
                    if(this.searchKey.length>0){
                        this.message = 'No records found...';
                    }      
                }
            } else if (error) {
                //this.recordsList = [];
                this.message = error;
                //this.showcombobox = false;
            }
        }

    handleKeyChange(event){
        this.recordsList = [];
        this.searchkey = event.target.value;
    }

    onRecordSelection(event){
        //
        this.selectedRecordId = event.currentTarget.dataset.key; 
        this.selectedValue = event.currentTarget.dataset.name;
        //alert('check'+this.selectedValue);
        this.recordsList=[]; 
        this.searchkey ='';
        this.dispatchEvent(new CustomEvent(this.eventname, {
            detail: this.selectedRecordId
        })); 
        this.checkingclear = false;
        //alert('check'+this.checkingclear);
    }

    handleClearSelection(){ 
        //this.showcombobox = false;
        this.selectedValue = '';
        this.selectedRecordId ='';
        this.searchkey = '';
        this.checkingclear = true;
        this.dispatchEvent(new CustomEvent(this.eventname, {
            detail: 'blank'
        }));
        //alert('checking');
        
    }

    get getcombocox(){
      var css ="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ";
      if( this.recordsList.length >0){
        css +='slds-is-open';
      }
      return css;
    }

    
    @api
    get parentid(){
        //alert('check'+this.filterst+'====='+this.selectedId+'==='+this.searchkey);
        if( this.selectedId != '' && this.checkingclear == false && this.filterst == "clean"){
            //alert('check');
            this.checkingclear = true;
            this.selectedValue = '';
            this.selectedRecordId ='';
            this.searchkey = '';
        }
        return this.selectedId;
    }

    set parentid(value){
        this.selectedId = value;
    }
}