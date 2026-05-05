import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { CheckoutHttpService } from './checkout-http.service';
import { BasketHttpService } from '../basket/basket-http.service';
import { CheckoutProduct } from '@shared/model/checkout/checkout-product';
import { DetailedProduct } from '@shared/model/product/detailed-product';
import { isProduct } from '@shared/model/product/product-type-guard';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly checkoutHttp = inject(CheckoutHttpService);
  private readonly basketHttp = inject(BasketHttpService);

  private readonly _basket = signal<Map<string, CheckoutProduct>>(new Map());
  readonly basket = this._basket.asReadonly();
  readonly productsInBasket = computed(() => {
    return [...this.basket().values()];
  });

  /**
   * Fetches the persisted basket from the server and replaces the in-memory basket.
   * Called by the route guard so externally added items (e.g. via MCP) are visible immediately.
   */
  loadFromServer(lang: string): Observable<void> {
    return this.basketHttp.getBasket(lang).pipe(
      tap((items) => {
        const map = new Map<string, CheckoutProduct>();
        items.forEach((item) => map.set(item.product.id, item));
        this._basket.set(map);
      }),
      map(() => void 0),
    );
  }

  addToBasket(product: DetailedProduct, quantity: number): void {
    this._basket.update((basket) => {
      const checkoutProduct = basket.get(product.id);

      if (checkoutProduct) {
        basket.set(product.id, {
          product,
          quantity: checkoutProduct.quantity + quantity,
        });
      } else {
        basket.set(product.id, { product, quantity });
      }
      return new Map(basket);
    });
  }

  removeFromBasket(product: DetailedProduct, quantity: number): void;
  removeFromBasket(id: string, quantity: number): void;

  removeFromBasket(productOrId: DetailedProduct | string, quantity: number): void {
    this._basket.update((basket) => {
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

      return basket;
    });
  }

  checkout(): Observable<unknown> {
    const productsInBasket = this.productsInBasket();
    return this.checkoutHttp.checkout(productsInBasket).pipe(
      switchMap(() => this.basketHttp.clearBasket()),
      tap(() => this.clearBasket()),
    );
  }

  /**
   * Clears the server-persisted basket and the in-memory basket.
   * Use this when the user explicitly empties the basket without checking out.
   */
  clearAll(): Observable<unknown> {
    return this.basketHttp.clearBasket().pipe(tap(() => this.clearBasket()));
  }

  clearBasket(): void {
    this._basket.set(new Map());
  }

  getQuantity(id?: string): Signal<number | undefined> {
    return computed(() => {
      const basket = this.basket();
      if (id) {
        return basket.get(id)?.quantity;
      } else {
        return undefined;
      }
    });
  }
}
