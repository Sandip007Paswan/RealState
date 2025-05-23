// // googleMapForRealState.js
// import { LightningElement, api, track } from 'lwc';
// import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
// import LEAFLET from '@salesforce/resourceUrl/GoogleMapsAPI';

// export default class GoogleMapForRealState extends LightningElement {
//     @api markers; // List of map markers [{ lat, lng, name }, ...]

//     @track map;

//     renderedCallback() {
//         if (this.map) {
//             return;
//         }

//          // Log the markers data received from the parent
//          console.log('Markers Data from Parent:', this.markers);

//         Promise.all([
//             loadScript(this, LEAFLET + '/leaflet.js'),
//             loadStyle(this, LEAFLET + '/leaflet.css')
//         ])
//         .then(() => {
//             console.log('Successfully Loaded Leaflet');
//             this.initializeMap();
//         })
//         .catch(error => {
//             console.error('Error loading Leaflet: ', error);
//         });
//     }

//     initializeMap() {
//         const mapContainer = this.template.querySelector('.map');
//         this.map = L.map(mapContainer).setView([0, 0], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(this.map);

//         // Add markers
//         this.markers.forEach(marker => {
//             L.marker([marker.lat, marker.lng]).addTo(this.map).bindPopup(marker.name);
//         });
//     }
// }


/*
import { LightningElement, wire, track } from 'lwc';
import getListingsByCity from '@salesforce/apex/RealStateDynamicController.getListingsByCity';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/GoogleMapsAPI';

export default class GoogleMapForRealState extends LightningElement {
    mapMarkers = [];
    map;
    @track selectedCity = 'San Francisco'; // Set your desired city

    renderedCallback() {
        if (this.map) {
            return;
        }

        Promise.all([
            loadScript(this, LEAFLET + '/leaflet.js'),
            loadStyle(this, LEAFLET + '/leaflet.css')
        ])
        .then(() => {
            console.log('Successfully Loaded Leaflet');
            this.initializeMap();
        })
        .catch(error => {
            console.error('Error loading Leaflet: ', error);
        });
    }

    @wire(getListingsByCity, { city: '$selectedCity' })
    wiredRealEstateData({ error, data }) {
        if (data) {
            // Process data and create markers as before
            this.mapMarkers = data.map(dataItem => ({
                lat: dataItem.Latitude__c,
                lng: dataItem.Longitude__c,
                title: dataItem.Name
            }));

            // Calculate a more appropriate zoom level
            this.calculateZoomLevel();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.mapMarkers = [];
        }
    }

    initializeMap() {
        const mapContainer = this.template.querySelector('.map');
        this.map = L.map(mapContainer).setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add markers
        this.mapMarkers.forEach(marker => {
            L.marker([marker.lat, marker.lng]).addTo(this.map).bindPopup(marker.title);
        });
    }

    calculateZoomLevel() {
        if (this.mapMarkers.length === 0) {
            return; // No markers to display
        }

        const bounds = L.latLngBounds(this.mapMarkers.map(marker => [marker.lat, marker.lng]));
        this.map.fitBounds(bounds);
    }
}
*/


/*
import { LightningElement, wire, track } from 'lwc';
import getListingsByCity from '@salesforce/apex/RealStateDynamicController.getListingsByCity';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/GoogleMapsAPI';

export default class GoogleMapForRealState extends LightningElement {
    mapMarkers = [];
    map;
    leafletMap;
    @track selectedCity = 'San Francisco'; // Set your desired city

    connectedCallback() {
        Promise.all([
            loadScript(this, LEAFLET + '/leaflet.js'),
            loadStyle(this, LEAFLET + '/leaflet.css')
        ])
        .then(() => {
            console.log('Successfully Loaded Leaflet');
            this.initializeMap();
        })
        .catch(error => {
            console.error('Error loading Leaflet: ', error);
        });
    }

    @wire(getListingsByCity, { city: '$selectedCity' })
    wiredRealEstateData({ error, data }) {
        if (data) {
            // Process data and create markers as before
            console.log('show data', data);
            this.mapMarkers = data.map(dataItem => {
                if (dataItem.Latitude__c && dataItem.Longitude__c) {
                    return {
                        lat: dataItem.Latitude__c,
                        lng: dataItem.Longitude__c,
                        title: dataItem.Name
                    };
                } else {
                    console.error('Invalid coordinates for ' + dataItem.Name);
                    return null;
                }
            }).filter(Boolean);

            // Calculate a more appropriate zoom level
            this.calculateZoomLevel();
        } else if (error) {
            console.error('Error fetching data:', error);
            this.mapMarkers = [];
        }
    }

    initializeMap() {
        const mapContainer = this.template.querySelector('.map');
        if (mapContainer) { // Check if mapContainer is available
            this.leafletMap = L.map(mapContainer).setView([51.505, -0.09], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.leafletMap);

            // Add markers
            this.mapMarkers.forEach(marker => {
                L.marker([marker.lat, marker.lng]).addTo(this.leafletMap).bindPopup(marker.title);
            });
        }
    }

    calculateZoomLevel() {
        if (this.mapMarkers.length > 0) {
            const bounds = L.latLngBounds(this.mapMarkers.map(marker => [marker.lat, marker.lng]));
            this.leafletMap.fitBounds(bounds);
        }
    }
    
}

*/



import { LightningElement, wire, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import LEAFLET from '@salesforce/resourceUrl/GoogleMapsAPI';

export default class GoogleMapForRealState extends LightningElement {

    renderedCallback() {
        Promise.all([
            loadScript(this, LEAFLET + '/leaflet.js'),
            loadStyle(this, LEAFLET + '/leaflet.css')
        ])
        .then(() => {
            console.log('Successfully Loaded Leaflet');
            this.initializeMap();
        })
        .catch(error => {
            console.error('Error loading Leaflet: ', error);
        });
    }

    initializeMap() {
        const mapContainer = this.template.querySelector('.map');
        const map = L.map(mapContainer).setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18, // Change "maxzoom" to "maxZoom"
        }).addTo(map);

        // Add a marker
        L.marker([51.5, -0.09]).addTo(map);
    }
}