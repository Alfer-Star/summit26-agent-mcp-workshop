module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('products', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    productGroupId: {
      type: Sequelize.STRING,
    },
    name_de: {
      type: Sequelize.STRING,
    },
    name_en: {
      type: Sequelize.STRING,
    },
    description_de: {
      type: Sequelize.STRING,
    },
    description_en: {
      type: Sequelize.STRING,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
    detailedDescription_de: {
      type: Sequelize.STRING,
    },
    detailedDescription_en: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.NUMBER,
    },
    price: {
      type: Sequelize.NUMBER,
    },
    availableQuantity: {
      type: Sequelize.NUMBER,
    },
    deliveryDuration: {
      type: Sequelize.NUMBER,
    },
  });
  return Product;
};
