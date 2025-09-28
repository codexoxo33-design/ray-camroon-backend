const Order = require('../models/orderModel.js');

async function addOrderItems(req, res) {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    const createdOrder = await order.save();

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Add order items error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { addOrderItems };
