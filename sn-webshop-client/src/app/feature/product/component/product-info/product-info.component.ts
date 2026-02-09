import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RatingComponent } from '@shared/component/rating/rating.component';
import { DetailedProduct } from '@shared/model/product/detailed-product';

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
