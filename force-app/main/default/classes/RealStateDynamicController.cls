// public with sharing class RealStateDynamicController {
//     @AuraEnabled(cacheable=true)
//     public static List<ListingWithImages> getListingsWithImages() {
//         List<ListingWithImages> listingDataList = new List<ListingWithImages>();

//         List<Listings__c> listings = [SELECT Id, Name, Latitude__c, Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
//             (SELECT Id, Image__c,Property_Image_URL__c FROM Property_Images__r) FROM Listings__c limit 100] ;

//         for (Listings__c listing : listings) {
//             ListingWithImages listingData = new ListingWithImages();
//             listingData.Id = listing.Id;
//             listingData.Name = listing.Name;
          
//             listingData.City = listing.City__r.Name;
//             listingData.State = listing.State__r.Name;
//             listingData.PropertyName = listing.Property__r.Name;
//             listingData.Status = listing.Property__r.Status__c;
//             listingData.PropertyType = listing.Property__r.Property_Type__c;

//             for (Property_Image__c image : listing.Property_Images__r) {
//                 listingData.ImageURLs.add(image.Image__c);
//             }

//             listingDataList.add(listingData);
//         }

//         return listingDataList;
//     }

//     public class ListingWithImages {
//         @AuraEnabled
//         public String Id { get; set; }
//         @AuraEnabled
//         public String Name { get; set; }

//         @AuraEnabled
//         public String City { get; set; }
//         @AuraEnabled
//         public String State { get; set; }
//         @AuraEnabled
//         public String PropertyName { get; set; }
//         @AuraEnabled
//         public String Status { get; set; }
//         @AuraEnabled
//         public String PropertyType { get; set; }
//         @AuraEnabled
//         public List<String> ImageURLs { get; set; }

//         public ListingWithImages() {
//             ImageURLs = new List<String>();
//         }
//     }
// }


// public with sharing class RealStateDynamicController {
//     @AuraEnabled(cacheable=true)
//     public static List<Listings__c> getListingsWithImages() {
//         List<Listings__c> listingDataList = new List<Listings__c>();

//         List<Listings__c> listings = [
//             SELECT Id, Name, Latitude__c, Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
//             (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r)
//             FROM Listings__c
//         ];

//         // Populate listingDataList with the queried data
//         listingDataList.addAll(listings);
      
//         return listingDataList;
//     }
// }


// public with sharing class RealStateDynamicController {
//     @AuraEnabled(cacheable=true)
//     public static List<Listings__c> getListingsByCity(String city) {
//         List<Listings__c> listingDataList = new List<Listings__c>();

//         List<Listings__c> listings = [
//             SELECT Id, Name, Latitude__c, Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
//             (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r)
//             FROM Listings__c
//             WHERE City__r.Name = :city
//         ];

//         // Populate listingDataList with the filtered data
//         listingDataList.addAll(listings);
      
//         return listingDataList;
//     }
//}


/*
public with sharing class RealStateDynamicController {
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingsByCity(String city) {
        List<Listings__c> listingDataList = new List<Listings__c>();

        List<Listings__c> listings = [
            SELECT Id, Name, City__r.Name, Latitude__c, Longitude__c
            FROM Listings__c
            WHERE City__r.Name = :city
        ];

        // Populate listingDataList with the filtered data
        listingDataList.addAll(listings);

        return listingDataList;
    }
}
*/


public with sharing class RealStateDynamicController {
    @AuraEnabled(cacheable=true)
    public static List<Listings__c> getListingsByCity() {
        

        List<Listings__c> listings = [
            SELECT Id, Name,Street_Name__c, Latitude__c, Longitude__c, City__r.Name, State__r.Name, Property__r.Name, Property__r.Status__c, Property__r.Property_Type__c,
            (SELECT Id, Image__c, Property_Image_URL__c FROM Property_Images__r)
            FROM Listings__c];

      
        return listings;
    }
}