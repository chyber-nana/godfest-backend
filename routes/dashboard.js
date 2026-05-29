const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Attendee = require('../models/Attendee');
const Product = require('../models/Product');
const Donation = require('../models/Donation');
const Order = require('../models/Order');

router.get('/', authMiddleware, async (req, res) => {
  const [attendees, products, donations, orders] = await Promise.all([
    Attendee.find().sort({ registeredAt: -1 }),
    Product.find(),
    Donation.find().sort({ donatedAt: -1 }),
    Order.find().populate('product').sort({ createdAt: -1 })
  ]);

  const totalDonations = donations
  .filter(d => d.status === 'confirmed')
  .reduce((sum, d) => sum + d.amount, 0);

  res.json({
    attendees,
    products,
    donations,
    orders,
    totalDonations
  });
});

module.exports = router;