import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { first, switchMap } from 'rxjs/operators';
import { ProductService } from '../service/product/product.service';
import { CheckoutService } from '../service/checkout/checkout.service';
import { ProductBasketOptionsComponent } from './product-basket-options/product-basket-options.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ProductInfoComponent, ProductBasketOptionsComponent, AsyncPipe],
})
export class ProductComponent {
  private readonly productService = inject(ProductService);
  private readonly checkoutService = inject(CheckoutService);
  readonly product$ = this.productService.product$;
  readonly products$ = this.productService.products$;
  readonly productQuantity$ = this.product$.pipe(switchMap((product) => this.checkoutService.getQuantity(product.id)));

  addToBasket(): void {
    this.product$.pipe(first()).subscribe((detailedProduct) => {
      this.checkoutService.addToBasket(detailedProduct, 1);
    });
  }
}
