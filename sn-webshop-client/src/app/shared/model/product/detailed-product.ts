import { createProduct, Product } from './product';

export const createDetailedProduct = (
  product?: Partial<DetailedProduct>,
): DetailedProduct => {
  return {
    ...createProduct(product),
    ...{
      detailedDescription: 'TEST PRODUCT',
      rating: 3,
      price: 100,
      availableQuantity: 10,
      deliveryDuration: 7,
    },
    ...product,
  };
};

export const createDetailedProducts = (
  products: Partial<DetailedProduct>[],
): DetailedProduct[] => {
  return products.map(createDetailedProduct);
};

export interface DetailedProduct extends Product {
  detailedDescription: string;
  rating: number;
  price: number;
  availableQuantity: number;
  deliveryDuration: number;
}
