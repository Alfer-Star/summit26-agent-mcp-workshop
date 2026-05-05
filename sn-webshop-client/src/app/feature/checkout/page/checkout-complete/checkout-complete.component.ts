import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'sn-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, RouterLink, TranslocoDirective, MatCardActions, MatCardTitle, MatCard],
})
export class CheckoutCompleteComponent {
  readonly AbsoluteAppRoutes = AbsoluteAppRoutes;

  constructor() {
    const checkoutService = inject(CheckoutService);

    checkoutService.clearBasket();
  }
}
