export const createProductGroup = (
  productGroup?: Partial<ProductGroup>,
): ProductGroup => {
  return {
    ...{
      id: 'PRODUCT_GROUP',
      imageUrl: 'assets/images/logo.jpg',
      name: 'PRODUCT GROUP',
    },
    ...productGroup,
  };
};

export const createProductGroups = (
  ...productGroups: Partial<ProductGroup>[]
): ProductGroup[] => {
  return productGroups.map(createProductGroup);
};

export interface ProductGroup {
  id: string;
  imageUrl: string;
  name: string;
}
