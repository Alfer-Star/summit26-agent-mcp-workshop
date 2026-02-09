import { SettingsComponent } from './settings/settings.component';
import { Routes } from '@angular/router';
import { AbsoluteAppRoutes, RelativeAppRoutes } from './app-routes.enum';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: RelativeAppRoutes.main,
    pathMatch: 'full',
  },
  {
    path: RelativeAppRoutes.main,
    children: [
      {
        path: '',
        redirectTo: RelativeAppRoutes.dashboard,
        pathMatch: 'full',
      },
      {
        path: RelativeAppRoutes.dashboard,
        component: DashboardComponent,
      },
      {
        path: RelativeAppRoutes.admin,
        component: AdminComponent,
      },
      {
        path: RelativeAppRoutes.settings,
        component: SettingsComponent,
      },
      {
        path: RelativeAppRoutes.product,
        children: [{ path: RelativeAppRoutes.productId, component: ProductComponent }],
      },
      {
        path: RelativeAppRoutes.products,
        children: [
          {
            path: RelativeAppRoutes.productsId,
            component: ProductsComponent,
          },
          {
            path: RelativeAppRoutes.productsSearch,
            component: ProductsComponent,
          },
        ],
      },
      {
        path: RelativeAppRoutes.checkout,
        children: [
          {
            path: '',
            component: CheckoutComponent,
          },
          {
            path: RelativeAppRoutes.checkoutComplete,
            component: CheckoutCompleteComponent,
          },
        ],
      },
    ],
  },
  {
    path: RelativeAppRoutes.login,
    component: LoginComponent,
  },
  {
    path: RelativeAppRoutes.login + '/:redirectPath',
    component: LoginComponent,
  },
  {
    path: AbsoluteAppRoutes.registration,
    component: RegistrationComponent,
  },
  {
    path: RelativeAppRoutes.notFound,
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
