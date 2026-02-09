import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from '@shared/model/user/user';
import { AbsoluteAppRoutes } from '../../../app-routes.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly router = inject(Router);

  public user?: User;

  hasRole(roles: Role): boolean {
    return !!this.user?.roles?.some((role) => role === roles);
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  logout(): void {
    this.router.navigate([AbsoluteAppRoutes.login]);
    this.user = undefined;
  }
}
