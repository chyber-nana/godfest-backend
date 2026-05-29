const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerContact: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ignored'],
    default: 'pending'
  },
  adminReason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Order', OrderSchema);