import { input, output } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: 'sn-confirm-checkout',
  templateUrl: './confirm-checkout.component.html',
  styleUrls: ['./confirm-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, CurrencyPipe, TranslocoDirective],
})
export class ConfirmCheckoutComponent {
  readonly total = input.required<number>();
  readonly buyClick = output();
}
