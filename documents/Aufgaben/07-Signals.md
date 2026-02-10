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

readonly filteredCities$ = computed(() => {
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
<summary>Lösung anzeigen (CheckoutService und ProductComponent)</summary>
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

</p>
</details>