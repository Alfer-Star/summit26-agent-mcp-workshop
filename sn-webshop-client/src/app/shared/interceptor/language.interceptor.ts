/* eslint-disable @typescript-eslint/no-explicit-any */

import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

const LANG_QUERY_PARAM_KEY = 'lang';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  private readonly translocoService = inject(TranslocoService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const lang = this.translocoService.getActiveLang();
    const params = req.params.append(LANG_QUERY_PARAM_KEY, lang);
    const request = req.clone({
      params,
    });

    return next.handle(request);
  }
}

export const langInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: LangInterceptor, multi: true }];
