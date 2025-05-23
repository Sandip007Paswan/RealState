// import { LightningElement, api } from 'lwc';

// const CARD_VISIBLE_CLASSES = 'fade slds-show';
// const CARD_HIDDEN_CLASSES = 'fade slds-hide';
// const DOT_VISIBLE_CLASSES = 'dot active';
// const DOT_HIDDEN_CLASSES = 'dot';

// const DEFAULT_SLIDER_TIMER = 3000;  // 3 seconds
// const DEFAULT_SLIDER_WIDTH = 800;

// export default class SlideCustomCarouselChild extends LightningElement {
//     slideIndex = 1;
//     slides = [];
//     timer;

//     @api slideTimer = DEFAULT_SLIDER_TIMER;
//     @api enableAutoScroll = false;
//     @api customWidth = DEFAULT_SLIDER_WIDTH;

//     @api
//     get slidesData() {
//         return this.slides;
//     }

//     set slidesData(data) {
//         this.slides = data.map((item, index) => ({
//             ...item,
//             slideIndex: index + 1,
//             cardClasses: index === 0 ? CARD_VISIBLE_CLASSES : CARD_HIDDEN_CLASSES,
//             dotClasses: index === 0 ? DOT_VISIBLE_CLASSES : DOT_HIDDEN_CLASSES,
//         }));
//     }

//     connectedCallback() {
//         if (this.enableAutoScroll) {
//             this.timer = setInterval(() => {
//                 this.slideSelectionHandler(this.slideIndex + 1);
//             }, Number(this.slideTimer));
//         }
//     }

//     disconnectedCallback() {
//         if (this.enableAutoScroll) {
//             clearInterval(this.timer);
//         }
//     }

//     currentSlide(event) {
//         let slideIndex = Number(event.target.dataset.id);
//         this.slideSelectionHandler(slideIndex);
//     }

//     backSlide() {
//         let slideIndex = this.slideIndex - 1;
//         this.slideSelectionHandler(slideIndex);
//     }

//     forwardSlide() {
//       let slideIndex = this.slideIndex + 1;
//       this.slideSelectionHandler(slideIndex);
//   }

//     slideSelectionHandler(id) {
//         if (id > this.slides.length) {
//             this.slideIndex = 1;
//         } else if (id < 1) {
//             this.slideIndex = this.slides.length;
//         } else {
//             this.slideIndex = id;
//         }

//         this.slides = this.slides.map(item => ({
//             ...item,
//             cardClasses: this.slideIndex === item.slideIndex ? CARD_VISIBLE_CLASSES : CARD_HIDDEN_CLASSES,
//             dotClasses: this.slideIndex === item.slideIndex ? DOT_VISIBLE_CLASSES : DOT_HIDDEN_CLASSES,
//         }));
//     }
// }



import { LightningElement, api } from 'lwc';

export default class SlideCustomCarouselChild extends LightningElement {
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
   
    
    set slidesData(data) {
        this.slides = data.map((item, index) => ({
            ...item,
            slideIndex: index + 1,
            cardClasses: index === 0 ? 'fade slds-show' : 'fade slds-hide',
            dotClasses: index === 0 ? 'dot active' : 'dot',
            image: item.images.length > 0 ? item.images[0] : '' // Set the image attribute
        }));
    }
    
   /*
    set slidesData(data) {
       
        this.slides = data.map((item, index) => ({
            ...item,
            slideIndex: index + 1,
            cardClasses: index === 0 ? 'fade slds-show' : 'fade slds-hide',
            dotClasses: index === 0 ? 'dot active' : 'dot',
        }));
        console.log("show Data",data);
        console.log('Slides Data:', this.slides);
    }
   */

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