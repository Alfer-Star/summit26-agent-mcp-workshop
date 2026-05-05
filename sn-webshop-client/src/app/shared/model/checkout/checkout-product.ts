import { createDetailedProduct, DetailedProduct } from '../product/detailed-product';

export interface CheckoutProduct {
  product: DetailedProduct;
  quantity: number;
}

export const createCheckoutProduct = (product?: Partial<CheckoutProduct>): CheckoutProduct => {
  return {
    product: { ...createDetailedProduct(product?.product), ...product?.product },
    quantity: product?.quantity ?? 1,
  };
};

export const createCheckoutProducts = (products: Partial<CheckoutProduct>[]): CheckoutProduct[] => {
  return products.map(createCheckoutProduct);
};
