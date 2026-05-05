import { Routes } from '@angular/router';
import { ProductsComponent } from './page/products/products.component';
import { RelativeAppRoutes } from '@core/app.routes.enum';
import { productsResolver } from './resolver/products.resolver';

export const ProductsRoutes: Routes = [
  {
    path: RelativeAppRoutes.productsId,
    component: ProductsComponent,
    resolve: {
      products: productsResolver,
    },
  },
  {
    path: RelativeAppRoutes.productsSearch,
    component: ProductsComponent,
  },
];
