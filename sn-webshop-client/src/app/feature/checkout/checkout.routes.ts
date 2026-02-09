import { Routes } from '@angular/router';
import { RelativeAppRoutes } from '@core/app.routes.enum';
import { hasProductsSelectedGuard } from './guard/has-products-selected-guard/has-products-selected.guard';
import { CheckoutCompleteComponent } from './page/checkout-complete/checkout-complete.component';
import { CheckoutComponent } from './page/checkout/checkout.component';

export const CheckoutRoutes: Routes = [
  { path: '', component: CheckoutComponent, canActivate: [hasProductsSelectedGuard] },
  {
    path: RelativeAppRoutes.checkoutComplete,
    component: CheckoutCompleteComponent,
    canActivate: [hasProductsSelectedGuard],
  },
];
