import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { AbsoluteAppRoutes } from '../../../../app.routes.enum';

@Component({
  selector: 'sn-basket-icon',
  templateUrl: './basket-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, RouterLink],
})
export class BasketIconComponent {
  private readonly checkoutService = inject(CheckoutService);
  readonly AbsoluteAppRoutes = AbsoluteAppRoutes;

  readonly itemCount = computed(() =>
    this.checkoutService.productsInBasket().reduce((sum, item) => sum + item.quantity, 0),
  );
}
