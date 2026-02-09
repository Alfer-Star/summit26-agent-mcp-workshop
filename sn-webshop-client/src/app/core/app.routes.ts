import { Routes } from '@angular/router';

import { MainComponent } from './main/page/main/main.component';
import { NotFoundComponent } from './not-found/page/not-found/not-found.component';
import { AbsoluteAppRoutes, RelativeAppRoutes } from './app.routes.enum';
import { adminGuard } from '@shared/guard/admin.guard';
import { authGuard } from '@shared/guard/auth.guard';
import { userGuard } from '@shared/guard/user.guard';
import { LoginComponent } from './login/page/login/login.component';
import { RegistrationComponent } from './registration/page/registration/registration.component';

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
        loadChildren: () => import('../feature/dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
      },
      {
        path: RelativeAppRoutes.admin,
        canMatch: [adminGuard],
        loadChildren: () => import('../core/admin/admin.routes').then((m) => m.AdminRoutes),
      },
      {
        path: RelativeAppRoutes.settings,
        canActivate: [userGuard],
        loadChildren: () => import('../feature/settings/settings.routes').then((m) => m.SettingsRoutes),
      },
      {
        path: RelativeAppRoutes.checkout,
        loadChildren: () => import('../feature/checkout/checkout.routes').then((m) => m.CheckoutRoutes),
        canActivate: [authGuard],
      },
      {
        path: RelativeAppRoutes.product,
        loadChildren: () => import('../feature/product/product.routes').then((m) => m.ProductRoutes),
      },
      {
        path: RelativeAppRoutes.products,
        loadChildren: () => import('../feature/products/products.routes').then((m) => m.ProductsRoutes),
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
