# Angular für Fortgeschrittene - Aufgabe Architektur

- [Angular für Fortgeschrittene - Aufgabe Architektur](#Angular-für-fortgeschrittene---lab-1)
  - [1. Aufgabe](#anpassen-der-applikationsstruktur)
  - [2. Aufgabe](#2-aufsplitten-des-checkoutservice)
  - [3. Aufgabe](#3-anlegen-einer-maincomponent-page)

## 1. Anpassen der Applikationsstruktur

Aktuell hat unsere Applikation noch eine recht flache Struktur, ohne sinnvolle Auf- bzw. Unterteilungen.

Das soll geändert werden; führe die einzelnen Components, Services, Models, etc. in die aus der Schulung beschriebenen Form um:

- core/
  - Ordner mit zentralen Pages, Components und Routes
- feature/
  - Sammlung von Features, die wiederum featurebezogene Pages, Components, Services, Models, Routes, etc. beinhalten
- shared/
  - Ordner welcher applikationsweit genutzte Components, Services, Models, etc. bereitstellt und exponiert
- transloco/
  - Eigenes Ordner welcher die I18N-Library _Transloco_ zur Verfügung stellt

Sobald die Aufteilung klar ist, kannst du für "schönere" Import-Pfade die "paths"-Variable in der _tsconfig.json_ um sprechende Bezeichner ergänzen.<br>
Beispiel:

```bash
...
"paths": {
 "@core/*": ["src/app/core/*"]
},
...
```

## 2. Aufsplitten des _CheckoutService_

Aktuell beinhaltet der _CheckoutService_ sowohl Logik für die Haushaltung von Daten (den Warenkorb) sowie den _HttpClient_ um technisch mit dem Backend kommunizieren zu können.<br>

Erstell also einen neuen _CheckoutHttpService_, welcher ausschließlich Methoden anbietet um REST-Calls für den _CheckoutService_ vorzunehmen.<br>
Binde diesen anschließend in den _CheckoutService_ ein und entferne die Abhängigkeiten zum _HttpClient_.

<details>
<summary>Lösung</summary>
<p>

```ts
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutHttp = inject(CheckoutHttpService);

  private _basket$ = new BehaviorSubject<Map<string, CheckoutProduct>>(new Map());

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
            switchMap((productsInBasket) => this.checkoutHttp.checkout(productsInBasket)),
    );
  }

  clearBasket(): void {
    this._basket$.next(new Map());
  }

  getQuantity(id: string): Observable<number | undefined> {
    return this.basket$.pipe(map((basket) => basket.get(id)?.quantity));
  }
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutHttpService {
  private http = inject(HttpClient);

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

```
</p>
</details>

## 3. Anlegen einer _MainComponent_ Page

Lege nun unter core/ einen Ordner für eine neue _MainComponent_ an.<br>
Gegenwärtig ist der Grundaufbau der Applikation so, dass die _AppComponent_ Elemente wie den Header, Footer, etc. bereitstellt.<br>
Allerdings sollen Pages wie _LoginComponent_ und _RegistrationComponent_ diese gar nicht beinhalten.<br>

Diese _MainComponent_ soll das aktuell in der _AppComponent_ befindliche Grundgerüst aufbauen.<br>
Die _AppComponent_ benötigt stattdessen in ihrem Template dann nur noch einen Aufruf des router-outlets.

Anschließend müssen die _app.routes.ts_ angepasst werden, so dass die Main-Route auf die MainComponent zeigt (ist aktuell ohne Component).


<details>
<summary>Lösung</summary>
<p>

```ts
app.routes.ts
...
{
  path: RelativeAppRoutes.main,
          component: MainComponent,
          children: [
    {
      path: '',
      redirectTo: RelativeAppRoutes.dashboard,
      pathMatch: 'full',
    },
...
```

``` html
app.component.html

 <router-outlet></router-outlet>
```


``` html
main.component.html

<div class="main">
  <sn-header />
  <div class="main-content">
    <router-outlet />
    <sn-checkout-button />
  </div>
  <sn-footer />
</div>
```
</p>
</details>