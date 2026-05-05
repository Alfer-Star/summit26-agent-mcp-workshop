import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { UserService } from '@shared/service/user/user.service';

export const authGuard: CanActivateFn = (route,  ) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    router.navigate([AbsoluteAppRoutes.login], {
      queryParams: { redirect: buildUrl(route) },
    });
  }
  return userService.isLoggedIn();
};

const buildUrl = (route: ActivatedRouteSnapshot): string => {
  let url = route.url.join('/');

  if (route?.parent) {
    url = `${buildUrl(route.parent)}/${url}`;
  }

  return url;
};
