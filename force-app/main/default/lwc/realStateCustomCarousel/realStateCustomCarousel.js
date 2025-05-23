import { LightningElement } from 'lwc';
import ImageHeader from '@salesforce/resourceUrl/RealStateImage';

export default class RealStateCustomCarousel extends LightningElement {

      slides = [
        {
          image : ImageHeader + '/RealStateImage/Image2.jpg.jpg',
          heading:'Valuehub 1',
          description : 'You Are Employee Of the Valuehub'

        },

        {
          image : ImageHeader + '/RealStateImage/Image5.jpg.jpg',
          heading:'Valuehub 2',
          description : 'You Are Employee Of the Valuehub'
        },

        {
            image : ImageHeader + '/RealStateImage/Image7.jpg.jpg',
            heading:'Valuehub 3',
            description : 'You Are Employee Of the Valuehub'
        },
        {
            image : ImageHeader + '/RealStateImage/Image8.jpg.jpg',
            heading:'Valuehub 4',
            description : 'You Are Employee Of the Valuehub'
        }
    ]
}