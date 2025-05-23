import { LightningElement } from 'lwc';
import IMAGE from "@salesforce/resourceUrl/productlogo";
export default class Sharepointconfigmainscreen extends LightningElement {
    sharepointlogo = IMAGE;
    tab1='';
    tab2='';
    text='';
    icon='';
    title='';
    tab1check=false;
    tab2check=false;
    sharepointconfig(){
        //Mark Jaeckal • Unlimited Customer • 11/13/15
        this.tab1 = 'slds-nav-vertical__item slds-is-active ';
        this.tab2 = 'slds-nav-vertical__item';
        this.icon='standard:custom';
        this.title="setup";
        this.text='Valuehub • SharePoint Config';
        this.tab1check = true;
        this.tab2check = false;
    }
    sfconfig(){
        this.tab2 = 'slds-nav-vertical__item slds-is-active';
        this.tab1 = 'slds-nav-vertical__item';
        this.icon='standard:datashare_target';
        this.title="folder";
        this.text='Valuehub • Folders Config';
        this.tab2check = true;
        this.tab1check = false;
    }

    newscreen(){
        this.template.querySelector('c-sharepointfolderconfiglwc').parentFire('call');
    }
    
}