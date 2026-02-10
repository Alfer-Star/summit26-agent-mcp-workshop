# Angular für Fortgeschrittene - Aufgabe RxJS

- [Angular für Fortgeschrittene - Aufgabe RxJS](#Angular-für-fortgeschrittene---lab-1)

  - [0. Aufgabe](#0-warm-up)
  - [1. Aufgabe](#1-operatoren)
  - [2. Aufgabe](#2-hot--cold-observables)
  - [3. Aufgabe](#3-resolver)
  - [4. Aufgabe](#3-with-component-input-binding)

## 0. Warm-Up

Unter der AppComponent befindet sich eine _WarmUpRxJsComponent_, die ein Observable mit einer Liste von Städten enthält (`citiesList$`) und einem Observable, welches die Städte nacheinander durchreicht (`citiesStream$`).<br>
Für die Dauer der Übung könnt ihr diese Component einfach in die _AppComponent_ einbinden, den Rest erstmal entfernen.

### 0.1 Städte anzeigen

Gib die Städte mithilfe der async-Pipe im Template der _WarmUpComponent_ aus.

<details>
<summary>Lösung anzeigen</summary>
<p>

```html

...

template 
        
@for(city of citiesList$ | async; track city) { 
  <span>{{city}}</span> 
}

...

```

</p>
</details>

### 0.2 Städte filtern

Filter nun die Städte Berlin und Hamburg mithilfe eines Operators aus `citiesStream$` und zeig diese im Template an.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

readonly citiesStream$ = of('Hamburg', 'Berlin', 'Paderborn', 'München').pipe(filter((city) => city !== 'Hamburg' && city !== 'Berlin' ));

```

</p>
</details>

### 0.3 Umlaute entfernen

Die deutschen Umlaute aus allen Städte-Namen wie z.B. "ä" sollen durch einfache Buchstaben wie z.B. ae ersetzt werden.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript
readonly citiesStream$ = of('Hamburg', 'Berlin', 'Paderborn', 'München').pipe(map((city) => city.replace('ä', 'ae').replace('ü', 'ue').replace('ö', 'oe') ));

```

</p>
</details>

### 0.4 Städte durch coolere Städte ersetzen

Die Städte sollen durch die cooleren Städte ersetzt werden.<br>
Füge dafür einen Operator ein, der an 'citiesList$' gepiped wird und 'coolerCities$' zurückgibt.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

readonly coolerCities$ = of(['New York', 'Tokio', 'Johannesburg']);

readonly citiesList$ = of(['Hamburg', 'Berlin', 'Paderborn', 'München']).pipe(switchMap(() => this.coolerCities$);

```

</p>
</details>

## 1. Operatoren

### 1.1 Operatoren Part I

Sucheingaben in der _SearchComponent_ erfolgen gegenwärtig noch nicht richtig.<br>
Subscribe auf das valueChange-Observable des Controls und sorge dafür, dass nur geänderte Werte nach einem gewissen Zeitraum weitergereicht werden (z.B. 500ms).<br>
Wichtig: Darauf achten, dass die Subscription mitsamt der Component aufgelöst wird.

<details>
<summary>Lösung anzeigen</summary>
<p>

Ruf das das Observable des Controls auf und pass die durchgereichten Werte mithilfe der distinctUntilChanged- und debounceTime-Pipes an.<br>

```typescript
static readonly SEARCH_DEBOUNCE_MS = 500;
...

constructor() {
  this.control.valueChanges.pipe(
    distinctUntilChanged(),
    debounceTime(SearchComponent.SEARCH_DEBOUNCE_MS),
    takeUntilDestroyed()
  ).subscribe(this.search.bind(this));
}
```

</details>

### 1.2 Operatoren Part II

In der _MainComponent_ benötigen wir ein Observable welches bestimmt ob der "Kasse"-Button sichtbar für den Anwender ist.<br>
Dafür muss das Observable zum einen prüfen ob Produkte im Warenkorb liegen und ob die aktuelle Route nicht bereits der Warenkorb ist.

Tipp:

- Events die beim Wechsel einer Route stattfinden, sind über das Attribut "events" des Router Services erreichbar
- Produkte des Warenkorbs sind im Attribut "productsInBasket$" des CheckoutServices
- Da wir hier von zwei Observables den aktuellsten Wert brauchen wird dir der [combineLatest](https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest)-Operator helfen

<details>
<summary>Lösung anzeigen</summary>
<p>

Wir kombinieren Navigationen über den Angular Router sowie die aktuellen Produkte aus dem Warenkorb mithilfe des combineLatest-Operators.<br>
Da es sich bei den events um ein Cold Observable handelt, sorgen wir dafür dass mithilfe des shareReplay-Operators ein Hot Observable entsteht.

```typescript
export class MainComponent {
  readonly showCheckoutButton$ = combineLatest([
    this.router.events.pipe(shareReplay(1), startWith(null)),
    this.checkoutService.productsInBasket$.pipe(map((products) => products.length > 0)),
  ]).pipe(
    map(([event, hasProductsInBasket]) => {
      if (
        event instanceof NavigationEnd &&
        event.urlAfterRedirects.indexOf(RelativeAppRoutes.checkout) > -1
      ) {
        return false;
      }

      return hasProductsInBasket;
    })
  );

  constructor(private checkoutService: CheckoutService, private router: Router) {}
}

template:
@if (showCheckoutButton$ | async) {
<sn-checkout-button />
}
```

</details>

## 2. Hot / Cold Observables

### 2.1 Cold Observables

Ermögliche es dem _ProductService_ über ein öffentlich zugängliches Attribut Produktgruppen vom Backend zu erhalten.<br>
Sieh dir dazu den _ProductHttpService_ an, dieser bietet unter anderem eine fetchProductGroups()-Methode an, die den HttpClient nutzt.

<details>
<summary>Lösung anzeigen</summary>
<p>

Das Attribut kann direkt auf die Methode verweisen<br>
Der unter der Haube genutzte get()-Aufruf erzeugt ein Cold Observable, welches bei jeder Subscription einen neuen REST-Call ausführt.

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  
  readonly productGroups$ = this.productHttp.fetchProductGroups();
}
```

</details>

### 2.2 Hot Observables

Der in [2.1](#21-cold-observables) erstellte Cold Observable soll nun zu einem Hot Observable umgewandelt werden.<br>
Wir wollen nun nur noch einen einzigen REST-Call haben, der beim ersten Subscribe ausgeführt wird.<br>
Tipp: Sieh dir die [Multicasting Operatoren](https://www.learnrxjs.io/learn-rxjs/operators/multicasting) an.

<details>
<summary>Lösung anzeigen</summary>
<p>

Das Attribut kann direkt auf die Methode verweisen<br>
Der unter der Haube genutzte get()-Aufruf erzeugt ein Cold Observable, welches bei jeder Subscription einen neuen REST-Call ausführt.

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  
  readonly productGroups$ = this.productHttp.fetchProductGroups().pipe(shareReplay(1));
}
```

</details>

### 2.3 Hot Observables in Kombination mit Operatoren

Nun können wir Produktgruppen vom Backend laden und in einem Observable haushalten.<br>
Allerdings haben wir zwei Fälle noch nicht abgedeckt:<br>

1. Bei Sprachwechseln benötigen wir einen neuen Aufruf der Produktgruppen, um sie in der richtigen Sprache darstellen zu können.
2. Wir möchten vlt. gezieht auslösen können, ob erneut Produktgruppen geladen werden (z.B. für einen Refresh-Mechanismus).

Um darauf reagieren zu können, müssen wir also Sprachwechsel des _TranslocoService_ sowie ein neues _BehaviourSubject_ für die gezielten Aufrufe des Backends kombinieren.<br>
Das neue _BehaviourSubject_ sollte über eine neue Methode in dem Service angestoßen werden können.

<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt**

Zu aller Erst legen wir das neue _BehaviourSubject_ an:

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  private readonly _fetchProductGroups$ = new BehaviorSubject<void>(undefined);

  readonly productGroups$ = this.productHttp.fetchProductGroups().pipe(shareReplay(1));
}
```

**2. Schritt**

Wir ergänzen den _TranslocoService_ in dem Konstruktor und erstellen die Methode, um das Subject anzustoßen.

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  private readonly transloco = inject(TranslocoService);
  private readonly _fetchProductGroups$ = new BehaviorSubject<void>(undefined);

  readonly productGroups$ = this.productHttp.fetchProductGroups().pipe(shareReplay(1));

  fetchProductGroups(): void {
    this._fetchProductGroups$.next();
  }
}
```

**3. Schritt**

Nun muss mithilfe eines combineLatest()-Operators auf neue Werte in dem Subject und der aktuellen Sprache "gehört" werden.<br>
Der mergeMap()-Operator ermöglicht das Laden der Produktgruppen.

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  private readonly transloco = inject(TranslocoService);
  private readonly _fetchProductGroups$ = new BehaviorSubject<void>(undefined);

  readonly productGroups$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProductGroups$,
  ]).pipe(
    mergeMap(() => this.productHttp.fetchProductGroups()),
    shareReplay(1)
  );

  fetchProductGroups(): void {
    this._fetchProductGroups$.next();
  }
}
```

</details>

### 2.4 Einbinden der übrigen Attribute / Methoden

Lege neue Attribute und Methoden für Produkt-Galleryitems, Produkte und einem einzelnen Produkt (Detailinformationen) analog zu [2.3](#23-hot-observables-in-kombination-mit-operatoren) an.<br>

Tipp: Die _BehaviourSubject_ Objekte für die Produkte und das Produkt sehen ein wenig anders aus, da sie Informationen wie z.B. die Produktgruppe oder eine Such-Query beinhalten können.

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  private readonly transloco = inject(TranslocoService);
  private readonly _fetchProductGroups$ = new BehaviorSubject<void>(undefined);
  private readonly _fetchProductGroupGalleryItems$ = new BehaviorSubject<void>(undefined);
  private readonly _fetchProducts$ = new BehaviorSubject<
    { searchQuery?: string; productGroupId?: string } | undefined
  >(undefined);
  private readonly _fetchProduct$ = new BehaviorSubject<string | undefined>(undefined);

  readonly productGroups$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProductGroups$,
  ]).pipe(
    mergeMap(() => this.productHttp.fetchProductGroups()),
    shareReplay(1)
  );

  readonly productGroupGalleryItems$ = combineLatest([
    this._fetchProductGroupGalleryItems$,
  ]).pipe(
    mergeMap(() => this.productHttp.fetchProductGroupGalleryItems()),
    shareReplay(1)
  );

  readonly products$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProducts$,
  ]).pipe(
    mergeMap(([, fetchParams]) => {
      const { productGroupId, searchQuery } = fetchParams ?? {};
      return this.productHttp.fetchProducts(productGroupId, searchQuery);
    }),
    shareReplay(1)
  );

  readonly product$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProduct$,
  ]).pipe(
    mergeMap(([, id]) => (id ? this.productHttp.fetchProduct(id) : EMPTY)),
    shareReplay(1)
  );

  fetchProductGroups(): void {
    this._fetchProductGroups$.next();
  }

  fetchProductGroupGalleryItems(): void {
    this._fetchProductGroupGalleryItems$.next();
  }

  fetchProducts(productGroupId?: string, searchQuery?: string): void {
    this._fetchProducts$.next({ productGroupId, searchQuery });
  }

  fetchProduct(productId: string): void {
    this._fetchProduct$.next(productId);
  }
}
```

</details>

## 3. Resolver

Da jetzt der _ProductService_ abgeschlossen ist, können wir das Laden der Produkte an den richtigen Stellen in der Applikation einbinden.<br>
Dazu sollen Resolver benutzt werden, die an die entsprechenden Routen gehangen werden.<br>

Folgende Resolver werden benötigt:

- DashboardResolver
  - dieser soll beim Ansteuern des Dashboards Produkte und Produkt-Galleryitems laden
- ProductResolver
  - dieser soll beim Ansteuern einer Produkt Seite aus eine ID aus den Routen-Parametern entgegen nehmen und ein Produkt laden
- ProductsResolver
  - dieser soll beim Ansteuern einer Produktgruppen Seite mithilfe einer ID aus den Routen-Parameter die Produkte einer Gruppe laden

<details>
<summary>Lösung anzeigen</summary>
<p>

DashboardResolver

```typescript
export const dashboardResolver: ResolveFn<[ProductGroup[], ProductGroupGalleryItem[]]> = (route, state) => {
  const productService = inject(ProductService);
  productService.fetchProductGroups();
  productService.fetchProductGroupGalleryItems();

  return zip(productService.productGroups$.pipe(first()), productService.productGroupGalleryItems$.pipe(first()));
};
```

dashboard.routes

```typescript
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      galleryUrls: dashboardResolver,
    },
  },
];
```

ProductResolver

```typescript
export const productResolver: ResolveFn<Product> = (route, state) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id');
  if (!id) {
    return EMPTY;
  }
  productService.fetchProduct(id);
  return productService.product$.pipe(first());
};
```

product.routes

```typescript
const routes: Routes = [
  {
    path: RelativeAppRoutes.productId,
    component: ProductComponent,
    resolve: { detailedProduct: productResolver },
  },
];
```

ProductsResolver

```typescript
export const productsResolver: ResolveFn<Product[]> = (route, state) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id');
  if (!id) {
    return EMPTY;
  }
  productService.fetchProducts(id);
  return productService.products$.pipe(first());
};
```

products.routes

```typescript
const routes: Routes = [
  {
    path: RelativeAppRoutes.productsId,
    component: ProductsComponent,
    resolve: {
      products: ProductsResolver,
    },
  },
  {
    path: RelativeAppRoutes.productsSearch,
    component: ProductsComponent,
  },
];
```

</details>


## 4. With Component Input Binding

Aktuell wir in der _ProductComponent_ das Produkt noch über den _ProductService_ bezogen, obwohl der Resolver eigentlich bereits das Laden vornimmt.<br>
Passe die Component so an, dass sie über ein Input das "detailedProduct" aus dem Resolver ausliest.

Hint: Dafür muss "withComponentInputBinding" beim "provideRouter"-Aufruf in der _main.ts_ ergänzt werden.

<details>
<summary>Lösung anzeigen</summary>
<p>
```bash

ProductComponent

export class ProductComponent {
  private checkoutService = inject(CheckoutService);

  readonly detailedProduct = input.required<DetailedProduct>();

  addToBasket(): void {
    const detailedProduct = this.detailedProduct();
    this.checkoutService.addToBasket(detailedProduct, 1);
  }
}
...

Template ProductComponent

<mat-card appearance="outlined">
  <mat-card-content>
    <sn-product-info [product]="detailedProduct()" />
    <sn-product-basket-options
      [product]="detailedProduct()"
      [productQuantity]="detailedProduct().availableQuantity"
      (addClick)="addToBasket()" />
  </mat-card-content>
</mat-card>

...
```



</details>