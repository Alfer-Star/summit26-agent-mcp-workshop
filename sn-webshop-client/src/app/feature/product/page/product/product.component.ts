import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductInfoComponent } from '@product/component/product-info/product-info.component';
import { ProductBasketOptionsComponent } from '@product/component/product-basket-options/product-basket-options.component';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { DetailedProduct } from '@shared/model/product/detailed-product';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ProductInfoComponent, ProductBasketOptionsComponent],
})
export class ProductComponent {
  private checkoutService = inject(CheckoutService);
  readonly detailedProduct = input.required<DetailedProduct>();

  readonly productQuantity = computed(() => {
    const product = this.detailedProduct();
    const basket = this.checkoutService.basket();
    return basket.get(product.id)?.quantity ?? 0;
  });

  addToBasket(): void {
    const detailedProduct = this.detailedProduct();
    this.checkoutService.addToBasket(detailedProduct, 1);
  }
}
