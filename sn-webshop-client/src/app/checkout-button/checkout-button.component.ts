import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { AbsoluteAppRoutes } from '../app-routes.enum';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sn-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, RouterLink],
})
export class CheckoutButtonComponent {
  readonly AbsoluteAppRoutes = AbsoluteAppRoutes;

  @HostBinding('class.display-flex') displayFlex = true;
  @HostBinding('class.justify-content-end') justifyContentEnd = true;
}
