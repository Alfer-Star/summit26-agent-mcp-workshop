import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { PaymentInformation } from '../model/user/payment-information';
import { ObscureStringPipe } from '../obscure-string/obscure-string.pipe';
import { TranslocoDirective } from "@jsverse/transloco";

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
