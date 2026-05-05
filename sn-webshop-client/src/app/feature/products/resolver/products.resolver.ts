import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Product } from '@shared/model/product/product';
import { ProductService } from '@shared/service/product/product.service';
import { EMPTY } from 'rxjs';
import { first } from 'rxjs/operators';

export const productsResolver: ResolveFn<Product[]> = (route, state) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id');
  if (!id) {
    return EMPTY;
  }
  productService.fetchProducts(id);
  return productService.products$.pipe(first());
};
