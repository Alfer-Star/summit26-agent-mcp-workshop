import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@shared/service/user/user.service';
import { Role } from '@shared/model/user/user';

export const adminGuard: CanMatchFn = ( ) => {
  const userService = inject(UserService);
  return userService.hasRole(Role.Admin);
};
