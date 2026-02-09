# Angular für Fortgeschrittene - Transloco

- [Angular für Fortgeschrittene - Transloco](#Angular-für-fortgeschrittene---lab-1)
  - [1. Installation](#1-installation)
  - [2. Transloco verwenden](#2-transloco-verwenden)
  - [3. Language Switcher aktivieren](#3-language-switcher-aktivieren)

## 1. Installation

Mithilfe des folgenden Befehls Transloco installieren. Dabei die Sprachen `'de'` und `'en'` angeben.

```bash
ng add @jsverse/transloco
```

Wie folgt anworten:<br/>
✔ 🌍 Which languages do you need? de, en<br>
✔ 🚀 Are you working with server side rendering? No

Für die `de.json` und `en.json` Dateien sollten unter `assets/i18n` liegen und dabei sollte folgender Inhalt verwendet werden:

<details>
<summary>de.json</summary>
<p>

```json
{
  "core": {
    "dashboardAnchor": "S&N Webshop",
    "searchInput": "Geben Sie einen Suchbegriff ein...",
    "userMenuTrigger": "Hello {{username}}!",
    "logout": "Abmelden",
    "discover": "Entdecken",
    "goToCheckout": "Zur Kasse",
    "login": "Anmelden",
    "register": "Registrieren",
    "settings": "Einstellungen",
    "adminSpace": "Administrator Bereich",
    "aboutSnWebshop": "Über S&N Webshop",
    "aboutUs": "Über uns",
    "impressum": "Impressum",
    "contact": "Kontakt",
    "de": "DE",
    "en": "EN",
    "name": "Name",
    "email": "{{auth.email}}"
  },
  "products": {
    "noProducts": "Es wurden keine Produkte gefunden"
  },
  "product": {
    "price": "Preis",
    "delivery": "Lieferdauer (Tage)",
    "availableQuantity": "Noch auf Lager",
    "addToCart": "Zum Warenkorb hinzufügen"
  },
  "checkout": {
    "deliveryAddress": "Versandadresse",
    "payment": "Zahlungsart",
    "articles": "Artikel",
    "ibanEndsWith": "Ihre IBAN endet mit",
    "pay": "Bezahlen",
    "price": "Preis pro Einheit:",
    "total": "Summe:",
    "quantity": "Menge:",
    "payTitle": "Abschluss",
    "payHint0": "Alle Preise inkl. MwSt., ggf. zzgl. Versandkosten (werden im Warenkorb angezeigt).",
    "payHint1": "Versand: Deutschland 2–4 Werktage, EU 3–6 Werktage. Sendungsverfolgung per E‑Mail.",
    "payHint2": "Rückgabe &amp; Widerruf: 14 Tage ab Erhalt. Bitte senden Sie die Ware unbenutzt und im Originalzustand zurück. Rücksendelabel erhalten Sie über Ihr Kundenkonto oder unseren Support. Rückversand innerhalb DE kostenfrei.",
    "payHint3": "Gewährleistung: 24 Monate gesetzliche Gewährleistung auf physische Produkte für Verbraucher.",
    "payHint4": "Zahlungsarten: Kreditkarte, PayPal, SEPA‑Lastschrift, giropay/sofort, Kauf auf Rechnung (B2B nach Prüfung).",
    "payHint5": " Rechnung: PDF‑Rechnung per E‑Mail. Bei Angabe einer gültigen USt‑IdNr. (EU/B2B) erfolgt Nettorechnung gemäß Reverse‑Charge, sofern anwendbar.",
    "payHint6": "Mit Klick auf „Bezahlen“ geben Sie eine zahlungspflichtige Bestellung ab.",
    "noItems": "Ihre Warenkorb ist leer",
    "thanks": "Vielen Dank für Ihren Einkauf!",
    "goToDashboard": "Zurück zur Startseite"
  },
  "auth": {
    "name": "Dein Name",
    "email": "E-Mail Adresse",
    "password": "Passwort",
    "password2": "Passwort wiederholen",
    "registration": {
      "title": "Konto erstellen",
      "invalid": "Registrierung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut!"
    },
    "createAccount": "S&N Webshop-Konto erstellen",
    "login": {
      "title": "Anmeldung",
      "button": "Anmelden",
      "invalid": "E-Mail und/oder Passwort falsch! Bitte überprüfen Sie Ihre Eingaben."
    }
  },
  "validation": {
    "required": "Pflichtangabe",
    "passwordStrength": "Passwörter müssen mindestens 8 Zeichen lang sein, Großbuchstaben, Kleinbuchstaben, Sonderzeichen und Zahlen enthalten",
    "passwordsMatch": "Die Passwörter stimmen nicht überein",
    "emailAlreadyUsed": "Diese E-Mail wird bereits verwendet ",
    "email": "E-Mail Adresse ungültig",
    "iban": "Die eingegebene IBAN ist ungültig",
    "unknown": "Bitte geben Sie einen korrekten Wert ein!"
  },
  "settings": {
    "name": "Name",
    "addresses": "Adressen",
    "streetNr": "Straße und Hausnummer",
    "zip": "Postleitzahl",
    "city": "Ort",
    "iban": "IBAN",
    "ibanHint": "Beispiel-IBAN: AB12 1234 1234 1234 1234 12",
    "save": "Änderungen speichern"
  },
  "productGroupName": {
    "notebook": "Notebooks",
    "fruit": "Früchte",
    "shoe": "Schuhe",
    "flower": "Blumen",
    "coffee": "Kaffees",
    "car": "Autos",
    "vacation": "Urlaube",
    "phone": "Telefone",
    "clock": "Uhren",
    "office": "Bürobedarf",
    "bike": "Fahrräder",
    "kitchenware": "Küchenwaren"
  },
  "productName": {
    "notebook": "Notebook",
    "fruit": "Frucht",
    "shoe": "Schuh",
    "flower": "Blume",
    "coffee": "Kaffee",
    "car": "Auto",
    "vacation": "Urlaub",
    "phone": "Telefon",
    "clock": "Uhr",
    "office": "Bürobedarf",
    "bike": "Fahrrad",
    "kitchenware": "Küchenware"
  },
  "notFound": {
    "title": "Ups... 404",
    "description": "Wir konnten die von Dir aufgerufene Seite leider nicht finden :(",
    "backToDashboard": "Zurück zum Dashboard"
  }
}
```

</p>
</details>
<details>
<summary>en.json</summary>
<p>

```json
{
  "core": {
    "dashboardAnchor": "S&N Webshop",
    "searchInput": "Enter a search term...",
    "userMenuTrigger": "Hello {{username}}!",
    "logout": "Logout",
    "discover": "Discover",
    "goToCheckout": "Go to checkout",
    "login": "Login",
    "register": "Registration",
    "settings": "Settings",
    "adminSpace": "Admin settings",
    "aboutSnWebshop": "About S&N Webshop",
    "aboutUs": "About us",
    "impressum": "Impressum",
    "contact": "Contact",
    "de": "DE",
    "en": "EN",
    "name": "Name",
    "email": "{{auth.email}}"
  },
  "products": {
    "noProducts": "No products found"
  },
  "product": {
    "price": "Price",
    "delivery": "Delivery duration (days)",
    "availableQuantity": "On stock",
    "addToCart": "Add to cart"
  },
  "checkout": {
    "deliveryAddress": "Delivery address",
    "payment": "Payment",
    "articles": "Articles",
    "ibanEndsWith": "Your IBAN ends with",
    "pay": "Pay",
    "price": "Price per unit:",
    "total": "Total:",
    "quantity": "Quantity:",
    "payTitle": "Checkout",
    "payHint0": "All prices include VAT; shipping costs may apply (shown in the cart).",
    "payHint1": "Shipping: Germany 2–4 business days, EU 3–6 business days. Shipment tracking via email.",
    "payHint2": "Returns &amp; Right of Withdrawal: 14 days from receipt. Please return items unused and in their original condition. You can obtain a return label via your account or our support. Returns within Germany are free of charge.",
    "payHint3": "Warranty: 24 months statutory warranty on physical products for consumers.",
    "payHint4": "Payment methods: Credit card, PayPal, SEPA direct debit, giropay/Sofort, purchase on account (B2B subject to approval).",
    "payHint5": "Invoice: PDF invoice by email. If a valid VAT ID is provided (EU/B2B), a net invoice will be issued under the reverse-charge mechanism where applicable.",
    "payHint6": "By clicking \"Pay\", you place a binding order with an obligation to pay.",
    "noItems": "Your basket is empty",
    "thanks": "Thank you for your purchase!",
    "goToDashboard": "Back to dashboard"
  },
  "auth": {
    "name": "Your name",
    "email": "E-Mail",
    "password": "Password",
    "password2": "Confirm password",
    "registration": {
      "title": "Create accoubt",
      "invalid": "Registration could not be completed. Please try again later!"
    },
    "createAccount": "Create S&N Webshop-Account",
    "login": {
      "title": "Login",
      "button": "Login",
      "invalid": "Wrong E-Mail and/or Password! Please try again."
    }
  },
  "validation": {
    "required": "Required!",
    "passwordStrength": "Passwords should be atleast 8 characters long and contain uppercase letters, lowercase letters, special characters and numbers.",
    "passwordsMatch": "Passwords don't match",
    "emailAlreadyUsed": "E-Mail is already in use",
    "email": "E-Mail is invalid",
    "iban": "The entered IBAN is invalid",
    "unknown": "Please enter a correct value!"
  },
  "settings": {
    "name": "Name",
    "addresses": "Addresses",
    "streetNr": "Street and street number",
    "zip": "ZIP",
    "city": "City",
    "iban": "IBAN",
    "ibanHint": "Example IBAN: AB12 1234 1234 1234 1234 12",
    "save": "Save Changes"
  },
  "productGroupName": {
    "notebook": "Notebooks",
    "fruit": "Fruits",
    "shoe": "Shoes",
    "flower": "Flowers",
    "coffee": "Coffees",
    "car": "Cars",
    "vacation": "Vacations",
    "phone": "Phones",
    "clock": "Clocks",
    "office": "Office",
    "bike": "Bikes",
    "kitchenware": "Kitchenware"
  },
  "productName": {
    "notebook": "Notebook",
    "fruit": "Fruit",
    "shoe": "Shoe",
    "flower": "Flower",
    "coffee": "Coffee",
    "car": "Car",
    "vacation": "Vacation",
    "phone": "Phone",
    "clock": "Clock",
    "office": "Office",
    "bike": "Bike",
    "kitchenware": "Kitchenware"
  },
  "notFound": {
    "title": "Ups... 404",
    "description": "We could not find the page you were looking for :(",
    "backToDashboard": "Back to Dashboard"
  }
}

```

</p>
</details>

## 2. Transloco verwenden

Im Client sind bisher alle Texte hardcodiert. Alle Texte sind schon in den language-Dateien aus Teil 1 enthalten. Nun liegt es an Euch, geht durch die Applikation und verwendet Transloco um die hardkodierten Texte zu entfernen

<details>
<summary>admin.component.html</summary>
<p>

```html
<mat-card *transloco="let translate">
  <table mat-table [dataSource]="userList" class="mat-elevation-z8">
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>{{ translate('core.name') }}</th>
      <td mat-cell *matCellDef="let element">{{ element.name }} {{ element.name }}</td>
    </ng-container>

    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef>{{ translate('core.email') }}</th>
      ...
    </ng-container>
  </table>
</mat-card>
```

</p>
</details>

<details>
<summary>checkout-product.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'checkout'">
  <div class="image">
    <img [src]="product().imageUrl" width="150" />
  </div>
  <div class="product">
    <p>{{ product().name }}</p>
    <p>{{ product().description }}</p>
    <p>{{ translate('price') }} {{ product().price | currency }}</p>
    <p>
      <b>
        {{ translate('total') }}
        {{ product().price * quantity | currency }}
      </b>
    </p>
    <mat-form-field>
      <mat-label>{{ translate('quantity') }}</mat-label>
      ...
    </mat-form-field>
  </div>
</ng-container>
```

</p>
</details>

<details>
<summary>checkout-products.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'checkout'">
  <h2>{{ translate('articles') }}</h2>
  <div class="products">
    <sn-checkout-product
      [product]="checkoutProduct.product"
      [quantity]="checkoutProduct.quantity"
      (quantityChange)="onQuantityReduce($event, checkoutProduct.product.id)"
      *ngFor="let checkoutProduct of checkoutProducts"
    />
    @if(checkoutProducts.length === 0) {
      <p> <b> {{ translate('noItems') }} </b></p>
    }
  </div>
</ng-container>
```

</p>
</details>

<details>
<summary>confirm-checkout.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'checkout'">
  <div>
    <h2>{{ translate('payTitle') }}</h2>
    <ul>
      <li>{{ translate('payHint0') }}</li>
      <li>{{ translate('payHint1') }}</li>
      <li>{{ translate('payHint2') }}</li>
      <li>{{ translate('payHint3') }}</li>
      <li>{{ translate('payHint4') }}</li>
      <li>{{ translate('payHint5') }}</li>
    </ul>
    <p>
      {{ translate('payHint6') }}
    </p>
    <p>
      <b> {{ translate('total') }} {{ total() | currency }} </b>
    </p>
  </div>
  <button [disabled]="total() === 0" mat-raised-button (click)="buyClick.emit()">
    {{ translate('pay') }}
  </button>
</ng-container>

```

</p>
</details>

<details>
<summary>delivery-address.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'checkout'">
  <h2>{{ translate('deliveryAddress') }}</h2>
  ...
</ng-container>
```

</p>
</details>

<details>
<summary>checkout-button.component.html</summary>
<p>

```html
<a
  mat-raised-button
  color="primary"
  [routerLink]="'/' + AbsoluteAppRoutes.checkout"
  *transloco="let translate; prefix: 'core'">
  {{ translate('goToCheckout') }}</a
>
```

</p>
</details>

<details>
<summary>checkout-complete.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'checkout'">
  <h2>{{ translate('thanks') }}</h2>
  <button
    mat-raised-button
    color="primary"
    [routerLink]="'/' + AbsoluteAppRoutes.dashboard"
  >
    {{ translate('goToDashboard') }}
  </button>
</ng-container>
```

</p>
</details>

<details>
<summary>product-groups-item.component.html</summary>
<p>

```html
<mat-card [routerLink]="[productGroupUrl]" *transloco="let translate; prefix: 'core'">
  <mat-card-title>{{ productGroup.name }} </mat-card-title>
  <mat-card-content>
    <img [src]="productGroup.imageUrl" alt="Produkt-Foto" />
  </mat-card-content>
  <mat-card-actions
    ><span>{{ translate('discover') }}</span>
  </mat-card-actions>
</mat-card>
```

</p>
</details>

<details>
<summary>footer.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'core'">
  <img src="assets/images/logo.svg" [alt]="translate('dashboardAnchor')" width="100" />
  <div class="information-block">
    <h2>{{ translate('contact') }}</h2>
    <a routerLink="404"><mat-icon>phone</mat-icon>+49 5251 1581 0</a>
    <a routerLink="404"><mat-icon>fax</mat-icon>+49 5251 1581 71</a>
    <a routerLink="404"><mat-icon>mail</mat-icon>info@sn-invent.de</a>
  </div>
  <div class="information-block">
    <h2>{{ translate('aboutSnWebshop') }}</h2>
    <a routerLink="404"><mat-icon>chevron_right</mat-icon>{{ translate('aboutUs') }}</a>
    <a routerLink="404"><mat-icon>chevron_right</mat-icon>{{ translate('impressum') }}</a>
  </div>
</ng-container>
```

</p>
</details>

<details>
<summary>dashboard-anchor.component.html</summary>
<p>

```html
<div class="dashboard-anchor" *transloco="let translate; prefix: 'core'">
  <img src="assets/images/logo.jpg" [routerLink]="RelativeAppRoutes.main" alt="{{ translate('dashboardAnchor') }}" />
</div>
```

</p>
</details>

<details>
<summary>search.component.html</summary>
<p>

```html
<div *transloco="let translate; prefix: 'core'">
  <mat-form-field>
    <mat-label>{{ translate('searchInput') }}</mat-label>
    <input matInput [formControl]="control" />
  </mat-form-field>
</div>
```

</p>
</details>

<details>
<summary>user-menu.component.html</summary>
<p>

```html
<div *transloco="let translate; prefix: 'core'">
  <button dataTestId="menu-trigger-button" mat-button [matMenuTriggerFor]="menu">
    <mat-icon>expand_more</mat-icon>
    {{ translate('userMenuTrigger', { username: username ? username : 'there' }) }}
  </button>
  <mat-menu #menu="matMenu">
    @if (isUser) {
      <button dataTestId="settings-button" mat-menu-item [routerLink]="['settings']">
        <mat-icon>settings</mat-icon>
        <span>{{ translate('settings') }}</span>
      </button>
    }
    @if (isAdmin) {
      <button dataTestId="admin-button" mat-menu-item[routerLink]="['admin']">
        <mat-icon>admin_panel_settings</mat-icon>
        <span>{{ translate('adminSpace') }}</span>
      </button>
    }
    @if (!isLoggedIn) {
      <button dataTestId="login-button" mat-menu-item [routerLink]="['/login']">
        <mat-icon>login</mat-icon>
        <span>{{ translate('login') }}</span>
      </button>
      <button dataTestId="register-button" mat-menu-item [routerLink]="['/registration']">
        <mat-icon>person_add</mat-icon>
        <span>{{ translate('register') }}</span>
      </button>
    }
    @if (isLoggedIn) {
      <button dataTestId="logout-button" mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>{{ translate('logout') }}</span>
      </button>
    }
  </mat-menu>
</div>
```

</p>
</details>

<details>
<summary>login.component.html <b>Mehrere Direktiven!</b></summary>
<p>

```html
<ng-content *transloco="let translate; prefix: 'auth'">
  <mat-card *transloco="let translate2" (keyup.enter)="login()">
    <mat-card-title> {{ translate('login.title') }} </mat-card-title>

    <mat-card-content>
      <form [formGroup]="loginForm">
        <mat-form-field dataTestId="email">
          <mat-label>{{ translate('email') }}</mat-label>
          <input id="email" type="text" matInput formControlName="email" />
          @if (loginForm.get('email')?.hasError('required')) {
            <mat-error>{{ translate2('validation.required') }}</mat-error>
          }
          @if (loginForm.get('email')?.hasError('email')) {
            <mat-error>{{ translate2('validation.email') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field dataTestId="password">
          <mat-label>{{ translate('password') }}</mat-label>
          <input id="password" type="password" matInput formControlName="password" />
          @if (loginForm.get('password')?.hasError('required')) {
            <mat-error>{{ translate2('validation.required') }}</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-card-content>
    @if (invalidLogin) {
      <mat-error>{{ translate2('login.invalid') }}</mat-error>
    }
    <mat-card-actions>
      <button dataTestId="login-button" mat-raised-button (click)="login()">
        {{ translate('login.button') }}
      </button>

      <a
        dataTestId="register-anchor"
        mat-raised-button
        color="primary"
        *transloco="let translate; prefix: 'core'"
        [routerLink]="['/' + absoluteAppRoutes.registration]">
        {{ translate('register') }}
      </a>
    </mat-card-actions>
  </mat-card>
</ng-content>
```

</p>
</details>

<details>
<summary>not-found.component.html</summary>
<p>

```html
<mat-card *transloco="let translate; prefix: 'notFound'">
  <mat-card-title> {{ translate('title') }} </mat-card-title>
  <mat-card-content>
    <span>{{ translate('description') }}</span>
  </mat-card-content>
  <mat-card-actions>
    <a color="primary" [routerLink]="['/' + absoluteAppRoutes.dashboard]">
      {{ translate('backToDashboard') }}
    </a>
  </mat-card-actions>
</mat-card>
```

</p>
</details>

<details>
<summary>payment-type.component.html</summary>
<p>

```html
<ng-container class="row" *transloco="let translate; prefix: 'checkout'">
  <h2>{{ translate('payment') }}</h2>
  <div class="payment">
    <p>{{ translate('ibanEndsWith') }} {{  paymentInformation.iban | obscureString }}</p>
  </div>
</ng-container>
```

</p>
</details>

<details>
<summary>product-basket-options.component.html</summary>
<p>

```html

<ng-container *transloco="let translate; prefix: 'product'">
  <div>{{ translate('price') }}: {{ product().price }}$</div>
  <div>{{ translate('delivery') }}: {{ product().deliveryDuration }}</div>
  <div>{{ translate('availableQuantity') }}: {{ product().availableQuantity - productQuantity() }}</div>
  <button mat-raised-button color="primary" [disabled]="product().availableQuantity <= 0" (click)="addClick.emit()">
    {{ translate('addToCart') }}
  </button>
</ng-container>
```

</p>
</details>

<details>
<summary>products.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'products'">
  @for (product of products$ | async; track product) {
    <sn-products-item [product]="product"></sn-products-item>
  }
  @if ((products$ | async)?.length === 0) {
    <div>{{ translate('noProducts') }}</div>
  }
</ng-container>
```

</p>
</details>

<details>
<summary>payment-information-form.component.html <b>Mehrere Direktiven!</b></summary>
<p>

```html
<ng-container *transloco="let t1; prefix: 'settings'">
  <ng-container *transloco="let t2; prefix: 'validation'">
    @if (paymentInformationForm) {
      <form [formGroup]="paymentInformationForm">
        <mat-form-field>
          <mat-label>{{ t1('iban') }}</mat-label>
          <input id="iban" type="text" matInput formControlName="iban" />
          @if (paymentInformationForm.get('iban')?.hasError('required')) {
            <mat-error> {{ t2('required') }} </mat-error>
          }
          @if (paymentInformationForm.get('iban')?.hasError('iban')) {
            <mat-error> {{ t2('iban') }} </mat-error>
          }
          <mat-hint>{{ t1('ibanHint') }}</mat-hint>
        </mat-form-field>
      </form>
    }
  </ng-container>
</ng-container>
```

</p>
</details>

<details>
<summary>registration.component.html</summary>
<p>

```html
<mat-card *transloco="let translate; prefix: 'auth'" appearance="outlined" (keyup.enter)="register()">
  <mat-card-title>{{ translate('registration.title') }}</mat-card-title>

  <mat-card-content *transloco="let translate2">
    <form [formGroup]="registerForm">
      <mat-form-field>
        <mat-label>{{ translate('name') }}</mat-label>
        <input id="name" type="text" matInput formControlName="name" />
        @if (registerForm.get('name')?.hasError('required')) {
          <mat-error>{{ translate2('validation.required') }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('email') }}</mat-label>
        <input id="email" type="email" matInput autocomplete="username" formControlName="email" />
        @if (registerForm.get('email')?.status === 'PENDING') {
          <mat-spinner matSuffix [diameter]="18" />
        }
        @if (registerForm.get('email')?.hasError('required')) {
          <mat-error>{{ translate2('validation.required') }}</mat-error>
        }
        @if (registerForm.get('email')?.hasError('email')) {
          <mat-error>{{ translate2('validation.email') }}</mat-error>
        }
        @if (registerForm.get('email')?.hasError('emailAlreadyUsed')) {
          <mat-error>{{ translate2('validation.emailAlreadyUsed') }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('password') }}</mat-label>
        <input id="password" type="password" matInput autocomplete="new-password" formControlName="password" />
        @if (registerForm.get('password')?.hasError('passwordStrength')) {
          <mat-error>
            {{ translate2('validation.passwordStrength') }}
          </mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('password2') }}</mat-label>
        <input
          id="confirmPassword"
          type="password"
          matInput
          autocomplete="new-password"
          formControlName="confirmPassword" />
        @if (registerForm.get('confirmPassword')?.hasError('required')) {
          <mat-error>{{ translate2('validation.required') }} </mat-error>
        }
        @if (registerForm.get('confirmPassword')?.hasError('passwordsMatch')) {
          <mat-error>{{ translate2('validation.required') }}</mat-error>
        }
      </mat-form-field>
      <div class="adress-form" *transloco="let translate; prefix: 'settings'">
        <mat-form-field class="street-nr">
          <mat-label>{{ translate('streetNr') }}</mat-label>
          <input type="text" matInput formControlName="streetNr" />
          @if (registerForm.get('streetNr')?.hasError('required')) {
            <mat-error> {{ translate2('validation.required') }} </mat-error>
          }
        </mat-form-field>

        <mat-form-field class="zip">
          <mat-label>{{ translate('zip') }}</mat-label>
          <input type="text" matInput formControlName="zip" />
          @if (registerForm.get('zip')?.hasError('required')) {
            <mat-error> {{ translate2('validation.required') }} </mat-error>
          }
        </mat-form-field>

        <mat-form-field class="city">
          <mat-label>{{ translate('city') }}</mat-label>
          <input type="text" matInput formControlName="city" />
          @if (registerForm.get('city')?.hasError('required')) {
            <mat-error> {{ translate2('validation.required') }} </mat-error>
          }
        </mat-form-field>
      </div>

      <sn-payment-information-form></sn-payment-information-form>
    </form>
  </mat-card-content>
  @if (invalidRegistration) {
    <mat-error> {{ translate('registration.invalid') }} </mat-error>
  }
  <mat-card-actions>
    <button
      mat-raised-button
      color="primary"
      [disabled]="registerForm.invalid || registerForm.status === 'PENDING'"
      (click)="register()"
      (keyup.enter)="register()">
      {{ translate('createAccount') }}
    </button>
  </mat-card-actions>
</mat-card>
```

</p>
</details>

<details>
<summary>settings.component.html</summary>
<p>

```html
<ng-container *transloco="let translate; prefix: 'settings'">
  <mat-card>
    <mat-card-title>{{ translate('addresses') }}</mat-card-title>
    <mat-card-content> </mat-card-content>
    <mat-card-actions>
      <button mat-raised-button color="primary" (click)="saveSettings()" (keyup.enter)="saveSettings()">
        {{ translate('save') }}
      </button>
    </mat-card-actions>
  </mat-card>
</ng-container>
```

</p>
</details>

## 3. Language Switcher aktivieren

Eine Komponente für das wechseln der Sprache ist bereits erstellt worden (language-select.component.html). 
Die Komponente muss nun so geändert werden, dass die Anchors die tatsächlich verfügbaren Sprachen anzeigt und bei Auswahl den Sprachwechsel auslöst.

<details>
<summary>Lösung anzeigen</summary>
<p>

_language-select.component.ts_

```typescript
@Component({
  selector: 'sn-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class LanguageSelectComponent {
  private transloco = inject(TranslocoService);

  protected readonly activeLanguage = signal('');
  protected readonly languages = signal<string[]>([]);

  constructor() {
    this.activeLanguage.set(this.transloco.getActiveLang());
    this.languages.set(this.transloco.getAvailableLangs() as string[]);
  }

  changeLanguage(language: string, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.transloco.setActiveLang(language);
    this.activeLanguage.set(language);
  }
}
```

\_language-select.component.html

```html
|
<ng-container *transloco="let translate; prefix: 'core'">
  @for (language of languages(); track language) {
    <a
      href=""
      class="language"
      [class.active]="language === activeLanguage()"
      (click)="changeLanguage(language, $event)">
      {{ translate(language) }}
    </a>
  }
</ng-container>
```

</p>
</details>
