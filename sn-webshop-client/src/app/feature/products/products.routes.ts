import { Routes } from '@angular/router';
import { ProductsComponent } from './page/products/products.component';
import { RelativeAppRoutes } from '@core/app.routes.enum';

export const ProductsRoutes: Routes = [
  {
    path: RelativeAppRoutes.productsId,
    component: ProductsComponent,
  },
  {
    path: RelativeAppRoutes.productsSearch,
    component: ProductsComponent,
  },
];
