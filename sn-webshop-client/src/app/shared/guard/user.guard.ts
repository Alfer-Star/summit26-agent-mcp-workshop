import { inject } from '@angular/core';

import { Role } from '@shared/model/user/user';
import { UserService } from '@shared/service/user/user.service';
import { CanActivateFn } from '@angular/router';

export const userGuard: CanActivateFn = ( ) => {
  const userService = inject(UserService);
  return userService.hasRole(Role.User);
};
