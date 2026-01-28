const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validate JWT_SECRET on startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'secret') {
  throw new Error('JWT_SECRET environment variable must be set to a secure value');
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Input sanitization
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }
    
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    const hashed = await bcrypt.hash(password, 12); // Increased salt rounds
    const user = await User.create({ 
      name: name?.trim() || '', 
      email: email.toLowerCase().trim(), 
      password: hashed,
      role: 'customer' // Force customer role for new registrations
    });
    
    res.status(201).json({ 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input sanitization and validation
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
