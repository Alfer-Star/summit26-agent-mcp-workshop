# Angular für Fortgeschrittene - Auth und Storage

- [Angular für Fortgeschrittene - Auth und Storage](#Angular-für-fortgeschrittene---lab-1)
  - [1. Storage und Atuh](#1-storage-und-auth)

Hinweis:

- User mit Admin-Rolle `admin@test.de` Passwort: password1
- User mit User-Rolle `test@test.de` Passwort: password1

## 1. Storage und Auth

### 1.1 StorageService

Momentan übersteht die Session des Nutzer keinen Reload des Browser. Um den Nutzer auch bei Reload eingeloggt zu lassen soll der Auth-Token im SessionStorage abgelegt werden. Legt hierzu bitte einen StorageService an, welcher folgende Funktionen bietet:

- `clearStorage(): void` zum leeren des SessionStorage
- `saveToken(token: string): void` soll den AccessToken(`auth-token`) ablegen
- `saveTokenAndUser(data: LoginResponseDto & { refreshToken: string }): void` zum Speichern des AccessTokens(über die `saveToken`methode), RefreshTokens(`auth-refreshtoken`) und des Users(`auth-user`) im SessionStorage
- `getToken(): string | null` gibt, sofern vorhanden, das im SessionStorage abgelegte AccessToken zurück
- `getRefreshToken(): string | null` gibt, sofern vorhanden, das im SessionStorage abgelegte RefreshToken zurück
- `getUser(): User | undefined` gibt, sofern vorhanden, die im SessionStorage abgelegten User-Daten zurück

### 1.2 UserService

Der UserService soll nun nicht mehr die User-Daten von außen gesetzt bekommen, sondern diese aus dem SessionStorage lesen. Dazu soll das `user` Attribut durch Getter und Setter ersetzt werden. Der Getter soll beim ersten Aufruf die User-Daten aus dem SessionStorage laden (über unseren StorageService) und in ein privates Attribut (\_user) schreiben. Bei späteren Aufrufen des Getters, soll der in `_user` abgelegte User zurückgegeben werden.
Die `logout()`-Funktion soll den SessionStorage (über unseren StorageService) leeren.

### 1.3 LoginComponent

Die Login Component soll nun nicht mehr den User selber im UserService persistieren und auch nicht mehr das `accessToken` im `AuthService` hinterlegen. Stattdessen soll nun die `saveTokenAndUser` Funktion des StorageService verwendet werden.

### 1.4 AuthHttpService

Der AuthHttpService soll nicht mehr den AccessToken halten. Entfernt den token und die `x-access-token' Header von den Aufrufen. Damit weiterhin das AccessToken ans Backend gesendet wird, soll folgender Interceptor der Applikation hinzugefügt werden:

<details>
<summary>/shared/interceptor/auth.interceptor.ts</summary>
<p>

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { StorageService } from '@shared/service/storage/storage.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { UserService } from '@shared/service/user/user.service';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private readonly tokenService: StorageService,
    private readonly userService: UserService,
    private readonly authService: AuthHttpService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let authReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/signin')) {
          return error.status === 401
            ? this.handle401Error(authReq, next)
            : error.status === 403
            ? of(this.handle403Error())
            : throwError(error);
        }
        return throwError(error);
      })
    );
  }
  private handle403Error(): void {
    this.userService.logout();
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefreshToken();
      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.userService.logout();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
```


</p>
</details>

<details>
<summary>Lösung anzeigen</summary>
<p>

**Schritt 1**

StorageService

_storage.service.ts_

```typescript
import { Injectable } from '@angular/core';
import { LoginResponseDto } from '@shared/model/auth/auth';
import { User } from '@shared/model/user/user';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  clearStorage(): void {
    sessionStorage.clear();
  }

  saveTokenAndUser(data: LoginResponseDto & { refreshToken: string }): void {
    this.saveToken(data.accessToken);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    sessionStorage.removeItem(REFRESHTOKEN_KEY);
    sessionStorage.setItem(REFRESHTOKEN_KEY, data.refreshToken);
  }

  saveToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | undefined {
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return undefined;
  }
}
```

**Schritt 2**

UserService

_user.service_

```typescript
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

  ...

  logout(): void {
    this.storageService.clearStorage();
    this.router.navigate([AbsoluteAppRoutes.login]);
    this.user = undefined;
  }
}
```

**Schritt 3**

LoginComponent

_login.component.html_

```typescript
export class LoginComponent {
  ...
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthHttpService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  ...
  login(): void {
    if (this.loginForm.valid) {
      const value = this.loginForm.value;
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
      ...
    }
}
```

**Schritt 4**

UserService

_auth-http.service.ts_

```typescript
export class AuthHttpService {
  constructor(private readonly http: HttpClient) {}
  ...
  patch(user: User): Observable<User> {
    return this.http.patch<User>(environment.url + '/user', user, httpOptions);
  }

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.url + '/api/test/admin');
  }
  ...
}
```

_main.ts_

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    langInterceptorProviders,
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideI18N(),
  ],
}).catch((err) => console.error(err));
```

</p>
</details>
