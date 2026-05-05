import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { SchemaPathTree, validateHttp } from '@angular/forms/signals';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export class EmailAlreadyUsedValidator {
  static createValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authHttpService
        .isEmailAlreadyRegistered(control.value)
        .pipe(map((result: boolean) => (result ? { emailAlreadyUsed: true } : null)));
    };
  }
}

export function emailAlreadyUsed(path: SchemaPathTree<string>, options?: { message?: string }) {
  validateHttp(path, {
    request: (ctx) => ({
      url: `${environment.url}/auth/checkEmail`,
      params: {
        email: ctx.value(),
      },
    }),
    onSuccess: (emailAlreadyUsed: boolean) => {
      if (emailAlreadyUsed) {
        return {
          kind: 'emailAlreadyUsed',
          message: options?.message || 'validation.emailAlreadyUsed',
        };
      }
      return null;
    },
    onError: (error) => {
      console.error('api error validating email', error);
      return {
        kind: 'api-failed',
      };
    },
  });
}
