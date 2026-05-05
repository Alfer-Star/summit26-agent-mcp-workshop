const db = require('../models');
const BasketItem = db.basketItem;
const Product = db.product;

const localizeProduct = (product, lang) => ({
  id: product.id,
  imageUrl: product.imageUrl,
  rating: product.rating,
  price: product.price,
  availableQuantity: product.availableQuantity,
  deliveryDuration: product.deliveryDuration,
  name: lang === 'de' ? product.name_de : product.name_en,
  description: lang === 'de' ? product.description_de : product.description_en,
  detailedDescription:
    lang === 'de' ? product.detailedDescription_de : product.detailedDescription_en,
});

// POST /basket/items — no auth, intended for external services / MCP
exports.addItem = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  try {
    const existing = await BasketItem.findOne({ where: { userId, productId } });
    if (existing) {
      await existing.update({ quantity: existing.quantity + quantity });
    } else {
      await BasketItem.create({ userId, productId, quantity });
    }
    res.status(200).json({ message: 'Item added to basket.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /basket?lang=de — JWT auth, returns full basket with localised product details
exports.getBasket = async (req, res) => {
  const userId = req.userId;
  const lang = req.query.lang || 'de';

  try {
    const items = await BasketItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    const result = items
      .filter((item) => item.product)
      .map((item) => ({
        quantity: item.quantity,
        product: localizeProduct(item.product, lang),
      }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /basket/items/:productId — JWT auth
exports.removeItem = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;

  try {
    await BasketItem.destroy({ where: { userId, productId } });
    res.status(200).json({ message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /basket — JWT auth, clears entire basket for the current user
exports.clearBasket = async (req, res) => {
  const userId = req.userId;

  try {
    await BasketItem.destroy({ where: { userId } });
    res.status(200).json({ message: 'Basket cleared.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
