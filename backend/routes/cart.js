const express = require('express');
const Cart = require('../models/cart');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
});

router.post('/', auth, async (req, res) => {
  const { product, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const item = cart.items.find(i => i.product.toString() === product);
  if (item) item.quantity += quantity;
  else cart.items.push({ product, quantity });

  await cart.save();
  res.json(cart);
});

router.delete('/:productId', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
