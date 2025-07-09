const express = require('express');
const Product = require('../models/products');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 5, search = '' } = req.query;
  const query = { name: { $regex: search, $options: 'i' } };
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(products);
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

router.put('/:id', auth, authorize('admin'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;
