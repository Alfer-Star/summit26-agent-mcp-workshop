import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DetailedProduct } from '../../model/product/detailed-product';
import { RatingComponent } from '../../rating/rating.component';

@Component({
  selector: 'sn-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RatingComponent],
})
export class ProductInfoComponent {
  readonly product = input.required<DetailedProduct>();
}
