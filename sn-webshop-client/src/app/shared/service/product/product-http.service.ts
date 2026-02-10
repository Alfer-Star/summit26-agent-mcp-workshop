import { HttpClient, HttpParams } from "@angular/common/http";
import { DetailedProduct } from "@shared/model/product/detailed-product";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { Product } from "@shared/model/product/product";
import { ProductGroup } from "@shared/model/product/product-group";
import { inject, Injectable } from "@angular/core";
import { ProductGroupGalleryItem } from "@shared/model/product/product-group-gallery-item";

@Injectable({
  providedIn: 'root',
})
export class ProductHttpService {
  private http = inject(HttpClient);

  fetchProductGroups(): Observable<ProductGroup[]> {
    return this.http.get<ProductGroup[]>(environment.url + '/product-groups/get');
  }

  fetchProductGroupGalleryItems(): Observable<ProductGroupGalleryItem[]> {
    return this.http.get<ProductGroupGalleryItem[]>(environment.url + '/product-groups/gallery');
  }

  fetchProducts(productGroupId?: string, searchQuery?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (productGroupId) {
      params = params.append('productGroupId', productGroupId);
    }

    if (searchQuery) {
      params = params.append('searchQuery', searchQuery);
    }

    return this.http.get<Product[]>(environment.url + '/products/get', {
      params,
    });
  }

  searchForProducts(searchQuery = ''): Observable<Product[]> {
    return this.http.get<Product[]>(environment.url + '/products/search', {
      params: new HttpParams().append('searchQuery', searchQuery),
    });
  }

  fetchProduct(productId: string): Observable<DetailedProduct> {
    return this.http.get<DetailedProduct>(environment.url + '/products/get-product', {
      params: new HttpParams().append('productId', productId),
    });
  }
}
