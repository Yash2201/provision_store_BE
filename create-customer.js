const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createCustomerUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if customer already exists
    const existingCustomer = await User.findOne({ email: 'customer@freshmart.com' });
    if (existingCustomer) {
      console.log('Customer user already exists');
      process.exit(0);
    }

    // Create customer user
    const hashedPassword = await bcrypt.hash('customer123', 12);
    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@freshmart.com',
      password: hashedPassword,
      role: 'customer'
    });

    console.log('Customer user created successfully:');
    console.log('Email: customer@freshmart.com');
    console.log('Password: customer123');
    console.log('Role: customer');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating customer user:', error);
    process.exit(1);
  }
};

createCustomerUser();