import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatFormField, MatHint, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldTree, FormField, schema, required } from '@angular/forms/signals';
import { PaymentInformation } from '@shared/model/user/payment-information';
import { iban } from '@shared/validator/custom-validator';
import { ErrorMessagePipe } from '@shared/pipe/error-message/error-message.pipe';

@Component({
  selector: 'sn-payment-information-signal-form',
  templateUrl: './payment-information-signal-form.component.html',
  styleUrls: ['./payment-information-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ErrorMessagePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    FormField,
    MatError,
  ],
})
export class PaymentInformationSignalFormComponent {
  paymentInformationForm = input.required<FieldTree<PaymentInformation>>();
}

export const PaymentInformationSchema = schema<PaymentInformation>((path) => {
  required(path.iban);
  iban(path.iban);
});
