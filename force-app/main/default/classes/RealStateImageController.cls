/*
public with sharing class RealStateImageController {
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingImages() {
        

        List<Listings__c> listings = [
            SELECT Id, Name,Street_Name__c, Latitude__c,No_of_Bathrooms__c, No_of_Bedrooms__c,Listing_Price__c, Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
            (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r)
            FROM Listings__c limit 20];

      
        return listings;
    }
}*/


// RealStateImageController.cls
public with sharing class RealStateImageController {
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingImages() {
        List<Listings__c> listings = [
            SELECT Id, Name, Street_Name__c, Latitude__c, No_of_Bathrooms__c, No_of_Bedrooms__c, Listing_Price__c,
                Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, 
                Property__r.Property_Type__c, (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r)
            FROM Listings__c LIMIT 20
        ];

        return listings;
    }

    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getFilteredListingImages(Integer minPrice, Integer maxPrice, Integer minBedrooms, Integer minBathrooms) {
        List<Listings__c> listings;

        // Build dynamic SOQL query based on provided filters
        String queryString = 'SELECT Id, Name, Street_Name__c, Latitude__c, No_of_Bathrooms__c, No_of_Bedrooms__c, Listing_Price__c, ' +
            'Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, ' +
            'Property__r.Property_Type__c, (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r) ' +
            'FROM Listings__c WHERE ';

        List<String> conditions = new List<String>();

        if (minPrice != null && maxPrice != null) {
            conditions.add('Listing_Price__c >= ' + minPrice + ' AND Listing_Price__c <= ' + maxPrice);
        }

        if (minBedrooms != null) {
            conditions.add('No_of_Bedrooms__c = ' + minBedrooms);
        }

        if (minBathrooms != null) {
            conditions.add('No_of_Bathrooms__c = ' + minBathrooms);
        }

        if (conditions.size() > 0) {
            queryString += String.join(conditions, ' AND ');
            queryString += ' LIMIT 20';

            listings = Database.query(queryString);

            
        } else {
            // If no filters are provided, fetch all listings
            listings = getListingImages();
        }

        return listings;
    }
}