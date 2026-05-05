import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductService } from '@shared/service/product/product.service';
import { zip } from 'rxjs';
import { first } from 'rxjs/operators';
import { ProductGroup } from '@shared/model/product/product-group';
import { ProductGroupGalleryItem } from '@shared/model/product/product-group-gallery-item';

export const dashboardResolver: ResolveFn<[ProductGroup[], ProductGroupGalleryItem[]]> = (route, state) => {
  const productService = inject(ProductService);
  productService.fetchProductGroups();
  productService.fetchProductGroupGalleryItems();

  return zip(productService.productGroups$.pipe(first()), productService.productGroupGalleryItems$.pipe(first()));
};
