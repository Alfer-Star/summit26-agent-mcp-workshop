import { inject } from '@angular/core';
import { AbsoluteAppRoutes } from '../../../app.routes.enum';
import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from "@jsverse/transloco";
import { PaymentInformationFormComponent } from '@shared/component/payment-information-form/payment-information-form.component';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { CustomValidators } from '@shared/validator/custom-validator';

@Component({
  selector: 'sn-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PaymentInformationFormComponent,
    MatButtonModule,
    TranslocoDirective
],
})
export class RegistrationComponent {
  invalidRegistration = false;
  absoluteAppRoutes = AbsoluteAppRoutes;

  private fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthHttpService);
  private readonly router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    streetNr: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    iban: ['', [Validators.required, CustomValidators.iban]],
  });
  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate([AbsoluteAppRoutes.login]),
        error: () => {
          this.invalidRegistration = true;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
