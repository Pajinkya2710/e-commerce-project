const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  paymentIntentId: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
