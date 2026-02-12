import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { StorageService } from '@shared/service/storage/storage.service';
import { EMPTY } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TestIdDirective } from '@shared/directive/test-id.directive';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { email, form, FormField, hidden, required } from '@angular/forms/signals';
import { ErrorMessagePipe } from '@shared/pipe/error-message/error-message.pipe';

@Component({
  templateUrl: './login-signal-form.component.html',
  styleUrls: ['./login-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    TestIdDirective,
    MatLabel,
    MatInput,
    MatError,
    MatCardActions,
    MatButton,
    RouterLink,
    FormField,
    TranslocoPipe,
    ErrorMessagePipe,
  ],
})
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
    hidden(schemaPath.password, ({ stateOf }) => stateOf(schemaPath.email).invalid());
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
