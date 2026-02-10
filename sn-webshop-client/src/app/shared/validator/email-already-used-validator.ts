import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { map, Observable } from 'rxjs';

export class EmailAlreadyUsedValidator {
  static createValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authHttpService
        .isEmailAlreadyRegistered(control.value)
        .pipe(map((result: boolean) => (result ? { emailAlreadyUsed: true } : null)));
    };
  }
}
