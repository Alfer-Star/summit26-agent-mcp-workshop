import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldTree, FormField, required, schema } from '@angular/forms/signals';
import { Address } from '@shared/model/address/address';
import { ErrorMessagePipe } from '@shared/pipe/error-message/error-message.pipe';

@Component({
  selector: 'sn-address-signal-form',
  templateUrl: './address-signal-form.component.html',
  styleUrls: ['./address-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ErrorMessagePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FormField,
    MatError,
  ],
})
export class AddressSignalFormComponent {
  readonly addressForm = input.required<FieldTree<Address>>();
}

export const addressSchema = schema<Address>((path) => {
  required(path.city);
  required(path.streetNr);
  required(path.zip);
});

export const initAddress: Address = {
  streetNr: '',
  zip: '',
  city: '',
};
