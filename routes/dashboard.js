const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Attendee = require('../models/Attendee');
const Product = require('../models/Product');
const Donation = require('../models/Donation');

router.get('/', authMiddleware, async (req, res) => {
  const [attendees, products, donations] = await Promise.all([
    Attendee.find().sort({ registeredAt: -1 }),
    Product.find(),
    Donation.find().sort({ donatedAt: -1 })
  ]);
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({ attendees, products, donations, totalDonations });
});

module.exports = router;