import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { HeaderComponent } from '../../component/header/header.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CheckoutButtonComponent } from '../../component/checkout-button/checkout-button.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, RouterOutlet, CheckoutButtonComponent, FooterComponent],
})
export class MainComponent {
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

  private readonly productsInBasket = this.checkoutService.productsInBasket;
  private readonly isOnCheckoutRoute = signal(false);

  protected readonly isCheckoutButtonVisible = computed(() => {
    const hasProductsInBasket = this.productsInBasket().length > 0;
    const isOnCheckoutRoute = this.isOnCheckoutRoute();
    return hasProductsInBasket && !isOnCheckoutRoute;
  });

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isOnCheckoutRoute.set(event.urlAfterRedirects.endsWith(AbsoluteAppRoutes.checkout));
      }
    });
  }
}
