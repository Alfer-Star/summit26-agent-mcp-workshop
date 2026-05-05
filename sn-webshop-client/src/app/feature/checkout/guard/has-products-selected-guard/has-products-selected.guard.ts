import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { CheckoutService } from '@shared/service/checkout/checkout.service';

export const hasProductsSelectedGuard: CanActivateFn = () => {
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);
  const transloco = inject(TranslocoService);

  // Fast path: in-memory basket already has items (user added them in this session)
  if (checkoutService.productsInBasket().length > 0) {
    return true;
  }

  // Slow path: basket is empty in memory — check the server for externally added items
  // (e.g. added by an AI / MCP agent while the user was away)
  return checkoutService.loadFromServer(transloco.getActiveLang()).pipe(
    map(() => {
      if (checkoutService.productsInBasket().length > 0) {
        return true;
      }
      router.navigate([AbsoluteAppRoutes.dashboard]);
      return false;
    }),
    catchError(() => {
      router.navigate([AbsoluteAppRoutes.dashboard]);
      return of(false);
    }),
  );
};
