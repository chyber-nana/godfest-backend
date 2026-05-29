const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  amount:  { type: Number, required: true },
  type:    { type: String, enum: ['donation', 'sponsorship'], default: 'donation' },
  message: { type: String },
  donatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);