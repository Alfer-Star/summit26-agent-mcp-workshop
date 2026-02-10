# Angular für Fortgeschrittene - Aufgabe Reactive Forms

## 1. Validatoren

### 1.1 Einfacher Validator

Zur auffrischung soll erstmal ein einfacher Custom-Validator hinzugefügt werden. Implementiert einen Validator mit dem
Namen passwordStrength, diesen könnt ihr der existierenden CustomValidators-Klasse hinzufügen. Der Validator soll
validieren ob das Passwort stark genug ist, benutzt dafür folgendes RegEx
`/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/`

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

Validator erstellen:

_custom-validator.ts_

```typescript
export class CustomValidators {
  static passwordStrength(ctrl: AbstractControl): ValidationErrors | null {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return pattern.test(ctrl.value) ? null : { passwordStrength: true };
  }
  ...
}
```

Validator verwenden:

_registration.component.ts_

```typescript
this.registerForm = fb.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, CustomValidators.passwordStrength]],
  confirmPassword: ['', [Validators.required]],
  streetNr: [''],
  zip: [''],
  city: [''],
  iban: ['', [Validators.required, CustomValidators.iban]],
});
```

</p>
</details>

### 1.2 Multi-Field-Validator

Es soll sichergestellt werden das der Nutzer in die Felder `password` und `confirmPassword` die selben Daten eingegeben
hat. Entwickelt einen Multi-Field-Validator (passwordsMatchValidator) der sicherstellt das beide Felder den gleichen
Wert enthalten. Der Validator kann auch der CustomValidator-Klasse hinzugefügt werden. Setzt im Validator den Fehler für
das Feld `confirmPassword`.

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

Validator erstellen:

_custom-validator.ts_

```typescript
export class CustomValidators {
  static passwordsMatchValidator(control: AbstractControl): void {
    const passwordCtrl = control.get('password') as FormControl<string>;
    const confirmPasswordCtrl = control.get('confirmPassword') as FormControl<string>;
    if (
      passwordCtrl &&
      confirmPasswordCtrl &&
      passwordCtrl.value !== confirmPasswordCtrl.value
    ) {
      confirmPasswordCtrl.setErrors({ passwordsMatch: true });
    } else if (confirmPasswordCtrl?.hasError('passwordsMatch')) {
      confirmPasswordCtrl.updateValueAndValidity();
    }
  }
  ...
}
```

**Schritt 2**

Validator verwenden:

_registration.component.ts_

```typescript
this.registerForm = fb.group(
  {
    ...
    password: ['', [Validators.required, CustomValidators.passwordStrength]],
    confirmPassword: ['', [Validators.required]],
    ...
  },
  { validators: [CustomValidators.passwordsMatchValidator] }
);
```

</p>
</details>

### 1.3 Async-Validator

Wir müssen verhindern das bei der Registrierung mehrere Nutzer mit der gleichen Mail-Adresse angelegt werden können. Der
`AuthHttpService` stell dafür die Methode `isEmailAlreadyRegistered` bereit. Erstellen sie einen Asynchronen Validator,
der überprüft ob die Mail-Adresse bereits verwendet wird. Legt dafür zunächste die Datei `custom-async-validator` an und
implementiert den Validatoren darin..

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

Validator erstellen:

_email-already-used-validator.ts_

```typescript
import { AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthHttpService } from '../service/auth/auth-http.service';

export class EmailAlreadyUsedValidator {
  static createValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authHttpService
        .isEmailAlreadyRegistered(control.value)
        .pipe(map((result: boolean) => (result ? { emailAlreadyUsed: true } : null)));
    };
  }
}
```

**Schritt 2**

Validator verwenden:

_registration.component.ts_

```typescript
this.registerForm = fb.group(
  {
    ...
    email: [
          '',
          [Validators.required, Validators.email],
          [EmailAlreadyUsedValidator.createValidator(this.authService)],
        ],
    ...
  },
);
```

