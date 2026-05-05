import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '@shared/service/product/product.service';
import { EMPTY } from 'rxjs';
import { first } from 'rxjs/operators';
import { Product } from '@shared/model/product/product';

export const productResolver: ResolveFn<Product> = (route, state) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id');
  if (!id) {
    return EMPTY;
  }
  productService.fetchProduct(id);
  return productService.product$.pipe(first());
};
