import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { HeaderComponent } from '../../component/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CheckoutButtonComponent } from '../../component/checkout-button/checkout-button.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, RouterOutlet, CheckoutButtonComponent, FooterComponent, AsyncPipe],
})
export class MainComponent {
  private readonly checkoutService = inject(CheckoutService);
  readonly hasProductsInBasket$ = this.checkoutService.productsInBasket$.pipe(map((products) => products.length > 0));
}
