import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from "@jsverse/transloco";
import { AbsoluteAppRoutes } from '../../../app.routes.enum';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { StorageService } from '@shared/service/storage/storage.service';
import { TestIdDirective } from "@shared/directive/test-id.directive";

@Component({
  templateUrl: './login-signal-form.component.html',
  styleUrls: ['./login-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    TranslocoDirective,
    TestIdDirective
],
})
export class LoginSignalFormComponent {
  absoluteAppRoutes = AbsoluteAppRoutes;
  invalidLogin = false;
  redirectPath?: string;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthHttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(StorageService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.redirectPath = this.route.snapshot.queryParamMap.get('redirect') ?? undefined;
  }

  login(): void {
    const value = this.loginForm.value;
    if (this.loginForm.valid && value.email && value.password) {
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
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
