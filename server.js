require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); 
const orderRoutes = require('./routes/orderRoutes');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();

const app = express();
app.use(express.json()); // Yeh line aane wali requests ko JSON ke roop mein pehchanne mein madad karti hai

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', userRoutes); // Yeh line server ko batati hai ki /api/users se shuru hone wale sabhi routes userRoutes file mein milenge
app.use('/api/products', productRoutes); // << YEH NAYI LINE ADD KAREIN
app.use('/api/orders', orderRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});