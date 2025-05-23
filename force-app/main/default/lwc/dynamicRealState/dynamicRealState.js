/* 
 import { LightningElement, wire ,track} from 'lwc';
import getListingImage from '@salesforce/apex/RealStateImageController.getListingImages';

export default class DynamicRealState extends LightningElement {


    listingImages = [];

    @track minPrice;
    @track maxPrice;


    @wire(getListingImage)
    wiredTeachers({ error, data }) {
        if (data) {
            this.listingImages = data.map((listing) => ({
                id: listing.Id,
                name: listing.Name,
                imageUrl: listing.Property_Images__r && listing.Property_Images__r.length > 0
                    ? listing.Property_Images__r.map(image => image.Property_Image_URL__c)
                    : [],
               bedrooms: listing.No_of_Bedrooms__c,
               bathrooms: listing.No_of_Bathrooms__c,
               listingPrice: listing.Listing_Price__c,
            }));
        } else if (error) {
            console.error('Error fetching listing images', error);
        }
    }

    applyFilter() {
        // Call the Apex method with the provided minimum and maximum prices
        getListingImage({ minPrice: this.minPrice, maxPrice: this.maxPrice })
            .then(result => {
                // Process the result as needed
            })
            .catch(error => {
                console.error('Error fetching listing images', error);
            });
    }

  
}
*/


// DynamicRealState.js
import { LightningElement, wire, track } from 'lwc';
import getListingImage from '@salesforce/apex/RealStateImageController.getListingImages';
import getFilteredListingImages from '@salesforce/apex/RealStateImageController.getFilteredListingImages';

export default class DynamicRealState extends LightningElement {
    listingImages = [];
    @track minPrice;
    @track maxPrice;
    @track minBedrooms;
    @track minBathrooms;

    @wire(getListingImage)
    wiredTeachers({ error, data }) {
        if (data) {
           

            this.listingImages = data.map((listing) => ({
                id: listing.Id,
                name: listing.Name,
                imageUrl: listing.Property_Images__r && listing.Property_Images__r.length > 0
                    ? listing.Property_Images__r.map(image => image.Property_Image_URL__c)
                    : [],
                bedrooms: listing.No_of_Bedrooms__c,
                bathrooms: listing.No_of_Bathrooms__c,
                listingPrice: listing.Listing_Price__c,
            }));
        } else if (error) {
            console.error('Error fetching listing images', error);
        }
    }

    applyFilter() {
        let filters = {
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            minBedrooms: this.minBedrooms,
            minBathrooms: this.minBathrooms
        };
    
        // Remove empty filters
        filters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ''));
    
        // Call the Apex method only if there are non-empty filters
        if (Object.keys(filters).length > 0) {
            getFilteredListingImages(filters)
                .then(result => {
                    this.listingImages = result.map((listing) => ({
                        id: listing.Id,
                        name: listing.Name,
                        imageUrl: listing.Property_Images__r && listing.Property_Images__r.length > 0
                            ? listing.Property_Images__r.map(image => image.Property_Image_URL__c)
                            : [],
                        bedrooms: listing.No_of_Bedrooms__c,
                        bathrooms: listing.No_of_Bathrooms__c,
                        listingPrice: listing.Listing_Price__c,
                    }));
                })
                .catch(error => {
                    console.error('Error fetching filtered listing images', error);
                });
        } else {
            // If all filters are empty, fetch all listings
            this.fetchAllListings();
        }
    }

    fetchAllListings() {
        // Call the Apex method to fetch all listings
        getListingImage()
            .then(result => {
                this.listingImages = result.map((listing) => ({
                    id: listing.Id,
                    name: listing.Name,
                    imageUrl: listing.Property_Images__r && listing.Property_Images__r.length > 0
                        ? listing.Property_Images__r.map(image => image.Property_Image_URL__c)
                        : [],
                    bedrooms: listing.No_of_Bedrooms__c,
                    bathrooms: listing.No_of_Bathrooms__c,
                    listingPrice: listing.Listing_Price__c,
                }));
            })
            .catch(error => {
                console.error('Error fetching all listing images', error);
            });
    }

    handleMinPriceChange(event) {
        this.minPrice = event.target.value;
    }

    handleMaxPriceChange(event) {
        this.maxPrice = event.target.value;
    }

    handleMinBedroomsChange(event) {
        this.minBedrooms = event.target.value;
    }

    handleMinBathroomsChange(event) {
        this.minBathrooms = event.target.value;
    }
}