</p>
</details>

## 2. FormArrays

Der Nutzer soll die Möglichkeit bekommen, auf der Settings-Seite seinen Namen sowie seine Adressdaten zu ändern. Dabei
soll der Nutzer mehrere Adressen hinzufügen, ändern und löschen können. Der Auth-Service bietet dafür die Methode
`patch`. Das Template für die Adress-Eingabefelder kann von der Registrierung kopiert werden.

Als Grundlage könnt Ihr folgenden (unvollständigen) Beispielcode für die `settings.component.ts` und
`settings.component.html` verwenden:

<details>
<summary>settings.component.ts</summary>
<p>

```typescript
@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    MatCard,
    ReactiveFormsModule,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatIcon,
    MatCardActions,
    MatButton,
    MatIconButton,
  ],
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthHttpService);
  private readonly userService = inject(UserService);
  settingsForm!: FormGroup;
  addressFormArray?: FormArray;

  constructor() {
    const user = this.userService.user;
    if (user) {
      this.settingsForm = this.fb.group({
        id: [user.id],
        name: [user.name, Validators.required],
        addresses: this.fb.array(user.addresses.map((address) => this.getAddressFormGroup(address))),
      });
      this.addressFormArray = this.settingsForm.get('addresses') as FormArray;
    } else {
      this.router.navigate([AbsoluteAppRoutes.login]);
    }
  }

  addAddress(): void {
    // Implementier mich
  }

  getAddressFormGroup(address?: Address): FormGroup {
    return this.fb.group(
      address
        ? {
            streetNr: [address.streetNr],
            zip: [address.zip],
            city: [address.city],
          }
        : {
            streetNr: [''],
            zip: [''],
            city: [''],
          }
    );
  }

  delete(index: number): void {
    // Implementier mich!
  }

  saveSettings(): void {
    this.authService
      .patch(this.settingsForm?.value)
      .subscribe((user) => (this.userService.user = user));
  }
}
```

</p>
</details>

<details>
<summary>settings.component.html</summary>
<p>

```html
...
<mat-card-content *transloco="let translate">
  <mat-form-field>
    <mat-label>{{ translate('settings.name') }}</mat-label>
    <input id="name" type="text" matInput formControlName="name" />
    @if (settingsForm.get('name')?.hasError('required')) {
      <mat-error>{{ translate('validation.required') }}</mat-error>
    }
  </mat-form-field>
  <div class="addresses">
        @for (
          address of addressFormArray?.controls;
          track address;
          let i = $index;
          let last = $last;
          let count = $count
        ) {
          <div class="adress" formArrayName="addresses" *transloco="let translate2">
            <!-- Hier das Address Formular hinzufügen -->
            @if (count > 1) {
              <button mat-icon-button (click)="delete(i)">
                <mat-icon>delete</mat-icon>
              </button>
            }
            @if (last) {
              <button mat-icon-button (click)="addAddress()">
                <mat-icon>add</mat-icon>
              </button>
            }
          </div>
        }
      </div>
</mat-card-content>
...
```

</p>
</details>

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

`addAdress()` und `delete()` Funktion implementieren:

_settings.component.ts_

```typescript
addAddress(): void {
  this.addressFormArray?.push(this.getAddressFormGroup());
}
  ...

delete(index: number): void {
  this.addressFormArray?.removeAt(index);
}
```

**Schritt 2**

Formular im Template hinzufügen:

settings.component.html\_

