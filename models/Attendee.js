const mongoose = require('mongoose');

const AttendeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String },
  ticketType: { type: String, enum: ['free', 'vip'], default: 'free' },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendee', AttendeeSchema);