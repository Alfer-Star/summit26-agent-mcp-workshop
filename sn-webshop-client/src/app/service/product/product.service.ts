import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { createDetailedProduct } from '../../model/product/detailed-product';
import { createProducts } from '../../model/product/product';
import { createProductGroups } from '../../model/product/product-group';
import { createProductGroupGalleryItems } from '../../model/product/product-group-gallery-item';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly product$ = of(createDetailedProduct());
  readonly products$ = of(createProducts({}, {}, {}, {}, {}, {}));
  readonly productGroups$ = of(createProductGroups({}, {}, {}));
  readonly productGroupGalleryItems$ = of(createProductGroupGalleryItems({}, {}));
}