```html
...
<div class="addresses">
  @for (
    address of addressFormArray?.controls;
    track address;
    let i = $index;
    let last = $last;
    let count = $count
  ) {
    <div class="address" formArrayName="addresses" *transloco="let translate2">
      <ng-container [formGroupName]="i">
        <mat-form-field class="street-nr" appearance="outline">
          <mat-label>{{ translate('settings.streetNr') }}</mat-label>
          <input type="text" matInput formControlName="streetNr" />
          @if (address.get('streetNr')?.hasError('required')) {
            <mat-error> {{ translate('validation.required') }} </mat-error>
          }
        </mat-form-field>

        <mat-form-field class="zip" appearance="outline">
          <mat-label>{{ translate('settings.zip') }}</mat-label>
          <input type="text" matInput formControlName="zip" />
          @if (address.get('zip')?.hasError('required')) {
            <mat-error> {{ translate2('validation.required') }} </mat-error>
          }
        </mat-form-field>

        <mat-form-field class="city" appearance="outline">
          <mat-label>{{ translate('settings.city') }}</mat-label>
          <input type="text" matInput formControlName="city" />
          @if (address.get('city')?.hasError('required')) {
            <mat-error> {{ translate2('validation.required') }} </mat-error>
          }
        </mat-form-field>
      </ng-container>
      @if (count > 1) {
        <button mat-icon-button (click)="delete(i)">
          <mat-icon>delete</mat-icon>
        </button>
      }
      @if (last) {
        <button mat-icon-button (click)="addAddress()">
          <mat-icon>add</mat-icon>
        </button>
      }
    </div>
  }
</div>
...
```

</p>
</details>

## 3. Control-Container

Momentan haben wir den Template-Code für die Adresseingabe mehrfach in der Applikation (`settings.component.html`/
`registration.component.html`). Lagert die Formularfelder für die Adresseingabe in eine extra Komponente (
AddressFormComponent) aus. Verwendet den `ControlContainer`.

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

Komponente erstellen 

_adress-form.component.html_

```html
<ng-container *transloco="let translate">
  @if (addressForm) {
    <form [formGroup]="addressForm">
      <mat-form-field class="street-nr" appearance="outline">
        <mat-label>{{ translate('settings.streetNr') }}</mat-label>
        <input type="text" matInput formControlName="streetNr" />
        @if (addressForm.get('streetNr')?.hasError('required')) {
          <mat-error>{{ translate('validation.required') }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field class="zip" appearance="outline">
        <mat-label>{{ translate('settings.zip') }}</mat-label>
        <input type="text" matInput formControlName="zip" />
        @if (addressForm.get('zip')?.hasError('required')) {
          <mat-error>{{ translate('validation.required') }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field class="city" appearance="outline">
        <mat-label>{{ translate('settings.city') }}</mat-label>
        <input type="text" matInput formControlName="city" />
        @if (addressForm.get('city')?.hasError('required')) {
          <mat-error>{{ translate('validation.required') }}</mat-error>
        }
      </mat-form-field>
    </form>
  }
</ng-container>
```

_adress-form.component.scss_

```scss
@use 'variables';
@use 'sass:map';

form {
  display: flex;
  flex-wrap: wrap;
  column-gap: map.get(variables.$margins, 'default');
  row-gap: map.get(variables.$margins, 'default');

  .street-nr,
  .city {
    flex: auto;
  }

  .zip {
    flex: 0 0 auto;
  }
}
```

_adress-form.component.ts_

```typescript
@Component({
  selector: 'sn-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError],
})
export class AddressFormComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  addressForm?: FormGroup;

  ngOnInit(): void {
    this.addressForm = this.controlContainer.control as FormGroup;
  }
}
```

**Schritt 2**

Redundanten Template code für die Eingabe der Adressdaten entfernen und Komponente verwenden:

_settings.component.html_

```html
...
@for (
  address of addressFormArray?.controls;
  track address;
  let i = $index;
  let last = $last;
  let count = $count
) {
  <div class="address" formArrayName="addresses" *transloco="let translate2">
    <sn-address-form [formGroupName]="i"></sn-address-form>
  ...
  </div>
}
...
```

_registration.component.html_

```html
...
  </mat-form-field>
  <sn-address-form></sn-address-form>
  <sn-payment-information-form></sn-payment-information-form>
...
```

</p>
</details>
