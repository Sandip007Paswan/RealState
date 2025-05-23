import { LightningElement,wire,api,track } from 'lwc';
import getDetails from '@salesforce/apex/FollowUpDesicionEmailApxCls.getDetails';
import apiRequest from '@salesforce/apex/FollowUpDesicionEmailApxCls.apiRequest';
export default class ChatOpenAIScreenLwc extends LightningElement {
    selected ='Generate Follow-up Email';
    @track showTime = false;
    @track timeVal = '0:0';
    @track customField='';
    @track details ={nextStep:'',userName:'',contactName:''};
    @track message;
    @track track=false;
    @api recordId;
    errorMessage=null;
    timeIntervalInstance;
    totalMilliseconds = 0;
    type = [
        { label: 'Generate Follow-up Email', value: 'Generate Follow-up Email' }
    ];

    handleSelectedChange(event) {
        this.selected = event.target.value;
    }

    @wire(getDetails,{recordId : '$recordId'})
    resultData({data,error}){
        if(data){
            this.details = data;
            this.customField = data.nextStep;
        }
    }

    customtext(event){
        this.customField = event.target.value;
    }

    async handleNext(event){
        this.errorMessage=null;
        var text = '';
        if( this.customField == '' || this.customField == undefined){
            this.errorMessage ='Please Key in message to generate the sample email content';
            return;
        }
        this.start();
        this.track = true;
        this.message ='';
        text = this.customField;
        
        apiRequest({ subject: text ,currentUserName: this.details.userName ,contactName: this.details.contactName })
            .then((data) => {
                this.track = false;
                this.message =  data;
                this.stop();
            })
            .catch((error) => {
                this.track = false;
                this.stop();
                console.log(JSON.stringify(error));
            });
    }

    async copyClipBoard(event){
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works 
       // with "input" does not work with "textarea". – Eduard
        dummy.value = this.message;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    //start time interval
    start() {
        this.showTime = true;
        this.timeVal ='0:0';
        var parentThis = this;

        // Run timer code in every 100 milliseconds
        this.timeIntervalInstance = setInterval(function() {

            // Time calculations for hours, minutes, seconds and milliseconds
           // var hours = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000);
           // var milliseconds = Math.floor((parentThis.totalMilliseconds % (1000)));
            // Output the result in the timeVal variable
            parentThis.timeVal = minutes + ":" + seconds ;   
            
            parentThis.totalMilliseconds += 100;
        }, 100);
    }

    //end time interval
    stop() {
        this.showTime = false;
        clearInterval(this.timeIntervalInstance);
    }
}