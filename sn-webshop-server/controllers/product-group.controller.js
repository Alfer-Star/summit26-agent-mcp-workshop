const db = require('../models');
const ProductGroup = db.productGroup;
const ProductGroupGalleryItem = db.productGroupGalleryItem;

const mapProductGroupToDto = (productGroup) => {
  return {
    id: productGroup.id,
    imageUrl: productGroup.imageUrl,
    name: productGroup.name_de ?? productGroup.name_en,
  };
};

exports.getProductGroups = (req, res) => {
  const lang = req.query.lang;
  const attributes = ['name_' + lang, 'id', 'imageUrl'];

  ProductGroup.findAll({ attributes })
    .then((productGroups) => {
      productGroups = productGroups.map((pg) => mapProductGroupToDto(pg));

      res.send(productGroups);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.getProductGroupGalleryItems = (req, res) => {
  ProductGroupGalleryItem.findAll()
    .then((productGroupGalleryItems) => {
      res.send(productGroupGalleryItems);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
