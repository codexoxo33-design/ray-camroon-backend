const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Is line ko check karein aur theek karein
const User = require('../models/userModel.js');

async function registerUser(req, res) {
  // ... (Register ka poora code yahan)
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) {
      return res.status(500).json({ message: 'Failed to create user' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Register user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function loginUser(req, res) {
  // ... (Login ka poora code yahan)
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Login user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function addToCart(req, res) {
  try {
    const { productId } = req.body || {};
    const userId = req.user && req.user.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingItem = user.cart.find((item) => item.product && item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    return res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getUserCart(req, res) {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.cart);
  } catch (error) {
    console.error('Get user cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateCartItemQuantity(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { productId, quantity } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find((item) => item.product && item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    if (quantity > 0) {
      cartItem.quantity = quantity;
    } else {
      // Remove item from cart if quantity is 0 or less
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    }

    await user.save();
    
    // Return updated cart with populated product details
    const updatedUser = await User.findById(userId).populate('cart.product');
    return res.status(200).json(updatedUser.cart);
  } catch (error) {
    console.error('Update cart item quantity error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the item from cart that matches the productId
    user.cart = user.cart.filter((item) => item.product.toString() !== productId);

    await user.save();

    // Return updated cart with populated product details
    const updatedUser = await User.findById(userId).populate('cart.product');
    return res.status(200).json(updatedUser.cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { registerUser, loginUser, addToCart, getUserCart, updateCartItemQuantity, removeFromCart };