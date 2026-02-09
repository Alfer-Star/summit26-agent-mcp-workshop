exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.');
};
exports.userBoard = (req, res) => {
  res.status(200).send('User Content.');
};

const db = require('../models');
const User = db.user;
exports.patchUser = (req, res) => {
  console.log(req.body);
  User.update(
    { ...req.body },
    {
      where: {
        id: req.body.id,
      },
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      User.findOne({
        where: {
          id: req.body.id,
        },
      }).then((user) => {
        res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          addresses: user.addresses,
          paymentInformation: user.paymentInformation,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.adminBoard = (req, res) => {
  User.findAll().then((users) => res.status(200).send(users));
};
