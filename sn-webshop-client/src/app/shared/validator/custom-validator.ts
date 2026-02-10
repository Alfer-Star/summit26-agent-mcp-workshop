import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(ctrl: AbstractControl): ValidationErrors | null {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return pattern.test(ctrl.value) ? null : { passwordStrength: true };
  }

  static passwordsMatchValidator(control: AbstractControl): null {
    const passwordCtrl = control.get('password') as FormControl<string>;
    const confirmPasswordCtrl = control.get('confirmPassword') as FormControl<string>;
    if (passwordCtrl && confirmPasswordCtrl && passwordCtrl.value !== confirmPasswordCtrl.value) {
      confirmPasswordCtrl.setErrors({ passwordsMatch: true });
    } else if (confirmPasswordCtrl?.hasError('passwordsMatch')) {
      confirmPasswordCtrl.updateValueAndValidity();
    }
    return null;
  }

  static iban(ctrl: AbstractControl): ValidationErrors | null {
    const ibanRegex = /^[A-Z]{2}(?:[ ]?[0-9]){18,20}$/;
    const iban = ctrl.value;

    if (!ibanRegex.test(iban)) {
      return { iban: true };
    }

    return null;
  }
}
