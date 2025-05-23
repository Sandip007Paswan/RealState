import { LightningElement,api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class Requestmeetingscreenlwc extends LightningModal {
    @api listingid ='';

    get inputVariables(){
       // alert(this.listingid);
        return [
            {
                name:'lisitingid',
                type:'String',
                value:this.listingid
            }
        ];
    }

    handleStatusChange(event){
        if(event.detail.status === 'FINISHED'){
            //alert('testing');
            this.handleCloseClick();
        }
    }

    handleCloseClick() {
        this.close('canceled');
      }

}