import { Product } from './product';

// user defined type guard
export function isProduct(item: Product | unknown): item is Product {
  const product = item as Product;
  return !!product.id && !!product.description && !!product.name && !!product.imageUrl;
}
