export const createProduct = (product?: Partial<Product>): Product => {
  return {
    ...{
      id: 'TEST_PRODUCT',
      productGroupId: 'TEST_PRODUCT_GROUP',
      imageUrl: 'assets/images/logo.jpg',
      name: 'TEST PRODUCT',
      description: 'TEST PRODUCT DESCRIPTION',
    },
    ...product,
  };
};

export const createProducts = (...products: Partial<Product>[]): Product[] => {
  return products.map(createProduct);
};

export interface Product {
  id: string;
  productGroupId: string;
  imageUrl: string;
  name: string;
  description: string;
}
