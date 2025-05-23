import { LightningElement,api } from 'lwc';

export default class Checkboxscreenlwc extends LightningElement {
    @api imdcheck = false;
    @api latercheck = false;

    onchange1(event){
        if( event.target.checked == true ){
            this.imdcheck = event.target.checked;
        }
        if( this.latercheck == true ){
            this.latercheck = false;
        }
    }
    onchange2(event){
        if( event.target.checked == true ){
            this.latercheck = event.target.checked;
        }
        if( this.imdcheck == true ){
            this.imdcheck = false;
        }
    }

    @api
    validate() {
      const validity = {
        isValid: true,
        errorMessage: 'Please choose the option.'
      };
      if( this.imdcheck == false && this.latercheck == false ){
        validity.isValid = false;
      }
      return validity;
    }
}