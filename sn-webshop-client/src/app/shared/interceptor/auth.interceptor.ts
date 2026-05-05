/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { StorageService } from '@shared/service/storage/storage.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { UserService } from '@shared/service/user/user.service';

const TOKEN_HEADER_KEY = 'x-access-token';

// TODO test

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(StorageService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthHttpService);

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

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
      }),
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
          }),
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token))),
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}
export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
