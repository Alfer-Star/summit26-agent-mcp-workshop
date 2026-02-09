import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sn-rating',
  templateUrl: './rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RatingComponent {
  static readonly MAX_RATING = 5;
  static readonly STAR_FILLED = '★';
  static readonly STAR_EMPTY = '☆';

  private _displayedRating = '';

  get displayedRating(): string {
    return this._displayedRating;
  }

  @Input() set rating(rating: number) {
    this._displayedRating = '';

    for (let i = 0; i < rating; i++) {
      this._displayedRating += RatingComponent.STAR_FILLED;
    }

    for (let i = rating; i < RatingComponent.MAX_RATING; i++) {
      this._displayedRating += RatingComponent.STAR_EMPTY;
    }
  }

  constructor() {
    this.rating = 0;
  }
}
