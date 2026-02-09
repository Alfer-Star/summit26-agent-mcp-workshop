import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { galleryAnimations } from './gallery.component.animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sn-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [galleryAnimations],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class GalleryComponent {
  readonly imageUrls = input<string[]>([]);

  active = 0;

  nextImage(): void {
    if (this.active + 1 >= this.imageUrls().length) {
      this.active = 0;
    } else {
      this.active += 1;
    }
  }

  previousImage(): void {
    if (this.active - 1 < 0) {
      this.active = this.imageUrls().length - 1;
    } else {
      this.active -= 1;
    }
  }
}
