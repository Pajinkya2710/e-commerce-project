const express = require('express');
const { checkout, handlePayment, paymentSuccess } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/checkout', authMiddleware, checkout);
router.post('/payment', authMiddleware, handlePayment);


module.exports = router;
