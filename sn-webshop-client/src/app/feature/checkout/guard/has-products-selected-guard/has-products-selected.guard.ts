import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { first, map, tap } from 'rxjs/operators';

export const hasProductsSelectedGuard: CanActivateFn = () => {
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);

  return checkoutService.productsInBasket$.pipe(
    first(),
    map((productsInBasket) => {
      return productsInBasket?.length > 0;
    }),
    tap((hasProductsInBasket) => {
      if (!hasProductsInBasket) {
        router.navigate([AbsoluteAppRoutes.dashboard]);
      }
    }),
  );
};
