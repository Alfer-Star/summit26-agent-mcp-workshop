import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { HeaderComponent } from '../../component/header/header.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CheckoutButtonComponent } from '../../component/checkout-button/checkout-button.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { combineLatest, map, shareReplay, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RelativeAppRoutes } from '@core/app.routes.enum';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, RouterOutlet, CheckoutButtonComponent, FooterComponent, AsyncPipe],
})
export class MainComponent {
  private readonly router = inject(Router);
  private readonly checkoutService = inject(CheckoutService);
  readonly hasProductsInBasket$ = this.checkoutService.productsInBasket$.pipe(map((products) => products.length > 0));

  readonly showCheckoutButton$ = combineLatest([
    this.router.events.pipe(shareReplay(1), startWith(null)),
    this.checkoutService.productsInBasket$.pipe(map((products) => products.length > 0)),
  ]).pipe(
    map(([event, hasProductsInBasket]) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.indexOf(RelativeAppRoutes.checkout) > -1) {
        return false;
      }

      return hasProductsInBasket;
    }),
  );
}
