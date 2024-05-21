const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    const productIndex = cart.products.findIndex((p) => p.productId == productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
