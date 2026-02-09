const db = require('../models');
const Product = db.product;
const { Op } = require('sequelize');

const basicAttributes = ['id', 'imageUrl'];

const mapProductToDto = (product) => {
  return {
    id: product.id,
    imageUrl: product.imageUrl,
    rating: product.rating,
    price: product.price,
    availableQuantity: product.availableQuantity,
    deliveryDuration: product.deliveryDuration,
    name: product.name_de ?? product.name_en,
    description: product.description_de ?? product.description_en,
    detailedDescription: product.detailedDescription_de ?? product.detailedDescription_en,
  };
};

exports.getProducts = (req, res) => {
  const productGroupId = (req.query.productGroupId ?? '').trim();
  const searchTerm = `${(req.query.searchQuery ?? '').trim()}`;
  const lang = req.query.lang;
  const attributes = [...basicAttributes, 'name_' + lang, 'description_' + lang];

  let where = undefined;

  if (productGroupId) {
    where = {
      productGroupId,
    };
  }

  if (searchTerm) {
    if (lang === 'de') {
      if (!where) {
        where = {};
      }
      where = {
        ...where,
        [Op.or]: [
          { name_de: { [Op.substring]: searchTerm } },
          { description_de: { [Op.substring]: searchTerm } },
        ],
      };
    } else if (lang === 'en') {
      if (!where) {
        where = {};
      }
      where = {
        ...where,
        [Op.or]: [
          { name_en: { [Op.substring]: searchTerm } },
          { description_en: { [Op.substring]: searchTerm } },
        ],
      };
    }
  }

  Product.findAll({
    attributes,
    where,
  })
    .then((products) => {
      products = [...products.map((product) => mapProductToDto(product))];

      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.getProduct = (req, res) => {
  const productId = (req.query.productId ?? '').trim();
  const lang = req.query.lang;
  const attributes = [
    ...basicAttributes,
    'name_' + lang,
    'description_' + lang,
    'detailedDescription_' + lang,
    'rating',
    'price',
    'availableQuantity',
    'deliveryDuration',
  ];

  Product.findOne({
    attributes,
    where: {
      id: productId,
    },
  })
    .then((product) => {
      product = mapProductToDto(product);
      res.send(product);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
