import { EnvironmentProviders, importProvidersFrom, isDevMode } from '@angular/core';
import { provideTransloco, TranslocoTestingModule } from '@jsverse/transloco';
import en from '../../assets/i18n/en.json';
import de from '../../assets/i18n/de.json';
import { TranslocoHttpLoader } from './transloco-loader';

export const provideI18N = () => {
  return provideTransloco({
    config: {
      availableLangs: ['de', 'en'],
      defaultLang: 'de',
      // Remove this option if your application doesn't support changing language in runtime.
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  });
};

export const provideI18NTesting = (): EnvironmentProviders => {
  return importProvidersFrom(
    TranslocoTestingModule.forRoot({
      langs: { en, de },
      translocoConfig: {
        availableLangs: ['en', 'de'],
        defaultLang: 'de',
      },
      preloadLangs: true,
    }),
  );
};
