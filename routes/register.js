const router = require('express').Router();
const Attendee = require('../models/Attendee');
const authMiddleware = require('../middleware/auth');

// POST /api/register — save a new attendee
router.post('/', async (req, res) => {
  try {
    const attendee = new Attendee(req.body);
    await attendee.save();
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/register/:id — remove an attendee (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Attendee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendee removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;