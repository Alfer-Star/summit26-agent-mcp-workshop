const db = require('../models');
const config = require('../config/auth.config');
const { user: User, refreshToken: RefreshToken } = db;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
exports.signup = (req, res) => {
  // Save User to Database
  const body = req.body;
  User.create({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 8),
    addresses: [
      {
        streetNr: body.streetNr,
        zip: body.zip,
        city: body.city,
      },
    ],
  })
    .then((user) => {
      user.setRoles([1]).then(() => {
        res.send({ user, message: 'User was registered successfully!' });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      const refreshToken = await RefreshToken.createToken(user);
      let authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            addresses: user.addresses,
            roles: authorities,
            paymentInformation: user.paymentInformation,
          },
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: 'Refresh Token is required!' });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(403).json({ message: 'Refresh token is not in database!' });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: 'Refresh token was expired. Please make a new signin request',
      });
      return;
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
