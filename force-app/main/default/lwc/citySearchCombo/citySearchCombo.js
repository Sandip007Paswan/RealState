import { LightningElement, track, wire } from 'lwc';
import getCityNames from '@salesforce/apex/RealEstateController.getAllCityNames';

export default class CitySearchCombo extends LightningElement {
    @track cityOptions = [];
    @track filteredCityOptions = [];
    @track searchInput = '';

    @wire(getCityNames)
    wiredCityNames({ error, data }) {
        if (data) {
            this.cityOptions = data.map(cityName => ({ label: cityName, value: cityName }));
        } else if (error) {
            // Handle the error
        }
    }

    handleSearchInputChange(event) {
        this.searchInput = event.target.value;
        this.filterCityOptions();
    }

    filterCityOptions() {
        // Use this method to filter the city options based on the searchInput.
        this.filteredCityOptions = this.cityOptions.filter(option =>
            option.label.toLowerCase().includes(this.searchInput.toLowerCase())
        );
    }

    handleCitySelection(event) {
        this.searchInput = event.target.dataset.value;
        this.filteredCityOptions = []; // Hide the dropdown after selection or clear search
        // You can perform other actions based on the selected city if needed.
    }
}