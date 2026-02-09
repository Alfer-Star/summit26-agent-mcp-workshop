module.exports = (sequelize, Sequelize) => {
  const ProductGroupGalleryItem = sequelize.define('productGroupGalleryItems', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  });
  return ProductGroupGalleryItem;
};
