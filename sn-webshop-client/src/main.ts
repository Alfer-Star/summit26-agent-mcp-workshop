import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideI18N } from '@transloco/provide-i18n';
import { appRoutes } from '@core/app.routes';
import { langInterceptorProviders } from '@shared/interceptor/language.interceptor';
import { authInterceptorProviders } from '@shared/interceptor/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    authInterceptorProviders,
    langInterceptorProviders,
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideI18N(),
  ],
}).catch((err) => console.error(err));
