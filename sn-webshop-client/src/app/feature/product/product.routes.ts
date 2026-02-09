import { Routes } from '@angular/router';
import { RelativeAppRoutes } from '@core/app.routes.enum';
import { ProductComponent } from './page/product/product.component';

export const ProductRoutes: Routes = [
  {
    path: RelativeAppRoutes.productId,
    component: ProductComponent,
  },
];
