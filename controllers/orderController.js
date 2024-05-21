const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.checkout = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
  
      if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
      }
  
      const totalAmount = cart.products.reduce((total, product) => total + product.productId.price * product.quantity, 0);
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
      });
  
      res.json({ clientSecret: paymentIntent.client_secret, cart, totalAmount });
    } catch (error) {
      console.error('Error in checkout:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.handlePayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
      const totalAmount = cart.products.reduce((total, product) => total + product.productId.price * product.quantity, 0);

      const newOrder = new Order({
        userId: req.user.id,
        products: cart.products,
        totalAmount,
        paymentStatus: paymentIntent.status,
        paymentIntentId: paymentIntentId
      });

      await newOrder.save();
      await Cart.deleteOne({ userId: req.user.id });

      res.status(200).json({ message: 'Payment successful and order placed' });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


