import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
export default class DynamicRealStateChild extends NavigationMixin(LightningElement) {
    @api listing;
    
    connectedCallback() {
      //  console.log('Received listing data in child:',JSON.stringify(this.listing));
    }
    get hasImages() {
        return this.listing && this.listing.imageUrl && this.listing.imageUrl.length > 0;
    }

    get images() {
        return this.hasImages ? this.listing.imageUrl : [];
    }

    navigateToFiles(event) {
        //alert('test');
        var rec = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('selectedrecid', {
            detail: rec
        }));
      /*  this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rec,
                objectApiName: 'Listings__c',
                actionName: 'view'
            },
        }); */
    }

   
}