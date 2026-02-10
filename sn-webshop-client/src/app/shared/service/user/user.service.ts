import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from '@shared/model/user/user';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  private _user?: User;

  get user(): User | undefined {
    if (!this._user) {
      const user = this.storageService.getUser();
      this._user = user;
    }
    return this._user;
  }

  set user(user: User | undefined) {
    this._user = user;
  }

  hasRole(roles: Role): boolean {
    return !!this.user?.roles?.some((role) => role === roles);
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  logout(): void {
    this.storageService.clearStorage();
    this.router.navigate([AbsoluteAppRoutes.login]);
    this.user = undefined;
  }
}
