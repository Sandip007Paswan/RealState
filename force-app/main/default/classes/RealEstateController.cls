public class RealEstateController {
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingImages() {
        List<Listings__c> listings = [
            SELECT Id, Name, Latitude__c, Longitude__c, No_of_Bathrooms__c, No_of_Bedrooms__c, Listing_Price__c,
                City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
                Country__r.Name, (SELECT Id, Property_Image_URL__c FROM Property_Images__r)
            FROM Listings__c LIMIT 20
        ];

        return listings;
    }
  /*
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getFilteredListingImages(Integer minPrice, Integer maxPrice, Integer minBedrooms, Integer minBathrooms, String selectedFilter, String searchCity, String searchCountry) {
        List<Listings__c> listings;

        // Build dynamic SOQL query based on provided filters
        String queryString = 'SELECT Id, Name, Latitude__c, Longitude__c, No_of_Bathrooms__c, No_of_Bedrooms__c, Listing_Price__c, ' +
            'City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, ' +
            'Property__r.Property_Type__c, Country__r.Name, (SELECT Id, Property_Image_URL__c FROM Property_Images__r) ' +
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

        if (selectedFilter != null && selectedFilter != 'All') {
            conditions.add('Property__r.Status__c = \'' + selectedFilter + '\'');
        }

        if (searchCity != null && !String.isBlank(searchCity.trim())) {
            conditions.add('City__r.Name LIKE \'' + searchCity + '\'');
        }

        if (searchCountry != null && !String.isBlank(searchCountry.trim())) {
            conditions.add('Country__r.Name LIKE \'' + searchCountry + '\'');
        }

        if (conditions.size() > 0) {
            queryString += String.join(conditions, ' AND ');
            queryString += ' LIMIT 50';

            listings = Database.query(queryString);
        } else {
            // If no filters are provided, fetch all listings
            listings = getListingImages();
        }

        return listings;
    }
   */
   
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingsWithImages(String selectedFilter, Decimal minPrice, Decimal maxPrice, String searchCity, String searchCountry ,Integer minBedrooms , Integer minBathrooms, List<String> selectedPropertyTypes) {
        // Add a debug statement to log the input parameters
        System.debug('selectedFilter: ' + selectedFilter);
        System.debug('minPrice: ' + minPrice);
        System.debug('maxPrice: ' + maxPrice);
        System.debug('searchCity: ' + searchCity);
		System.debug('selectedPropertyTypes: ' + selectedPropertyTypes.size());
        String soqlQuery = 'SELECT Id, Name, Latitude__c, Longitude__c, No_of_Bathrooms__c, No_of_Bedrooms__c,Listing_Price__c,Street_Name__c, ' +
            '(SELECT Id,Name, Property_Image_URL__c, Image__c FROM Property_Images__r), ' +
            'City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,Country__r.Name ' +
            'FROM Listings__c';
		soqlQuery += ' WHERE No_of_Bathrooms__c >= :minBathrooms AND No_of_Bedrooms__c >= :minBedrooms AND Listing_Price__c >=:minPrice';
           
        if (selectedFilter != 'All') {
            soqlQuery += ' AND Property__r.Status__c = :selectedFilter ';
        } 
        
        if( selectedPropertyTypes.size() > 0 ){
            soqlQuery += ' AND Property__r.Property_Type__c IN : selectedPropertyTypes';
        }
                                                             
        if (maxPrice > 0) {
            soqlQuery += ' AND Listing_Price__c <:maxPrice ';
        }        
        if (!String.isEmpty(searchCity) && searchCity != 'blank' ) {
           // soqlQuery += ' WHERE City__r.Name = :searchCity';
            soqlQuery += ' AND City__c =:searchCity';
        }
		if(!String.isEmpty(searchCountry) &&  searchCountry != 'blank' ){
            soqlQuery += ' AND Country__c  =:searchCountry';
        }
        
        
        // Add a debug statement to log the SOQL query
        System.debug('SOQL Query: ' + soqlQuery);

        soqlQuery += ' LIMIT 50';

        List<Listings__c> listingData = Database.query(soqlQuery);
		System.debug('SOQL Query: ' + listingData.Size());
        // Add a debug statement to log the results
       // System.debug('Listing Data: ' + listingData);

        return listingData;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<String> getAllCityNames() {
        List<String> cityNames = new List<String>();

        for (AggregateResult ar : [
            SELECT City__r.Name cityName FROM Listings__c WHERE City__c != null GROUP BY City__r.Name
        ]) {
            String cityName = String.valueOf(ar.get('cityName'));
            cityNames.add(cityName);
        }

        return cityNames;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getAllCountryNames() {
        List<String> countryNames = new List<String>();

        for (AggregateResult ar : [
            SELECT Country__r.Name countryName FROM Listings__c WHERE Country__c != null GROUP BY Country__r.Name
        ]) {
            String countryName = String.valueOf(ar.get('countryName'));
            countryNames.add(countryName);
        }

        return countryNames;
    }
}