import { DetailedProduct } from '../product/detailed-product';

export interface CheckoutProduct {
  product: DetailedProduct;
  quantity: number;
}
