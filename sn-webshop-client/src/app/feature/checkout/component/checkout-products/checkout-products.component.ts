import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CheckoutProductComponent } from '../checkout-product/checkout-product.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { CheckoutProduct } from '@shared/model/checkout/checkout-product';

@Component({
  selector: 'sn-checkout-products',
  templateUrl: './checkout-products.component.html',
  styleUrls: ['./checkout-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CheckoutProductComponent, TranslocoDirective],
})
export class CheckoutProductsComponent {
  readonly checkoutProducts = input<CheckoutProduct[]>([]);

  readonly quantityChangeForProduct = output<{
    amount: number;
    productId: string;
  }>();

  onQuantityReduce(amount: number, productId: string): void {
    this.quantityChangeForProduct.emit({
      productId,
      amount,
    });
  }
}
