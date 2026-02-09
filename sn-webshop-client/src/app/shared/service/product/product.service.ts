import { Injectable } from '@angular/core';
import { createDetailedProduct } from '@shared/model/product/detailed-product';
import { createProducts } from '@shared/model/product/product';
import { createProductGroups } from '@shared/model/product/product-group';
import { createProductGroupGalleryItems } from '@shared/model/product/product-group-gallery-item';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly product$ = of(createDetailedProduct());
  readonly products$ = of(createProducts({}, {}, {}, {}, {}, {}));
  readonly productGroups$ = of(createProductGroups({}, {}, {}));
  readonly productGroupGalleryItems$ = of(createProductGroupGalleryItems({}, {}));
}
