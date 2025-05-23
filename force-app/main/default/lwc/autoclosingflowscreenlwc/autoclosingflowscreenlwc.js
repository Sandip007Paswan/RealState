import { LightningElement } from 'lwc';
import {
    FlowNavigationBackEvent,
    FlowNavigationNextEvent,
    FlowNavigationFinishEvent
  } from "lightning/flowSupport";
export default class Autoclosingflowscreenlwc extends LightningElement {

    connectedCallback(){
        const navigateFinishEvent = new FlowNavigationFinishEvent();
        this.dispatchEvent(navigateFinishEvent);
    }
}