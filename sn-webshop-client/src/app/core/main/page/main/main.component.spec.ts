import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { provideI18NTesting } from '@transloco/provide-i18n';
import { BehaviorSubject } from 'rxjs';
import { MainComponent } from './main.component';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { CheckoutProduct, createCheckoutProduct } from '@shared/model/checkout/checkout-product';
import { By } from '@angular/platform-browser';
import { CheckoutButtonComponent } from '@core/main/component/checkout-button/checkout-button.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  let productsInBasket$: BehaviorSubject<CheckoutProduct[]>;
  let events$: BehaviorSubject<NavigationEnd>;

  beforeEach(async () => {
    productsInBasket$ = new BehaviorSubject<CheckoutProduct[]>([]);
    events$ = new BehaviorSubject(new NavigationEnd(0, '', ''));

    await TestBed.configureTestingModule({
      providers: [
        provideI18NTesting(),
        provideRouter([]),
        {
          provide: CheckoutService,
          useValue: { productsInBasket$ },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'events', 'get').mockReturnValue(events$);

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    { products: [createCheckoutProduct()], route: AbsoluteAppRoutes.login, expected: true },
    { products: [createCheckoutProduct()], route: AbsoluteAppRoutes.checkout, expected: false },
    { products: [], route: AbsoluteAppRoutes.login, expected: false },
  ])(
    'should show the checkout button ($expected) with products $products and route $route',
    ({ products, route, expected }) => {
      events$.next(new NavigationEnd(0, route, route));
      productsInBasket$.next(products);
      fixture.detectChanges();
      const checkoutButton = fixture.debugElement.query(By.directive(CheckoutButtonComponent));
      expect(!!checkoutButton).toBe(expected);
    },
  );
});
