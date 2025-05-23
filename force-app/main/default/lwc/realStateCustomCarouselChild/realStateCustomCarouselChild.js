import { LightningElement, api } from 'lwc';

export default class RealStateCustomCarouselChild extends LightningElement {
    slideIndex = 1;
    slides = [];
    timer;

    @api slideTimer = 5000; // Decreased timer for testing purposes
    @api enableAutoScroll = false;
    @api customWidth = 800;

    @api
    get slidesData() {
        return this.slides;
    }


  /*
    set slidesData(data) {
        this.slides = data.map((item, index) => ({
            ...item,
            slideIndex: index + 1,
            cardClasses: index === 0 ? 'fade slds-show' : 'fade slds-hide',
            dotClasses: index === 0 ? 'dot active' : 'dot',
            image: item.images.length > 0 ? item.images[0] : '' // Set the image attribute
        }));
    }
    */
   
  
    set slidesData(data) {
       
        this.slides = data.map((item, index) => ({
            ...item,
            slideIndex: index + 1,
            cardClasses: index === 0 ? 'fade slds-show' : 'fade slds-hide',
            dotClasses: index === 0 ? 'dot active' : 'dot',
        }));
      
    }

    connectedCallback() {
        console.log('enableAutoScroll:', this.enableAutoScroll);
        if (this.enableAutoScroll) {
            this.timer = setInterval(() => {
                this.slideSelectionHandler(this.slideIndex + 1);
            }, this.slideTimer);
        }
    }

    disconnectedCallback() {
        if (this.enableAutoScroll) {
            clearInterval(this.timer);
        }
    }

    currentSlide(event) {
        let slideIndex = Number(event.target.dataset.id);
        this.slideSelectionHandler(slideIndex);
    }

    backSlide() {
        let slideIndex = this.slideIndex - 1;
        this.slideSelectionHandler(slideIndex);
    }

    forwardSlide() {
        let slideIndex = this.slideIndex + 1;
        this.slideSelectionHandler(slideIndex);
    }

    slideSelectionHandler(id) {
        if (id > this.slides.length) {
            this.slideIndex = 1;
        } else if (id < 1) {
            this.slideIndex = this.slides.length;
        } else {
            this.slideIndex = id;
        }

        this.slides = this.slides.map(item => ({
            ...item,
            cardClasses: this.slideIndex === item.slideIndex ? 'fade slds-show' : 'fade slds-hide',
            dotClasses: this.slideIndex === item.slideIndex ? 'dot active' : 'dot',
        }));

        console.log('Slides after Selection:', this.slides);
    }
}