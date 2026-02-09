import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CheckoutProduct } from '../../model/checkout/checkout-product';
import { DetailedProduct } from '../../model/product/detailed-product';
import { isProduct } from '../../model/product/product-type-guard';
import { CheckoutProductDto } from '../../model/checkout/checkout-product-dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly http = inject(HttpClient);

  private readonly _basket$ = new BehaviorSubject<Map<string, CheckoutProduct>>(new Map());

  readonly basket$ = this._basket$.asObservable();
  readonly productsInBasket$ = this.basket$.pipe(map((basket) => [...basket.values()]));

  addToBasket(product: DetailedProduct, quantity: number): void {
    this.basket$.pipe(first()).subscribe((basket) => {
      const checkoutProduct = basket.get(product.id);

      if (checkoutProduct) {
        basket.set(product.id, {
          product,
          quantity: checkoutProduct.quantity + quantity,
        });
      } else {
        basket.set(product.id, { product, quantity });
      }

      this._basket$.next(basket);
    });
  }

  removeFromBasket(product: DetailedProduct, quantity: number): void;
  removeFromBasket(id: string, quantity: number): void;

  removeFromBasket(productOrId: DetailedProduct | string, quantity: number): void {
    this.basket$.pipe(first()).subscribe((basket) => {
      let id: string;

      if (isProduct(productOrId)) {
        id = productOrId.id;
      } else {
        id = productOrId;
      }

      const checkoutProduct = basket.get(id);

      if (checkoutProduct) {
        checkoutProduct.quantity -= quantity;
        basket.set(id, checkoutProduct);

        if (checkoutProduct.quantity <= 0) {
          basket.delete(id);
        }
      }

      this._basket$.next(basket);
    });
  }

  checkout(): Observable<unknown> {
    return this.productsInBasket$.pipe(
      first(),
      switchMap((productsInBasket) => {
        const dto: CheckoutProductDto = {
          products: productsInBasket.map((checkoutProduct) => ({
            productId: checkoutProduct.product.id,
            quantity: checkoutProduct.quantity,
          })),
        };
        return this.http.post<unknown>(environment.url + '/checkout', dto);
      }),
    );
  }

  clearBasket(): void {
    this._basket$.next(new Map());
  }

  getQuantity(id: string): Observable<number | undefined> {
    return this.basket$.pipe(map((basket) => basket.get(id)?.quantity));
  }
}
