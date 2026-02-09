import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from "@jsverse/transloco";
import { AbsoluteAppRoutes } from '../../../app.routes.enum';

@Component({
  selector: 'sn-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, RouterLink, TranslocoDirective],
})
export class CheckoutButtonComponent {
  readonly AbsoluteAppRoutes = AbsoluteAppRoutes;

  @HostBinding('class.display-flex') displayFlex = true;
  @HostBinding('class.justify-content-end') justifyContentEnd = true;
}
