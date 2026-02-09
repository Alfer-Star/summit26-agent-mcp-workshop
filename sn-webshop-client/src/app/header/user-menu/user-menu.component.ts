import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { Role } from '../../model/user/user';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sn-user-menu',
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
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
