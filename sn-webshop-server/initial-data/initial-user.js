const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');

exports.setupInitialUser = () => {
  User.create({
    name: 'Thorsten Tester',
    email: 'test@test.de',
    password: bcrypt.hashSync('password1', 8),
    addresses: [
      {
        streetNr: 'Musterstraße',
        zip: '00000',
        city: 'Musterstadt',
      },
      {
        streetNr: 'Musterweg',
        zip: '11111',
        city: 'Musterort',
      },
    ],
    paymentInformation: {
      iban: '0001110001110001110001',
    },
  }).then((user) => user.setRoles([1]));

  User.create({
    name: 'Adam Admin',
    email: 'admin@test.de',
    password: bcrypt.hashSync('password1', 8),
    addresses: [
      {
        streetNr: 'Musterstraße',
        zip: '00000',
        city: 'Musterstadt',
      },
    ],
    paymentInformation: {
      iban: '0001110001110001110001',
    },
  }).then((user) => user.setRoles([2]));
};
