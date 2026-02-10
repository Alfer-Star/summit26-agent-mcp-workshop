# Angular für Fortgeschrittene - Aufgabe RxJS

- [Angular für Fortgeschrittene - Aufgabe RxJS](#Angular-für-fortgeschrittene---lab-1)

  - [0. Aufgabe](#0-warm-up)
  - [1. Aufgabe](#1-operatoren)

## 0. Warm-Up

Unter der AppComponent befindet sich eine _WarmUpSignalsComponent_, die ein Signal mit einer Liste von Städten enthält.<br>
Für die Dauer der Übung könnt ihr diese Component einfach in die _AppComponent_ einbinden, den Rest erstmal entfernen.

### 0.1 Städte anzeigen

Gib die Städte im Template der _WarmUpComponent_ aus.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

...
<ul>
@for(city of cities(); track city) {
  <li>{{city}}</li>
}
</ul>
...

```

</p>
</details>


### 0.2 Städte filtern

Erzeuge dir ein neues Signal, welches alle Städte bis auf "Hamburg" beinhaltet.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

readonly filteredCities = computed(() => {
  const cities = this.cities();
  return cities.filter(city => city !== 'Hamburg')
})

...
<ul>
@for(city of filteredCities(); track city) {
  <li>{{city}}</li>
}
</ul>
...

```

</p>
</details>

### 0.3 Neue Städte loggen

Ergänze den "hinzufuegen"-Methoden Aufruf so, dass "cities" um den Wert aus "city" ergänzt wird.<br>
"staedte" soll nach jeder Änderung über `console.log` ausgegeben werden.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

constructor() {
  effect(() => {
    console.log(this.cities())
  })
}

hinzufuegen() {
  this.cities.update(cities => {
    return [...cities, this.city()]
  })
  this.city.set('')
}
...

```

</p>
</details>


## 1. Checkout-Service umbauen

Der _CheckoutService_ nutzt aktuell noch ein BehaviourSubject, um den Warenkorb darzustellen.<br/>
Bau den Service so, um dass stattdessen ein Signal verwendet wird.<br>
Die öffentlichen Properties (`basket$` und `productsInBasket$`) sollen dementsprechend auch Signals sein (readonly).

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

checkout.service

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly checkoutHttp = inject(CheckoutHttpService);

  private readonly _basket = signal<Map<string, CheckoutProduct>>(new Map());
  readonly basket = this._basket.asReadonly();
  readonly productsInBasket = computed(() => {
    return [...this.basket().values()];
  });

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
    return this.checkoutHttp.checkout(productsInBasket);
  }

  clearBasket(): void {
    this._basket.set(new Map());
  }
}

product.component.ts

export class ProductComponent {
  private checkoutService = inject(CheckoutService);
  readonly detailedProduct = input.required<DetailedProduct>();
  readonly productQuantity = computed(() => {
    const product = this.detailedProduct();
    const basket = this.checkoutService.basket();
    return basket.get(product.id)?.quantity ?? 0;
  });

  addToBasket(): void {
    const detailedProduct = this.detailedProduct();
    this.checkoutService.addToBasket(detailedProduct, 1);
  }
}

```

main.component.ts
```TypeScript
export class MainComponent {
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

  private readonly productsInBasket = this.checkoutService.productsInBasket;
  private readonly isOnCheckoutRoute = signal(false);

  protected readonly isCheckoutButtonVisible = computed(() => {
    const hasProductsInBasket = this.productsInBasket().length > 0;
    const isOnCheckoutRoute = this.isOnCheckoutRoute();
    return hasProductsInBasket && !isOnCheckoutRoute;
  });

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isOnCheckoutRoute.set(event.urlAfterRedirects.endsWith(AbsoluteAppRoutes.checkout));
      }
    });
  }
}
```


main.component.html
```html
@if (isCheckoutButtonVisible()) {
  <sn-checkout-button />
}
```

checkout.component.ts
```TypeScript
export class CheckoutComponent {
  private readonly checkoutService = inject(CheckoutService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly paymentInformation = this.userService.user?.paymentInformation;
  readonly productsInBasket = this.checkoutService.productsInBasket;
  readonly total = computed(() => {
    const productsInBasket = this.productsInBasket();
    return productsInBasket.reduce((previous, current) => previous + current.quantity * current.product.price, 0);
  });
  readonly user = this.userService.user;

  checkout(): void {
    this.checkoutService.checkout().subscribe(() => {
      this.router.navigate([AbsoluteAppRoutes.checkoutComplete]);
    });
  }

  removeFromBasket(productId: string, amount: number): void {
    this.checkoutService.removeFromBasket(productId, amount);
  }

  clearBasket(): void {
    this.checkoutService.clearBasket();
  }
}
```


checkout.component.html
```html
<mat-card appearance="outlined">
  <mat-card-content>
    <div class="checkout-information">
      @if (user) {
        <sn-delivery-address [user]="user"></sn-delivery-address>
      }
      @if (paymentInformation) {
        <sn-payment-type [paymentInformation]="paymentInformation"></sn-payment-type>
      }
      <sn-checkout-products
        [checkoutProducts]="productsInBasket()"
      (quantityChangeForProduct)="removeFromBasket($event.productId, $event.amount)"></sn-checkout-products>
    </div>
    <sn-confirm-checkout [total]="total()" (buyClick)="checkout()"></sn-confirm-checkout>
  </mat-card-content>
</mat-card>
```

has-product-selected.guard.ts
```TypeScript
export const hasProductsSelectedGuard: CanActivateFn = () => {
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);
  const productsInBasket = checkoutService.productsInBasket();
  if (productsInBasket.length > 0) {
    return true;
  } else {
    router.navigate([AbsoluteAppRoutes.dashboard]);
    return false;
  }
};
```

</p>
</details>