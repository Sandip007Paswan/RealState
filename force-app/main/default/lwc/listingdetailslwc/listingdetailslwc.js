import { LightningElement , wire , api , track } from 'lwc';
import MyModal from "c/requestmeetingscreenlwc";
import agentenquiry from "c/agentenquiryscreenlwc";
import getRelatedDocs from '@salesforce/apex/appiontmentDetailslwc_Apxcls.getRelatedDocs';
export default class Listingdetailslwc extends LightningElement {


    @api recordId='';
    @track imageUrl;
    details;
    error;

    @wire(getRelatedDocs,{ recordId:'$recordId' })
    wiredRelatedDocs({ error, data }) {
        if (data) {   
            this.details = data;
           // alert(JSON.stringify(data));
            if( data.Property_Images__r.length > 0 ){
                this.imageUrl = data.Property_Images__r[0].Property_Image_URL__c;
            }
            //console.log(JSON.stringify(this.details));
            this.error = undefined;
        } else if (error) {
           // alert(error);
            this.error = error;
            this.details = undefined;
        }
    }

    async openagentenquiryflow(){
        //this.recordId = 'a025j00000gzHacAAE';//this.recordId;
        this.schedulemeeting = true;
        const result = await agentenquiry.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'medium',
            listingid: this.recordId,
        });
    }

    async openschedulemeetingflow(){
        //this.recordId = 'a025j00000gzHacAAE';//this.recordId;
        this.schedulemeeting = true;
        const result = await MyModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'medium',
            listingid: this.recordId,
        });
    }

    selectedImg(event){
        this.imageUrl = event.currentTarget.dataset.id;
    }

    closeschedulemeetingflow(){
        this.schedulemeeting = false;
    }

    navigateToFiles(){
        this.dispatchEvent(new CustomEvent('goback', {
            detail: ''
        }));
    }
}