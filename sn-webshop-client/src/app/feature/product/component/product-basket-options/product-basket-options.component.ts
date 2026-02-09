import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DetailedProduct } from '@shared/model/product/detailed-product';

@Component({
  selector: 'sn-product-basket-options',
  templateUrl: './product-basket-options.component.html',
  styleUrls: ['./product-basket-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, TranslocoDirective],
})
export class ProductBasketOptionsComponent {
  readonly product = input.required<DetailedProduct>();
  readonly productQuantity = input.required<number>();
  readonly addClick = output();
}
