# Angular für Fortgeschrittene - Aufgabe Routing

- [Angular für Fortgeschrittene - Aufgabe Routing](#Angular-für-fortgeschrittene---lab-1)
    - [1. Aufgabe](#1-anpassen-der-styles-in-appcomponentscss)
    - [2. Aufgabe](#2-lazy-loading-der-module)
    - [3. Aufgabe](#3-anlegen-und-verdrahten-von-guards)

<details>
<summary>Lösung anzeigen</summary>
<p>
</details>

## 1. Aufsplitten der Routen

Aktuell befinden sich alle Route-Konfigurationen in der _app.routes.ts_-Datei.<br>
Nachdem nun die Architektur angepasst worden ist, sollten die Routen aufgeteilt werden.<br>
Lege dazu _xyz.routes.ts_-Dateien für die einzelnen Features und Pages (wo nötig) an.<br>
Extrahiere dann Unterrouten aus _app.routes.ts_ in diese neuen Dateien, das Ansteuern dieser Routen erfolgt in der nächsten Aufgabe.

<details>
<summary>Lösung anzeigen</summary>
<p>

```bash

Beispiel admin.routes.ts

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
];

```

</details>

## 2. Lazy Loading der Routes

Jetzt wo die Routen aufgeteilt sind, können wir das Lazy Loading von diesen Modulen ermöglichen.<br>
Dafür werden wir die _app.routes.ts_ verwenden, welche die Hauptrouten beinhalten wird.<br>

Beispiel:

```bash
{
    path: RelativeAppRoutes.admin,
    canMatch: [AdminGuard],
    loadChildren: () => import('../core/admin/admin.routes').then((m) => m.AdminRoutes),
},
```

<details>
<summary>Lösung anzeigen</summary>
<p>

```bash

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: RelativeAppRoutes.main,
    pathMatch: 'full',
  },
  {
    path: RelativeAppRoutes.main,
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: RelativeAppRoutes.dashboard,
        pathMatch: 'full',
      },
      {
        path: RelativeAppRoutes.dashboard,
        loadChildren: () => import('../feature/dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
      },
      {
        path: RelativeAppRoutes.admin,
        loadChildren: () => import('../core/admin/admin.routes').then((m) => m.AdminRoutes),
      },
      {
        path: RelativeAppRoutes.settings,
        loadChildren: () => import('../feature/settings/settings.routes').then((m) => m.SettingsRoutes),
      },
      {
        path: RelativeAppRoutes.checkout,
        loadChildren: () => import('../feature/checkout/checkout.routes').then((m) => m.CheckoutRoutes),
      },
      {
        path: RelativeAppRoutes.product,
        loadChildren: () => import('../feature/product/product.routes').then((m) => m.ProductRoutes),
      },
      {
        path: RelativeAppRoutes.products,
        loadChildren: () => import('../feature/products/products.routes').then((m) => m.ProductsRoutes),
      },
    ],
  },
  {
    path: RelativeAppRoutes.login,
    component: LoginComponent,
  },
  {
    path: RelativeAppRoutes.login + '/:redirectPath',
    component: LoginComponent,
  },
  {
    path: AbsoluteAppRoutes.registration,
    component: RegistrationComponent,
  },
  {
    path: RelativeAppRoutes.notFound,
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

```

</details>

## 3. Anlegen und verdrahten von Guards

Nachdem die Routen nun stehen, sollten wir einige von ihnen mit Guards versehen.<br>
Speziell geht es um folgende:

- AdminGuard
    - Die Admin Route darf nicht ohne angemeldeten User mit Rolle "Admin" angesteuert werden
- UserGuard
    - Die Settings Route darf nicht ohne angemeldeten User mit Rolle "User" angesteuert werden
- AuthGuard
    - Die Checkout Route darf nicht angesteuert werden, ohne dass ein User angemeldet ist
    - Sie sollte den User allerdings nicht einfach ablehnen, sondern auf den Login umleiten
        - Dazu sollte der Login mit einem Query-Parameter "redirect" über den Router angesteuert werden
        - Dieser "redirect" sollte auf die aktuelle URL zeigen (oder wahlweise einfach auf die Checkout-Route)

Diese sollten im _Shared_-Ordner angelegt werden.

<details>
<summary>Lösung anzeigen</summary>
<p>

AdminGuard

```bash
export const adminGuard: CanMatchFn = (route, segments) => {
  const userService = inject(UserService);
  return userService.hasRole(Role.Admin);
};
```

UserGuard

```bash
export const userGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  return userService.hasRole(Role.User);
};

```

AuthGuard

```bash
export const authGuard: CanActivateFn = (route, state) => {
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

```

Die Routen müssen nun noch angepasst werden:

```bash

app.routes

...
{
    path: RelativeAppRoutes.admin,
    canMatch: [adminGuard],
    loadChildren: () => import('../core/admin/admin.routes').then((m) => m.AdminRoutes),
},
{
    path: RelativeAppRoutes.settings,
    canActivate: [userGuard],
    loadChildren: () => import('../feature/settings/settings.routes').then((m) => m.SettingsRoutes),
},
{
    path: RelativeAppRoutes.checkout,
    canActivate: [authGuard],
    loadChildren: () => import('../feature/checkout/checkout.routes').then((m) => m.CheckoutRoutes),
},
...


```

</details>
