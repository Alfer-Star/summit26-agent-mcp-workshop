const controller = require('../controllers/basket.controller');
const { authJwt } = require('../middleware');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  // No auth — external services / MCP agents call this to place items into a user's basket
  app.post('/basket/items', controller.addItem);

  // JWT auth — frontend reads and manages the basket
  app.get('/basket', [authJwt.verifyToken], controller.getBasket);
  app.delete('/basket/items/:productId', [authJwt.verifyToken], controller.removeItem);
  app.delete('/basket', [authJwt.verifyToken], controller.clearBasket);
};
