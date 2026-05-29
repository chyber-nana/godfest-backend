const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Configure where/how to save images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/merch — get all products (public)
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// POST /api/merch — add a product (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/merch/:id — remove a product (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;