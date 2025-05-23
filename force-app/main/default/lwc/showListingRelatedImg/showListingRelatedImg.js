import { LightningElement, wire, track, api } from 'lwc';
import getListingsWithImages from '@salesforce/apex/RealEstateController.getListingsWithImages';



export default class ShowListingRelatedImg extends LightningElement {

    
    @track selectedrecid;
    @track countryId;
    @track cityId;
    screen1 = true;
    screen2 = false;

    countryChange(event) {
        this.countryId = event.detail;
        this.cityId = '';
    }

    cityChange(event) {
        this.cityId = event.detail;
    }
    @track countryId='';
    @track cityId='';
    screen1 = true;
    screen2 = false;
    @track childdt='';

    countryChange(event) {
        this.countryId = event.detail;
        this.cityId = 'blank';
        this.childdt = 'clean';
    }

    cityChange(event) {
        this.cityId = event.detail;
        this.childdt = 'noclean';
    }


    @track recordsFound = true;
    @track Property = [];
    @track filteredProperty = [];
    @track selectedFilter = 'All';
    @track minPrice = 0;
    @track maxPrice = 0;
    @track selectedPriceRange = 'All';

    @track selectedPropertyTypes = [];
    // Create an object to store the checkbox state
    @track propertyTypeCheckboxes = {};

    

    @track mapMarkers = [];  //for map
    mapCenter = { location: { Country: 'United States' } };
    initialZoomLevel = 3;

    


    connectedCallback() {
        this.selectedFilter = 'Active';
        this.filterPropertyList();
    }

    @track propertyTypes = [
        { label: 'Retail', value: 'Retail', checked: false },
        { label: 'Multi Family', value: 'Multi Family', checked: false },
        { label: 'Self Storage', value: 'Self Storage', checked: false },
        { label: 'Single family residence', value: 'Single family residence', checked: false },
    ];
    
    // Add properties to track the minimum number of bedrooms and bathrooms
        @track minBedrooms = 0;
        @track minBathrooms = 0;

     //code properties for city   
        @track searchCity = ''; 
        @track cityOptions = []; // This should be an array of available city names
        @track filteredCityOptions = [];
        @track cityListClass = 'slds-hide'; // Initially hide the city list
        @track showCityList = false;
        @track searchCountry = '';
         

        listingImages = [];
        
        @wire(getListingsWithImages, { selectedFilter: '$selectedFilter', minPrice: '$minPrice', maxPrice: '$maxPrice', searchCity: '$cityId', searchCountry:'$countryId' 
        , minBedrooms: '$minBedrooms', minBathrooms: '$minBathrooms', selectedPropertyTypes:'$selectedPropertyTypes'})
        wiredData({ error, data }) {
            if (data) {
                this.Property = data;

                this.listingImages = data.map((listing) => ({
                    id: listing.Id,
                    name: listing.Name,
                    imageUrl: listing.Property_Images__r && listing.Property_Images__r.length > 0
                        ? listing.Property_Images__r
                        : [],
                    bedrooms: listing.No_of_Bedrooms__c,
                    bathrooms: listing.No_of_Bathrooms__c,
                    listingPrice: listing.Listing_Price__c,
                }));

               // console.log('Prorperty All data',JSON.stringify(this.listingImages));
                this.filterPropertyList();
                
            } else if (error) {
                // Handle the error
            }
        }
        
    handlePropertyTypeChange(event) {
        const value = event.target.value;
        console.debug("Selected CheckBox",event.target.value);
        var datatyp = JSON.parse(JSON.stringify(this.selectedPropertyTypes));
        if( event.target.checked == true){
            datatyp.push(value);
        }else{
            datatyp=datatyp.filter(e => e !== value);
        }
        //alert(JSON.stringify(datatyp));
        this.selectedPropertyTypes = datatyp;
        this.propertyTypes = this.propertyTypes.map(type => {
            if (type.value === value) {
                type.checked = event.target.checked;
            }
            return type;
        });

        console.debug('Selected Property Types:',JSON.stringify(this.selectedPropertyTypes));
        console.debug('Updated Property Types:',JSON.stringify(this.propertyTypes));
    }

    handleFilterChange(event) {
        this.selectedFilter = event.target.value;
    }

        
    handleMinBedroomsChange(event) {
        //alert( event.target.value );
        if( event.target.value != ''){
            this.minBedrooms = event.target.value;
            return;
        }
            this.minBedrooms = 0; 
    }
    
    handleMinBathroomsChange(event) {
        if( event.target.value != ''){
            this.minBathrooms = event.target.value;
            return;
        }
        this.minBathrooms = 0;
    }

