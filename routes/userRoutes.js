const express = require('express');
const router = express.Router();
const { registerUser, loginUser, addToCart, getUserCart, updateCartItemQuantity, removeFromCart, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/cart/add', protect, addToCart);
router.get('/cart', protect, getUserCart);
router.put('/cart/update', protect, updateCartItemQuantity);
router.delete('/cart/remove/:productId', protect, removeFromCart);
router.get('/profile', protect, getUserProfile); 
router.put('/profile', protect, updateUserProfile);

module.exports = router;

