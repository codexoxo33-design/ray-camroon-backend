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

async function getMyOrders(req, res) {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { addOrderItems, getMyOrders };
