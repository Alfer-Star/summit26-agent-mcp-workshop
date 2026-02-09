import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obscureString',
  standalone: true,
})
export class ObscureStringPipe implements PipeTransform {
  transform(
    value: string | undefined,
    notObscuredCharacters = 4,
    symbol = '*',
  ): string | undefined {
    if (!value || value.length < notObscuredCharacters) {
      return value;
    }

    const obscuredValue = value
      .split('')
      .map((character, index) =>
        index < value.length - notObscuredCharacters ? symbol : character,
      )
      .join('');
    return obscuredValue;
  }
}
