const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

function generateOrderCode() {
  return `GF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Buyer creates a pending order
router.post('/', async (req, res) => {
  try {
    const { productId, buyerName, buyerContact } = req.body;

    if (!productId || !buyerName || !buyerContact) {
      return res.status(400).json({
        message: 'Product, buyer name, and contact are required.'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let orderCode;
    let existing;

    do {
      orderCode = generateOrderCode();
      existing = await Order.findOne({ orderCode });
    } while (existing);

    const order = new Order({
      product: product._id,
      productName: product.name,
      buyerName,
      buyerContact,
      amount: product.price,
      orderCode
    });

    await order.save();

    res.status(201).json({
      message: 'Order submitted. Please send MoMo payment and keep your order code.',
      order
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buyer checks order status
router.get('/check/:orderCode', async (req, res) => {
  try {
    const order = await Order.findOne({
      orderCode: req.params.orderCode.toUpperCase()
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin gets all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin confirms order
router.patch('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'confirmed',
        adminReason: '',
        confirmedAt: new Date()
      },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin ignores/rejects order with reason
router.patch('/:id/ignore', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'ignored',
        adminReason: reason || 'Payment not received or amount does not match.'
      },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;