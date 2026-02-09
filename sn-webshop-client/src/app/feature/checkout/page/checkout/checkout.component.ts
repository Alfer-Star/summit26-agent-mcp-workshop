import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DeliveryAddressComponent } from '@checkout/component/delivery-address/delivery-address.component';
import { PaymentTypeComponent } from '@checkout/component/payment-type/payment-type.component';
import { CheckoutProductsComponent } from '@checkout/component/checkout-products/checkout-products.component';
import { ConfirmCheckoutComponent } from '@checkout/component/confirm-checkout/confirm-checkout.component';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { ProductService } from '@shared/service/product/product.service';
import { UserService } from '@shared/service/user/user.service';
import { AbsoluteAppRoutes } from '../../../../app-routes.enum';

@Component({
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    DeliveryAddressComponent,
    PaymentTypeComponent,
    CheckoutProductsComponent,
    ConfirmCheckoutComponent,
    AsyncPipe,
  ],
})
export class CheckoutComponent {
  private readonly checkoutService = inject(CheckoutService);
  private readonly productService = inject(ProductService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly paymentInformation = this.userService.user?.paymentInformation;
  readonly productsInBasket$ = this.checkoutService.productsInBasket$;
  readonly total$ = this.productsInBasket$.pipe(
    map((productsInBasket) => {
      return productsInBasket.reduce((previous, current) => previous + current.quantity * current.product.price, 0);
    }),
  );
  readonly product$ = this.productService.product$;
  readonly user = this.userService.user;

  checkout(): void {
    this.checkoutService.checkout().subscribe(() => {
      this.router.navigate([AbsoluteAppRoutes.checkoutComplete]);
    });
  }

  removeFromBasket(productId: string, amount: number): void {
    this.checkoutService.removeFromBasket(productId, amount);
  }

  clearBasket(): void {
    this.checkoutService.clearBasket();
  }
}
