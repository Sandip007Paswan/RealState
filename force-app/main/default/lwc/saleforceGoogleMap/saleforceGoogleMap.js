/*
import { LightningElement, wire } from 'lwc';
import getListingsByCity from '@salesforce/apex/RealStateDynamicController.getListingsByCity';

export default class SaleforceGoogleMap extends LightningElement {
    mapMarkers = [];
    error;
    mapCenter = { location: { Country: 'United States' } };
    initialZoomLevel = 4;

    @wire(getListingsByCity)
    wiredOfficeLocation({ error, data }) {
        if (data) {
            console.log(data);
            this.mapMarkers = data.map(dataItem => {
                const propertyImages = dataItem.Property__r && dataItem.Property__r.Property_Images__r
                    ? dataItem.Property__r.Property_Images__r.map(image => image.Property_Image_URL__c)
                    : [];

                console.log('Property Images:', propertyImages);

                return {
                    location: {
                        City: dataItem.City__r ? dataItem.City__r.Name : '',
                        State: dataItem.State__r ? dataItem.State__r.Name : '',
                        Country: dataItem.Country__r ? dataItem.Country__r.Name : '',
                    },
                    icon: 'custom:custom26',
                    title: dataItem.Name,
                    customMarker: {
                        propertyImages: propertyImages,
                        propertyName: dataItem.Name,
                    },
                };
            });

            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
}
*/
/*

import { LightningElement, wire } from 'lwc';
import getListingsByCity from '@salesforce/apex/RealStateDynamicController.getListingsByCity';

export default class SaleforceGoogleMap extends LightningElement {
    mapMarkers = [];
    error;
    mapCenter = { location: { Country: 'United States' } };
    initialZoomLevel = 4;
    selectedPropertyName='Property Name';

    @wire(getListingsByCity)
    wiredOfficeLocation({ error, data }) {
        if (data) {
            this.mapMarkers = data.map(dataItem => {
                const propertyImages = dataItem.Property__r && dataItem.Property__r.Property_Images__r
                    ? JSON.parse(JSON.stringify(dataItem.Property__r.Property_Images__r)).map(image => image.Property_Image_URL__c)
                    : [];

                console.log('Property Images:', propertyImages);

                return {
                    location: {
                        City: dataItem.City__r ? dataItem.City__r.Name : '',
                        State: dataItem.State__r ? dataItem.State__r.Name : '',
                        Country: dataItem.Country__r ? dataItem.Country__r.Name : '',
                    },
                    icon: 'custom:custom26',
                    title: dataItem.Name,
                    customMarker: {
                        propertyImages: propertyImages,
                        propertyName: dataItem.Name,
                    },
                };
            });

            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
}
*/

import { LightningElement, wire } from 'lwc';
import getListingsByCity from '@salesforce/apex/RealStateDynamicController.getListingsByCity';

export default class SaleforceGoogleMap extends LightningElement {
    mapMarkers = [];
    error;
    mapCenter = { location: { Country: 'United States' } };
    initialZoomLevel = 2;

    @wire(getListingsByCity)
    wiredOfficeLocation({ error, data }) {
        if (data) {
            this.mapMarkers = data.map(dataItem => ({
                location: {
                    City: dataItem.City__r ? dataItem.City__r.Name : '',
                    Street: dataItem.Street_Name__c ? dataItem.Street_Name__c : '',
                    State: dataItem.State__r ? dataItem.State__r.Name : '',
                    Country: dataItem.Country__r ? dataItem.Country__r.Name : '',
                    image: dataItem.Property__r ? dataItem.Property__r.Property_Image_URL__c : '',
                },
                value:  dataItem.Id,
                icon: 'custom:custom26',
                title: dataItem.Name,
                recordId: dataItem.Id,
            }));

            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
   

    handleMarkerSelect(event) {
        console.log('Event Detail:', event.detail);
    
        const selectedRecordId = event.detail.selectedMarkerValue;
        console.log('i am best',selectedRecordId );
    
        if (selectedRecordId) {
            console.log('Show selected', selectedRecordId);
    
            // Find the selected marker in the mapMarkers array
            const selectedMarker = this.mapMarkers.find(marker => marker.recordId === selectedRecordId);
    
            // Update map center and zoom level to focus on the selected marker
            this.mapCenter = {
                location: {
                    Country: selectedMarker.location.Country,
                    City: selectedMarker.location.City,
                    State: selectedMarker.location.State,
                },
            };
            // Optionally adjust the zoom level for a closer view
            this.initialZoomLevel = 10; // Adjust this value as needed
        } else {
            console.error('RecordId is undefined or null.');
        }
    }
    
    
    
}