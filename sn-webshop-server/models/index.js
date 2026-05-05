const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.role = require('../models/role.model.js')(sequelize, Sequelize);
db.refreshToken = require('../models/refreshToken.model.js')(sequelize, Sequelize);
db.productGroup = require('../models/product-group.model.js')(sequelize, Sequelize);
db.productGroupGalleryItem = require('../models/product-group-gallery-item.model.js')(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
});
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.ROLES = ['user', 'admin'];

db.product = require('../models/product.model.js')(sequelize, Sequelize);
db.basketItem = require('../models/basket-item.model.js')(sequelize, Sequelize);

db.basketItem.belongsTo(db.product, {
  foreignKey: 'productId',
  targetKey: 'id',
  as: 'product',
});

module.exports = db;
