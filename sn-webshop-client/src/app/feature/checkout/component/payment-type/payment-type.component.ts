import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { PaymentInformation } from '@shared/model/user/payment-information';
import { ObscureStringPipe } from '@shared/pipe/obscure-string/obscure-string.pipe';

@Component({
  selector: 'sn-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ObscureStringPipe, TranslocoDirective],
})
export class PaymentTypeComponent {
  readonly paymentInformation = input.required<PaymentInformation>();
}
