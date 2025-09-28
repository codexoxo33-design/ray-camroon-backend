const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { addOrderItems } = require('../controllers/orderController.js');

router.post('/', protect, addOrderItems);

module.exports = router;
