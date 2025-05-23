import { LightningElement,api,wire,track } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDp from '@salesforce/apex/profileDPLwcforContacts.getFilesData';
import createFile from '@salesforce/apex/profileDPLwcforContacts.createFile';

export default class Contact360dplwcforcontacts extends LightningElement {
    @api recordId;
    @track backgroundImage='';
    @track spinner=true;
    @track file1={isfileName:'',isBase64:null}
    @track existingDocId = 'blank';
    @track names;
    @track phone;
    @track email;
    @track recordtypevalue;
    @track dateofbirth;
    @track accountname;
    @track orgUrl;
   
    




    @wire(getDp, {recordId:'$recordId'})
    wiredFiles({data, error}){
        if(data){
                
                this.names=data.fullNm;
                this.phone=data.phone;
                this.email=data.email;
                this.accountname=data.Accname;
                this.recordtypevalue=data.recordtype;
                this.dateofbirth=data.birthdate;
                this.orgUrl=data.orgUrl;

                if( data.contentDoc != 'blank'){
                    this.backgroundImage = this.orgUrl+"/sfc/servlet.shepherd/document/download/"+data.contentDoc;
                    this.existingDocId = data.contentDoc;
                }
                this.spinner = false;
        }
        else{
            this.existingDocId = 'blank';
            this.spinner = false;
        }
    }


    //File upload event
    openfileUpload(event) {
        this.spinner = true;
        const file = event.target.files[0];
        
        let dataArray = file.name.split('.');
        if(dataArray[dataArray.length - 1]=='jpg' || dataArray[dataArray.length - 1]=='png' || dataArray[dataArray.length - 1]=='gif' || dataArray[dataArray.length - 1]=='pdf' || dataArray[dataArray.length - 1]=='doc' || dataArray[dataArray.length - 1]=='docx' || dataArray[dataArray.length - 1]=='ppt' || dataArray[dataArray.length - 1]=='pptx'||dataArray[dataArray.length - 1]=='jpeg'||dataArray[dataArray.length - 1]=='TIFF'||dataArray[dataArray.length - 1]=='JPG' || dataArray[dataArray.length - 1]=='BMP' || dataArray[dataArray.length - 1]=='PNG' || dataArray[dataArray.length - 1]=='GIF' || dataArray[dataArray.length - 1]=='PDF' || dataArray[dataArray.length - 1]=='DOC' || dataArray[dataArray.length - 1]=='DOCX' || dataArray[dataArray.length - 1]=='PPT' || dataArray[dataArray.length - 1]=='PPTX'||dataArray[dataArray.length - 1]=='JPEG')
        {
            if(file.size>4194304)
            {
                //Error toast message
                const event = new ShowToastEvent({
                    title: 'The file you uploaded is more than 4MB. Please upload a smaller file.',
                    variant: 'error',
                    mode: 'dismissable'
                });
                //Dispatches the event
                this.dispatchEvent(event);
            }
            else
            {
                var reader = new FileReader();
                reader.onload = () => {
                    var base64 = reader.result.split(',')[1]
                    var fileData = {
                        'filename': file.name,
                        'size':file.size,
                        'base64': base64,
                    }
                    //console.log('==='+JSON.stringify(fileData));
                    this.file1={isfileName:fileData.filename,isBase64:fileData.base64}
                   // console.log('====='+JSON.stringify(this.file1));
                   this.handlesubmit();
                }
                
                reader.readAsDataURL(file);
                
            }
        }else
        {
            const event = new ShowToastEvent({
              title: 'The file you uploaded is not a supported format. Please reupload your file.',
              variant: 'error',
              mode: 'dismissable'
        });
            this.dispatchEvent(event);

        }
    }

    handlesubmit() {
        console.log('====='+JSON.stringify(this.file1));
        createFile( { existingDocId : this.existingDocId , recordId:this.recordId, fileWrp1:JSON.stringify(this.file1) })
            .then(result => {
                this.track = false;
                const event = new ShowToastEvent({
                    title: 'The file is uploaded successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                //Dispatches the event
                this.dispatchEvent(event);
                this.backgroundImage = this.orgUrl+"/sfc/servlet.shepherd/document/download/"+result;
                this.spinner = false;
                this.existingDocId = result;
            })
            .catch(error => {
                this.error = error;
            });
    }
}