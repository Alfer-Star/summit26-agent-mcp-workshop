import { Pipe, PipeTransform } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(error: ValidationError): string {
    return error.message || this.getErrorMessage(error.kind);
  }

  getErrorMessage(error: string): string {
    switch (error) {
      case 'required':
        return 'validation.required';
      case 'email':
        return 'validation.email';
      default:
        return 'validation.unknown';
    }
  }
}
