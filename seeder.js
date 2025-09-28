const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Yeh naya import hai
const users = require('./data/users.js');
const products = require('./data/products.js');
const User = require('./models/userModel.js');
const Product = require('./models/productModel.js');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await User.deleteMany();

    // Users ke password ko hash karein
    const usersWithHashedPasswords = users.map(user => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        return { ...user, password: hashedPassword };
    });

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported with Hashed Passwords!'); // Updated Message
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();