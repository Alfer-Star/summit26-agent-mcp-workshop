export const createProductGroupGalleryItem = (
  galleryItem?: Partial<ProductGroupGalleryItem>,
): ProductGroupGalleryItem => {
  return {
    ...{ id: 'TEST_PRODUCT_GROUP_GALLERY_ITEM', imageUrl: 'assets/images/logo.jpg' },
    ...galleryItem,
  };
};

export const createProductGroupGalleryItems = (
  ...galleryItems: Partial<ProductGroupGalleryItem>[]
): ProductGroupGalleryItem[] => {
  return galleryItems.map(createProductGroupGalleryItem);
};

export interface ProductGroupGalleryItem {
  id: string;
  imageUrl: string;
}
