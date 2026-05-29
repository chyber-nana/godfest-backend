const router = require('express').Router();
const Donation = require('../models/Donation');

router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: 'Thank you for your support!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;