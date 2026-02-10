import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { UserService } from '@shared/service/user/user.service';
import { Role } from '@shared/model/user/user';
import { TestIdDirective } from '@shared/directive/test-id.directive';

@Component({
  selector: 'sn-user-menu',
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink, TranslocoDirective, TestIdDirective,
})
export class UserMenuComponent {
  private readonly userService = inject(UserService);

  username = '';
  isAdmin = false;
  isUser = false;
  isLoggedIn = false;

  constructor() {
    const user = this.userService.user;
    this.username = user ? user.name : '';

    this.isAdmin = this.userService.hasRole(Role.Admin);
    this.isUser = this.userService.hasRole(Role.User);
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout();
  }
}
