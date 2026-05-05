import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CheckoutProduct } from '@shared/model/checkout/checkout-product';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CheckoutProductDto } from '@shared/model/checkout/checkout-product-dto';

@Injectable({
  providedIn: 'root',
})
export class CheckoutHttpService {
  private readonly http = inject(HttpClient);

  checkout(products: CheckoutProduct[]): Observable<unknown> {
    const dto: CheckoutProductDto = {
      products: products.map((checkoutProduct) => ({
        productId: checkoutProduct.product.id,
        quantity: checkoutProduct.quantity,
      })),
    };
    return this.http.post<unknown>(environment.url + '/checkout', dto);
  }
}