    handleMinPriceChange(event) {
        if( event.target.value != ''){
            this.minPrice = event.target.value;
            return;
        }
        this.minPrice = 0; 
    }

    handleMaxPriceChange(event) {
        if( event.target.value != '' ){
            this.maxPrice = event.target.value;
            return;
        }
        this.maxPrice = 0;
    }

    applyPropertyTypeFilter() {
       /* if( this.dumminBedrooms >= 0 ){
            if( this.minBedrooms != this.dumminBedrooms ){ 
                this.minBedrooms = this.dumminBedrooms;
            }   
        }

        if(this.dumminBathrooms >= 0 ){
            if( this.minBathrooms != this.dumminBathrooms ){ 
                this.minBathrooms = this.dumminBathrooms;
            }
        }

        if(this.dummaxPrice >= 0 ){
            if( this.maxPrice != this.dummaxPrice ){ 
                this.maxPrice = this.dummaxPrice;
            }
            
        }

        if(this.dumminPrice >= 0 ){
            if( this.minPrice != this.dumminPrice ){ 
                this.minPrice = this.dumminPrice;
            }   
        }*/
    }


    updateMapMarkers(filteredProperties) {
        this.mapCenter = { location: { Country: 'United States' } };
        this.initialZoomLevel = 3;
        this.mapMarkers = filteredProperties.map(property => {
            const location = {
                City: property.City__r ? property.City__r.Name : 'Unknown City',
                Street: property.Street_Name__c? property.Street_Name__c : 'Unknown City',
                Country: property.Country__r ? property.Country__r.Name : 'Unknown Country',
                State: property.State__r ? property.State__r.Name : '',
                Latitude: property.Latitude__c,
                Longitude: property.Longitude__c
            }
            return {
                location,
                icon: 'custom:custom26', // Set your desired icon
                title: property.Name,
                description: property.Status__c,
                value: property.Id,
                recordId: property.Id,
                
            };
        });
    }
        
    handleMarkerSelect(event) {
        console.log('Event Detail:', event.detail);
    
        const selectedRecordId = event.detail.selectedMarkerValue;
        console.log('Selected RecordId:', selectedRecordId);
    
        if (selectedRecordId) {
            console.log('Show selected', selectedRecordId);
    
            // Find the selected marker in the mapMarkers array
            const selectedMarker = this.mapMarkers.find(marker => marker.recordId === selectedRecordId);
    
            // Update map center and zoom level to focus on the selected marker
            this.mapCenter = {
                location: {
                    Street : selectedMarker.location.Street,
                    Country: selectedMarker.location.Country,
                    City: selectedMarker.location.City,
                    State: selectedMarker.location.State,
                    Latitude: selectedMarker.location.Latitude,
                    Longitude: selectedMarker.location.Longitude
                },
            };
            this.selectedMarkerRecord(selectedRecordId);
            console.log('Updated Map Center:', this.mapCenter);
    
            // Optionally adjust the zoom level for a closer view
            this.initialZoomLevel = 18; // Adjust this value as needed
            console.log('Updated Zoom Level:', this.initialZoomLevel);
        } else {
            console.error('RecordId is undefined or null.');
        }
    }

    selectedMarkerRecord(selectedId){
        var recordData = this.listingImages.find(marker => marker.id === selectedId);
        var listDt=[];
        listDt.push(recordData);
        this.listingImages = listDt;
    }
        
        
    filterPropertyList() {

        let filteredProperties = this.Property;
        this.filteredProperty = filteredProperties;
        this.recordsFound = this.filteredProperty.length > 0;
        this.updateMapMarkers(filteredProperties);
    
    }
    
    selectedlistingid(event){
        this.selectedrecid = event.detail;
        this.screen1 = false;    
        this.screen2 = true;
        const selectedMarker = this.mapMarkers.find( marker => marker.recordId === this.selectedrecid );
        // Update map center and zoom level to focus on the selected marker
        this.mapCenter = {
            location: {
                Street : selectedMarker.location.Street,
                Country: selectedMarker.location.Country,
                City: selectedMarker.location.City,
                State: selectedMarker.location.State,
                Latitude: selectedMarker.location.Latitude,
                Longitude: selectedMarker.location.Longitude
            },
        };
        this.initialZoomLevel = 18;
    }

    ongoback(event){
        this.mapCenter = { location: { Country: 'United States' } };
        this.initialZoomLevel = 3;
        this.screen2 = false;
        this.screen1 = true;
        this.filterPropertyList();
    }

      
}