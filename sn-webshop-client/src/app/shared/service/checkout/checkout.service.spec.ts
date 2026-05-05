import { CheckoutService } from '@shared/service/checkout/checkout.service';
import { CheckoutHttpService } from '@shared/service/checkout/checkout-http.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createDetailedProduct } from '@shared/model/product/detailed-product';
import { firstValueFrom, of } from 'rxjs';
import { createCheckoutProduct } from '@shared/model/checkout/checkout-product';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let checkoutHttp: CheckoutHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(CheckoutService);
    checkoutHttp = TestBed.inject(CheckoutHttpService);
  });

  it('should add new product to basket', () => {
    const product = createDetailedProduct();

    service.addToBasket(product, 1);

    expect(service.productsInBasket()).toHaveLength(1);
    expect(service.productsInBasket()[0]).toEqual({
      product,
      quantity: 1,
    });
  });

  it('should add existing product to basket', () => {
    const product = createDetailedProduct();

    service.addToBasket(product, 1);
    service.addToBasket(product, 1);

    expect(service.productsInBasket()).toHaveLength(1);
    expect(service.productsInBasket()[0]).toEqual({
      product,
      quantity: 2,
    });
  });

  it.each([
    { product: createDetailedProduct(), quantity: 1, quantityToRemove: 1, expectedLength: 0 },
    { product: createDetailedProduct(), quantity: 2, quantityToRemove: 1, expectedLength: 1 },
  ])(
    'should remove a product by object reference, expected remaining products: $expectedLength',
    ({ product, quantity, quantityToRemove, expectedLength }) => {
      service.addToBasket(product, quantity);

      service.removeFromBasket(product, quantityToRemove);

      expect(service.productsInBasket()).toHaveLength(expectedLength);
    },
  );

  it.each([
    { id: 'test', quantity: 1, quantityToRemove: 1, expectedLength: 0 },
    { id: 'test', quantity: 2, quantityToRemove: 1, expectedLength: 1 },
  ])(
    'should remove a product by id, expected remaining products: $expectedLength',
    ({ id, quantity, quantityToRemove, expectedLength }) => {
      service.addToBasket(createDetailedProduct({ id }), quantity);

      service.removeFromBasket(id, quantityToRemove);

      expect(service.productsInBasket()).toHaveLength(expectedLength);
    },
  );

  it('should call checkout from http service', async () => {
    const product = createDetailedProduct();
    const quantity = 2;
    const checkoutProduct = createCheckoutProduct({
      product,
      quantity,
    });
    service.addToBasket(product, quantity);
    const spy = vi.spyOn(checkoutHttp, 'checkout').mockReturnValue(of({}));

    await firstValueFrom(service.checkout());

    expect(spy).toHaveBeenCalledWith([checkoutProduct]);
  });

  it('should clear the basket', () => {
    service.addToBasket(createDetailedProduct(), 1);
    service.addToBasket(createDetailedProduct(), 1);

    service.clearBasket();

    expect(service.productsInBasket()).toHaveLength(0);
  });
});
