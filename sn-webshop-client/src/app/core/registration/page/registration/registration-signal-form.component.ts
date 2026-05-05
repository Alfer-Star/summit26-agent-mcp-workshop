import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { passwordsMatch, passwordStrength } from '@shared/validator/custom-validator';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { EMPTY } from 'rxjs';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { apply, email, FormField, form, required, debounce } from '@angular/forms/signals';
import {
  addressSchema,
  AddressSignalFormComponent,
} from '@shared/component/address-form/address-signal-form.component';
import {
  PaymentInformationSchema,
  PaymentInformationSignalFormComponent,
} from '@shared/component/payment-information-form/payment-information-signal-form.component';
import { ErrorMessagePipe } from '@shared/pipe/error-message/error-message.pipe';
import { emailAlreadyUsed } from '@shared/validator/email-already-used-validator';

@Component({
  selector: 'sn-registration-signal-form',
  templateUrl: './registration-signal-form.component.html',
  styleUrls: ['./registration-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatProgressSpinner,
    MatSuffix,
    MatCardActions,
    MatButton,
    FormField,
    AddressSignalFormComponent,
    PaymentInformationSignalFormComponent,
    ErrorMessagePipe,
  ],
})
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
    debounce(schemaPath.email, 3000);
    required(schemaPath.password, { message: 'validation.required' });
    required(schemaPath.confirmPassword, { message: 'validation.required' });

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
