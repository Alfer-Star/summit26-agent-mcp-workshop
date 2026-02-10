import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ProductInfoComponent } from '@product/component/product-info/product-info.component';
import { ProductBasketOptionsComponent } from '@product/component/product-basket-options/product-basket-options.component';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { DetailedProduct } from '@shared/model/product/detailed-product';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ProductInfoComponent, ProductBasketOptionsComponent, AsyncPipe],
})
export class ProductComponent {
  private readonly checkoutService = inject(CheckoutService);

  readonly detailedProduct = input.required<DetailedProduct>();

  readonly quantity$ = toObservable(this.detailedProduct).pipe(
    switchMap((product) => {
      return this.checkoutService.getQuantity(product.id);
    }),
  );

  addToBasket(): void {
    const detailedProduct = this.detailedProduct();
    this.checkoutService.addToBasket(detailedProduct, 1);
  }
}
