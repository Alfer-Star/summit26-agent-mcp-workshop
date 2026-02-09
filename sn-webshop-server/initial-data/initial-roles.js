const db = require('../models');
const Role = db.role;

exports.setupInitialRoles = () => {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'admin',
  });
};
