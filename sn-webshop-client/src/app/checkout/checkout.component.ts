import { AbsoluteAppRoutes } from '../app-routes.enum';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CheckoutService } from '../service/checkout/checkout.service';
import { ProductService } from '../service/product/product.service';
import { UserService } from '../service/user/user.service';
import { ConfirmCheckoutComponent } from './confirm-checkout/confirm-checkout.component';
import { CheckoutProductsComponent } from './checkout-products/checkout-products.component';
import { PaymentTypeComponent } from '../payment-type/payment-type.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

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
    AsyncPipe
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
