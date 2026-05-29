const router = require('express').Router();
const Donation = require('../models/Donation');
const authMiddleware = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      amount,
      type,
      sponsorshipArea,
      message
    } = req.body;

    if (!name || !email || !phone || !amount) {
      return res.status(400).json({
        message: 'Name, email, phone, and amount are required.'
      });
    }

    const donation = new Donation({
      name,
      email,
      phone,
      amount,
      type,
      sponsorshipArea: type === 'sponsorship' ? sponsorshipArea : '',
      message,
      status: 'pending',
      paymentMethod: 'momo'
    });

    await donation.save();

    res.status(201).json({
      message: 'Your giving request has been submitted and is pending confirmation.',
      donation
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'confirmed',
        adminReason: '',
        confirmedAt: new Date()
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/ignore', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'ignored',
        adminReason: reason || 'Payment was not received or amount could not be verified.'
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;