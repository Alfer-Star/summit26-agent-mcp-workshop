import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CheckoutProduct } from '@shared/model/checkout/checkout-product';

@Injectable({
  providedIn: 'root',
})
export class BasketHttpService {
  private readonly http = inject(HttpClient);

  getBasket(lang: string): Observable<CheckoutProduct[]> {
    return this.http.get<CheckoutProduct[]>(environment.url + '/basket', {
      params: { lang },
    });
  }

  removeItem(productId: string): Observable<unknown> {
    return this.http.delete(environment.url + `/basket/items/${encodeURIComponent(productId)}`);
  }

  clearBasket(): Observable<unknown> {
    return this.http.delete(environment.url + '/basket');
  }
}
