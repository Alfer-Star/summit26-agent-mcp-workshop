import { Routes } from '@angular/router';
import { AbsoluteAppRoutes, RelativeAppRoutes } from './app-routes.enum';
import { MainComponent } from '@core/main/page/main/main.component';
import { AdminComponent } from '@core/admin/page/admin/admin.component';
import { CheckoutComponent } from '@checkout/page/checkout/checkout.component';
import { CheckoutCompleteComponent } from '@checkout/page/checkout-complete/checkout-complete.component';
import { LoginComponent } from '@core/login/page/login/login.component';
import { RegistrationComponent } from '@core/registration/page/registration/registration.component';
import { NotFoundComponent } from '@core/not-found/page/not-found/not-found.component';
import { DashboardComponent } from '@dashboard/page/dashboard/dashboard.component';
import { SettingsComponent } from '@settings/page/settings/settings.component';
import { ProductComponent } from '@product/page/product/product.component';
import { ProductsComponent } from '@products/page/products/products.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: RelativeAppRoutes.main,
    pathMatch: 'full',
  },
  {
    path: RelativeAppRoutes.main,
    component: MainComponent,
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
