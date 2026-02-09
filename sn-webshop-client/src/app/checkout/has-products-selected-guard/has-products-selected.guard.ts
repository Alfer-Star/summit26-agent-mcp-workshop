import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AbsoluteAppRoutes } from '../../app-routes.enum';
import { CheckoutService } from '../../service/checkout/checkout.service';

@Injectable({
  providedIn: 'root',
})
export class HasProductsSelectedGuard implements CanActivate {
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);


  canActivate(): Observable<boolean> {
    return this.checkoutService.productsInBasket$.pipe(
      first(),
      map((productsInBasket) => {
        return productsInBasket?.length > 0;
      }),
      tap((hasProductsInBasket) => {
        if (!hasProductsInBasket) {
          this.router.navigate([AbsoluteAppRoutes.dashboard]);
        }
      }),
    );
  }
}
