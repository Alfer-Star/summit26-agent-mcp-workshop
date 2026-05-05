module.exports = (sequelize, Sequelize) => {
  const BasketItem = sequelize.define('basket_items', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
  return BasketItem;
};
