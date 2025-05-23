import { LightningElement,api } from 'lwc';
import {
    FlowNavigationBackEvent,
    FlowNavigationNextEvent,
    FlowNavigationFinishEvent
  } from "lightning/flowSupport";
export default class Opplookupscreenlwc extends LightningElement {
    @api
    availableActions = [];

    @api nextstep=false;
    @api previousstep=false;

    handleGoNext() {
        this.nextstep = true;
        this.previousstep = false;
        // check if NEXT is allowed on this screen
        if (this.availableActions.find((action) => action === 'NEXT')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }

    handleGoPrevious() {
        this.nextstep = false;
        this.previousstep = true;
        // check if Previous is allowed on this screen
        if (this.availableActions.find((action) => action === 'NEXT')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }

    handleGoFinish() {
        this.nextstep = false;
        this.previousstep = false;
        // check if NEXT is allowed on this screen
        if (this.availableActions.find((action) => action === 'NEXT')) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }
}