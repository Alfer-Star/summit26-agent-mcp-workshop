import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static iban(ctrl: AbstractControl): ValidationErrors | null {
    const ibanRegex = /^[A-Z]{2}(?:[ ]?[0-9]){18,20}$/;
    const iban = ctrl.value;

    if (!ibanRegex.test(iban)) {
      return { iban: true };
    }

    return null;
  }
}
