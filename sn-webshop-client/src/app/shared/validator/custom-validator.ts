import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { SchemaPathTree, validate, validateHttp, validateTree } from '@angular/forms/signals';
import { environment } from '../../../environments/environment';

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

export function iban(path: SchemaPathTree<string>) {
  validate(path, (ctx) => {
    const ibanRegex = /^[A-Z]{2}(?:[ ]?[0-9]){18,20}$/;
    const iban = ctx.value();

    if (!ibanRegex.test(iban)) {
      return { kind: 'iban' };
    }

    return null;
  });
}

export function passwordStrength(path: SchemaPathTree<string>, options?: { message?: string }) {
  validate(path, (ctx) => {
    const value = ctx.value();
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    return pattern.test(value) ? null : { kind: 'passwordStrength', message: options?.message };
  });
}

export function passwordsMatch(
  path: SchemaPathTree<{ password: string; confirmPassword: string }>,
  options?: { message?: string },
) {
  validateTree(path, (ctx) => {
    const passwordValue = ctx.fieldTree.password().value();
    const confirmPasswordValue = ctx.fieldTree.confirmPassword().value();
    if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
      return {
        kind: 'passwordsMatch',
        field: ctx.fieldTree.password,
        message: options?.message,
      };
    } else {
      return null;
    }
  });
}
