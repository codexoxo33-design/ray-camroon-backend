const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { addOrderItems, getMyOrders } = require('../controllers/orderController.js');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
