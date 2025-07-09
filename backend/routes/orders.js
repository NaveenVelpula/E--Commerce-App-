const express = require('express');
const Order = require('../models/orders');
const Cart = require('../models/cart');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart is empty' });

  const order = new Order({ user: req.user._id, items: cart.items });
  await order.save();

  cart.items = [];
  await cart.save();

  res.json(order);
});

module.exports = router;
