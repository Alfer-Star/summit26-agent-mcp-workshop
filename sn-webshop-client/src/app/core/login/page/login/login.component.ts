import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
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
import { UserService } from '@shared/service/user/user.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    TranslocoDirective
],
})
export class LoginComponent {
  absoluteAppRoutes = AbsoluteAppRoutes;
  invalidLogin = false;
  redirectPath?: string;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthHttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.redirectPath = this.route.snapshot.queryParamMap.get('redirect') ?? undefined;
  }

  login(): void {
    if (this.loginForm.valid) {
      const value = this.loginForm.value;
      this.authService.login(value.email, value.password).subscribe(
        (data) => {
          this.userService.user = data.user;
          this.authService.token = data.accessToken;
          if (this.redirectPath) {
            this.router.navigate([`/${this.redirectPath}`]);
          } else {
            this.router.navigate([`/${AbsoluteAppRoutes.dashboard}`]);
          }
        },
        (err) => {
          console.log(err);
          this.invalidLogin = true;
        },
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
