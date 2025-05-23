import { LightningElement,api,track } from 'lwc';
import {FlowAttributeChangeEvent} from 'lightning/flowSupport';

export default class Lookupscreenlwc extends LightningElement {
    
    @api countryId='';
    @api stateId='';
    @api cityId='';
    @api ctcheck = false;
    @api stcheck = false;
    @api screenmove = false;
    childdt='noclean';
    statedt='noclean';
    @track stdisable = true;
    @track ctdisable = true;


  countryChange(event) {
      
      if( this.countryId == '' ){
        this.stdisable = false;
        this.countryId = event.detail;
        return;
      }
      if( event.detail == 'blank' || event.detail == '' ){
         this.stateId = 'blank';
         this.statedt = 'clean'; 
         this.cityId = 'blank';
         this.childdt = 'clean'; 
         this.stdisable = true;
         this.ctdisable = true;
      }else{
        this.stdisable = false;
      }
      this.countryId = event.detail;
      
  }

  stateChange(event) {

    if( this.stateId =='' ){
      this.ctdisable = false;
      this.stateId = event.detail;
      return;
    }

      if( event.detail == 'blank' || event.detail == ''){
        this.cityId = 'blank';
        this.childdt = 'clean';
        this.ctdisable = true;
      }else{
        this.ctdisable = false;
      }
      this.statedt = 'noclean';
      this.stateId = event.detail;
      
  }

  cityChange(event) {
      this.cityId = event.detail;
      this.childdt = 'noclean';
  }

    @api
    validate() {
      const validity = {
        isValid: true,
        errorMessage: 'Please fill the required fields!'
      };
      if(this.countryId == null  || this.countryId == 'blank'  ){
        validity.isValid = false;
      }
      return validity;
    }

}