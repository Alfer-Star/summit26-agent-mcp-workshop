module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    addresses: {
      type: Sequelize.JSON,
    },
    paymentInformation: {
      type: Sequelize.JSON,
    },
  });
  return User;
};
