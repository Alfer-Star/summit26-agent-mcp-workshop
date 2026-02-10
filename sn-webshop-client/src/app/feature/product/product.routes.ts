import { Routes } from '@angular/router';
import { RelativeAppRoutes } from '@core/app.routes.enum';
import { ProductComponent } from './page/product/product.component';
import { productResolver } from './resolver/product.resolver';

export const ProductRoutes: Routes = [
  {
    path: RelativeAppRoutes.productId,
    component: ProductComponent,
    resolve: { detailedProduct: productResolver },
  },
];
