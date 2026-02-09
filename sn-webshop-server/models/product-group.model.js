module.exports = (sequelize, Sequelize) => {
  const ProductGroup = sequelize.define('productGroups', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name_de: {
      type: Sequelize.STRING,
    },
    name_en: {
      type: Sequelize.STRING,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  });
  return ProductGroup;
};
