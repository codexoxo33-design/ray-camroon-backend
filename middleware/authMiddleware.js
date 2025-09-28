const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Header se token nikalein (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Token ko verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token ki ID se user ko dhoondhein aur request mein add kar dein
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Agle step par jaane dein
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };