import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbsoluteAppRoutes } from '../app-routes.enum';
import { CheckoutService } from '../service/checkout/checkout.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'sn-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, RouterLink, TranslocoDirective],
})
export class CheckoutCompleteComponent {
  readonly AbsoluteAppRoutes = AbsoluteAppRoutes;

  constructor() {
    const checkoutService = inject(CheckoutService);

    checkoutService.clearBasket();
  }
}
