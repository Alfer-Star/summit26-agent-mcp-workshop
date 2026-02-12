# Angular für Fortgeschrittene - Aufgabe 11

- [Angular für Fortgeschrittene - Aufgabe 11](#Angular-für-fortgeschrittene---lab-1)
  - [1. Login-Form](#1-login-form)
  - [2. Registration-Form](#2-registration-form)
  - [3. Settings-Form](#2-registration-form)


## 1. Login-Form

Baut die Login-Komponente auf Signal-Forms um. Ihr könnte dafür die bereitgestellte login-signal-form.component verwenden (denkt daran das ihr diese dann übers Routing anbinden müsst).
Das Formular soll weiterhin so validiert werden wie es vorher mit den ReactiveForms war. Verwendet für die Anzeige der Fehler die ErrorMessagePipe
Zusätzlich soll das password-Feld ausgeblendet werden, solange das email-Feld nicht valide ist.

<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt 1**

Login-Form umstellen

__login-signal-form.component.ts__
```TypeScript
export class LoginSignalFormComponent {
  private readonly authService = inject(AuthHttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(StorageService);

  absoluteAppRoutes = AbsoluteAppRoutes;
  invalidLogin = false;
  redirectPath = this.route.snapshot.queryParamMap.get('redirect') ?? undefined;
  
  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, (schemaPath) => {
    email(schemaPath.email);
    required(schemaPath.email);
    required(schemaPath.password);
  });

  login(): void {
    if (this.loginForm().valid()) {
      const value = this.loginForm().value();
      this.authService.login(value.email, value.password).subscribe(
        (data) => {
          this.tokenStorage.saveTokenAndUser(data);
          if (this.redirectPath) {
            this.router.navigate([`/${this.redirectPath}`]);
          } else {
            this.router.navigate([`/${AbsoluteAppRoutes.dashboard}`]);
          }
        },
        () => {
          this.invalidLogin = true;
          return EMPTY;
        },
      );
    } else {
      this.loginForm().markAsTouched();
    }
  }
}
```

__login-signal-form.component.html__
```html
<mat-card appearance="outlined" *transloco="let translate; prefix: 'auth'" (keyup.enter)="login()">
  <mat-card-title>
    {{ translate('login.title') }}
  </mat-card-title>

  <mat-card-content>
    <form>
      <mat-form-field snTestId="email">
        <mat-label>{{ translate('email') }}</mat-label>
        <input id="email" type="text" matInput [formField]="loginForm.email" />
        @for (error of loginForm.email().errors(); track error) {
          <mat-error>{{ error | errorMessage | transloco }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field snTestId="password">
        <mat-label>{{ translate('password') }}</mat-label>
        <input id="password" type="password" matInput [formField]="loginForm.password" />
        @for (error of loginForm.email().errors(); track error) {
          <mat-error>{{ error | errorMessage | transloco }}</mat-error>
        }
      </mat-form-field>
    </form>
  </mat-card-content>
  @if (invalidLogin) {
    <mat-error>{{ translate('login.invalid') }}</mat-error>
  }
  <mat-card-actions>
    <button snTestId="login-button" mat-raised-button [disabled]="!loginForm().valid()" (click)="login()">
      {{ translate('login.button') }}
    </button>

    <a
      snTestId="register-anchor"
      mat-raised-button
      *transloco="let translate; prefix: 'core'"
      [routerLink]="['/' + absoluteAppRoutes.registration]">
      {{ translate('register') }}
    </a>
  </mat-card-actions>
</mat-card>
```

**2. Schritt 2**



```TypeScript
export class LoginSignalFormComponent {
...
  loginForm = form(this.loginModel, (schemaPath) => {
    email(schemaPath.email);
    required(schemaPath.email);
    required(schemaPath.password);
    hidden(schemaPath.password, ({ stateOf }) => stateOf(schemaPath.email).invalid());
  });
...
```

__login-signal-form.component.html__
```html
...
@if (!loginForm.password().hidden()) {
  <mat-form-field snTestId="password">
    <mat-label>{{ translate('password') }}</mat-label>
    <input id="password" type="password" matInput [formField]="loginForm.password" />
    @for (error of loginForm.email().errors(); track error) {
      <mat-error>{{ error | errorMessage | transloco }}</mat-error>
    }
  </mat-form-field>
}
...
```

</p>
</details>


## 2. Registration-Form

Baut die Registration-Komponente auf Signal-Forms um. Ihr könnte dafür die bereitgestellte registration-signal-form.component verwenden (denkt daran das ihr diese dann übers Routing anbinden müsst).
Das Formular soll weiterhin so validiert werden wie es vorher mit den ReactiveForms war. Verwendet für die Anzeige der Fehler die ErrorMessagePipe.
Das Email-Feld soll erst nach einem delay von 300ms die Eingabe validieren.
In diesem Zuge müssen auch die AddressForm und die PaymentInformationForm umgebaut werden. Nutzt dafür die  payment-information-signal-form.component und die address-signal-form.component. Beide sollen eine eigene Schmedefinition bereitstellen. Die AddressForm soll für alle ihre Felder den Required-Validator setzen.
Denkt daran das alle verwendeten Custom-Validator nun umgeschrieben werden müssen für die Signal-Forms.


<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt 1**

Address-Form

__address-signal-form.component.ts__
```TypeScript
export class AddressSignalFormComponent {
  readonly addressForm = input.required<FieldTree<Address>>();
}

export const addressSchema = schema<Address>((path) => {
  required(path.city);
  required(path.streetNr);
  required(path.zip);
});
```

__address-signal-form.component.html__
```html
<ng-container *transloco="let translate; prefix: 'settings'">
  <form>
    @let form = addressForm();
    <mat-form-field class="street-nr">
      <mat-label>{{ translate('streetNr') }}</mat-label>
      <input type="text" matInput [formField]="form.streetNr" />
      @for (error of form.streetNr().errors(); track error) {
        <mat-error>{{ error | errorMessage | transloco }}</mat-error>
      }
    </mat-form-field>
    <mat-form-field class="zip">
      <mat-label>{{ translate('zip') }}</mat-label>
      <input type="text" matInput [formField]="form.zip" />
      @for (error of form.zip().errors(); track error) {
        <mat-error>{{ error | errorMessage | transloco }}</mat-error>
      }
    </mat-form-field>
    <mat-form-field class="city">
      <mat-label>{{ translate('city') }}</mat-label>
      <input type="text" matInput [formField]="form.city" />
      @for (error of form.city().errors(); track error) {
        <mat-error>{{ error | errorMessage | transloco }}</mat-error>
      }
    </mat-form-field>
  </form>
</ng-container>
```

**2. Schritt 2**

IBAN-Validator

__custom-validator.ts__
```TypeScript
export function iban(path: SchemaPathTree<string>) {
  validate(path, (ctx) => {
    const ibanRegex = /^[A-Z]{2}(?:[ ]?[0-9]){18,20}$/;
    const iban = ctx.value();

    if (!ibanRegex.test(iban)) {
      return { kind: 'iban' };
    }

    return null;
  });
}
```

Payment-Information-Form

__payment-information-signal-form.component.ts__
```TypeScript
export class PaymentInformationSignalFormComponent {
  paymentInformationForm = input.required<FieldTree<PaymentInformation>>();
}

export const PaymentInformationSchema = schema<PaymentInformation>((path) => {
  required(path.iban);
  iban(path.iban);
});
```

__payment-information-signal-form.component.html__
```html
<ng-container *transloco="let t1; prefix: 'settings'">
  <ng-container *transloco="let t2; prefix: 'auth.validation'">
    <form>
      @let form = paymentInformationForm();
      <mat-form-field>
        <mat-label>{{ t1('iban') }}</mat-label>
        <input id="iban" type="text" matInput [formField]="form.iban" />
        @for (error of form.iban().errors(); track error) {
          <mat-error>{{ error | errorMessage | transloco }}</mat-error>
        }
        <mat-hint>{{ t1('ibanHint') }}</mat-hint>
      </mat-form-field>
    </form>
  </ng-container>
</ng-container>
```


**2. Schritt 2**

PasswordStrengthValidator und PasswordsMatchValidator

__custom-validator.ts__
```TypeScript
export function passwordStrength(path: SchemaPathTree<string>, options?: { message?: string }) {
  validate(path, (ctx) => {
    const value = ctx.value();
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    return pattern.test(value) ? null : { kind: 'passwordStrength', message: options?.message };
  });
}

export function passwordsMatch(
  path: SchemaPathTree<{ password: string; confirmPassword: string }>,
  options?: { message?: string },
) {
  validateTree(path, (ctx) => {
    const passwordValue = ctx.fieldTree.password().value();
    const confirmPasswordValue = ctx.fieldTree.confirmPassword().value();
    if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
      return {
        kind: 'passwordsMatch',
        field: ctx.fieldTree.password,
        message: options?.message,
      };
    } else {
      return null;
    }
  });
}
```

EmailAlreadyUsed

__email-already-used-validator.ts__
```TypeScript
export function emailAlreadyUsed(path: SchemaPathTree<string>, options?: { message?: string }) {
  validateHttp(path, {
    request: (ctx) => ({
      url: `${environment.url}/auth/checkEmail`,
      params: {
        email: ctx.value(),
      },
    }),
    onSuccess: (emailAlreadyUsed: boolean) => {
      if (emailAlreadyUsed) {
        return {
          kind: 'emailAlreadyUsed',
          message: options?.message || 'validation.emailAlreadyUsed',
        };
      }
      return null;
    },
    onError: (error) => {
      console.error('api error validating email', error);
      return {
        kind: 'api-failed',
      };
    },
  });
}
```

Registration-Form

__registration-signal-form.component.ts__
```TypeScript
export class RegistrationSignalFormsComponent {
  private readonly authService = inject(AuthHttpService);
  private readonly router = inject(Router);

  invalidRegistration = false;
  absoluteAppRoutes = AbsoluteAppRoutes;
  registerModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    streetNr: '',
    zip: '',
    city: '',
    iban: '',
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
    email(schemaPath.email);
    debounce(schemaPath.email, 300);
    required(schemaPath.password);
    required(schemaPath.confirmPassword);

    passwordStrength(schemaPath.password);
    passwordsMatch(schemaPath);
    emailAlreadyUsed(schemaPath.email);
    apply(schemaPath, PaymentInformationSchema);
    apply(schemaPath, addressSchema);
  });

  register(): void {
    if (this.registerForm().valid()) {
      this.authService.register(this.registerForm().value()).subscribe({
        next: () => this.router.navigate([AbsoluteAppRoutes.login]),
        error: () => {
          this.invalidRegistration = true;
          return EMPTY;
        },
      });
    } else {
      this.registerForm().markAsTouched();
    }
  }
}
```

__registration-signal-form.component.html__
```html
<mat-card appearance="outlined" *transloco="let translate; prefix: 'auth'" (keyup.enter)="register()">
  <mat-card-title>
    {{ translate('registration.title') }}
  </mat-card-title>

  <mat-card-content>
    <form *transloco="let translateValidation">

      <mat-form-field>
        <mat-label>{{ translate('name') }}</mat-label>
        <input id="name" type="text" matInput [formField]="registerForm.name" />
        @for (error of registerForm.name().errors(); track error) {
          <mat-error>{{ translateValidation(error | errorMessage) }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('email') }}</mat-label>
        <input id="email" type="email" matInput autocomplete="username" [formField]="registerForm.email" />
        @for (error of registerForm.email().errors(); track error) {
          <mat-error>{{ translateValidation(error | errorMessage) }}</mat-error>
        }
        @if (registerForm.email().pending()) {
          <mat-spinner matSuffix [diameter]="18"></mat-spinner>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('password') }}</mat-label>
        <input id="password" type="password" matInput autocomplete="new-password" [formField]="registerForm.password" />
        @for (error of registerForm.password().errors(); track error) {
          <mat-error>{{ translateValidation(error | errorMessage) }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>{{ translate('password2') }}</mat-label>
        <input
          id="confirmPassword"
          type="password"
          matInput
          autocomplete="new-password"
          [formField]="registerForm.confirmPassword" />
        @for (error of registerForm.name().errors(); track error) {
          <mat-error>{{ translateValidation(error | errorMessage) }}</mat-error>
        }
      </mat-form-field>
      <sn-address-signal-form [addressForm]="registerForm" />
      <sn-payment-information-signal-form [paymentInformationForm]="registerForm" />
    </form>
  </mat-card-content>
  @if (invalidRegistration) {
    <mat-error>{{ translate('registration.invalid') }}</mat-error>
  }
  <mat-card-actions>
    <button
      mat-raised-button
      [disabled]="registerForm().invalid || registerForm().pending()"
      (click)="register()"
      (keyup.enter)="register()">
      {{ translate('createAccount') }}
    </button>
  </mat-card-actions>
</mat-card>

```

</p>
</details>

## 3. Settings-Form

Baut die Settings-Komponente auf Signal-Forms um. Ihr könnte dafür die bereitgestellte settings-signal-form.component verwenden (denkt daran das ihr diese dann übers Routing anbinden müsst).
Das Formular soll weiterhin so validiert werden wie es vorher mit den ReactiveForms war. Verwendet für die Anzeige der Fehler die ErrorMessagePipe.

Erweiter die address-signal-form.component um eine Konstante die einen leeren Address-Datensatz enthält. Verwendet die Konstante für das hinzufügen neuer Adressen


<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt 1**

Address-Form

__address-signal-form.component.ts__
```TypeScript
export class AddressSignalFormComponent {
  ...
}

export const initAddress: Address = {
  streetNr: '',
  zip: '',
  city: '',
};
```


**2. Schritt 2**


Settings-Form

__settings-signal-form.component.ts__
```TypeScript
export class SettingsSignalFormComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthHttpService);
  private readonly userService = inject(UserService);

  settingsModel?: WritableSignal<SettingsUser>;

  settingsForm?: FieldTree<SettingsUser>;

  constructor() {
    const userService = this.userService;

    const user = userService.user;
    if (user) {
      this.settingsModel = signal({
        id: user.id,
        name: user.name,
        addresses: user.addresses,
      });
      this.settingsForm = form(this.settingsModel, (schemaPath) => {
        required(schemaPath.name);
        applyEach(schemaPath.addresses, addressSchema);
      });
    } else {
      this.router.navigate([AbsoluteAppRoutes.login]);
    }
  }

  addAddress(): void {
    this.settingsForm?.addresses().value.update((addresses) => [...addresses, { ...initAddress }]);
  }

  delete(index: number): void {
    this.settingsForm?.addresses().value.update((addresses) => {
      addresses.splice(index, 1);
      return [...addresses];
    });
  }

  saveSettings(): void {
    if (this.settingsForm) {
      this.authService.patch(this.settingsForm().value()).subscribe((user) => (this.userService.user = user));
    }
  }
}

interface SettingsUser {
  id: number;
  name: string;
  addresses: Address[];
}
```

__settings-signal-form.component.html__
```html
<ng-container *transloco="let translate">
  @if (settingsForm) {
    <mat-card appearance="outlined">
      <mat-card-title>{{ translate('settings.addresses') }}</mat-card-title>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>{{ translate('settings.name') }}</mat-label>
          <input id="name" type="text" matInput [formField]="settingsForm.name" />
          @for (error of settingsForm.name().errors(); track error) {
            <mat-error>{{ translate(error | errorMessage) }}</mat-error>
          }
        </mat-form-field>
        <div class="addresses">
          @for (
            address of settingsForm.addresses;
            track address;
            let i = $index;
            let last = $last;
            let count = $count
          ) {
            <div class="address">
              <sn-address-signal-form [addressForm]="address" />
              @if (count > 1) {
                <button mat-mini-fab (click)="delete(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              }
              @if (last) {
                <button mat-mini-fab (click)="addAddress()">
                  <mat-icon>add</mat-icon>
                </button>
              }
            </div>
          }
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button
          mat-raised-button
          [disabled]="settingsForm().invalid() || !settingsForm().touched()"
          (click)="saveSettings()"
          (keyup.enter)="saveSettings()">
          {{ translate('settings.save') }}
        </button>
      </mat-card-actions>
    </mat-card>
  }
</ng-container>
```

</p>
</details>