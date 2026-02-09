import { Component, inject } from '@angular/core';
import { CheckoutService } from './service/checkout/checkout.service';
import { map } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { CheckoutButtonComponent } from './checkout-button/checkout-button.component';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'sn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CheckoutButtonComponent, FooterComponent, AsyncPipe],
})
export class AppComponent {
  title = 'sn-webshop';
  private readonly checkoutService = inject(CheckoutService);
  readonly hasProductsInBasket$ = this.checkoutService.productsInBasket$.pipe(map((products) => products.length > 0));
}
