import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { CheckoutService } from '@shared/service/checkout/checkout.service';

export const hasProductsSelectedGuard: CanActivateFn = () => {
   const checkoutService = inject(CheckoutService);
  const router = inject(Router);
  const productsInBasket = checkoutService.productsInBasket();
  if (productsInBasket.length > 0) {
    return true;
  } else {
    router.navigate([AbsoluteAppRoutes.dashboard]);
    return false;
  }
};
