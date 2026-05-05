import { animate, style, transition, trigger } from '@angular/animations';

export const galleryAnimations = [
  trigger('fade', [
    transition('void => *', [style({ opacity: 0 }), animate(250, style({ opacity: 1 }))]),
    transition('* => void', [animate(250, style({ opacity: 0 }))]),
  ]),
];
