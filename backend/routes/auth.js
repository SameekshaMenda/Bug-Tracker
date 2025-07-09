const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Secret Key for JWT
const JWT_SECRET = 'your_secret_key_here'; // Use env variable in production

// Manual Signup
router.post('/signup', async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Manual Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    // You should verify the token using Google Auth Library here
    // For simplicity, let's assume you decoded a valid Google profile

    const { name, email, sub: googleId } = req.body.profile; // Normally you'd get this from token verification

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token: jwtToken, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Google Auth failed' });
  }
});

module.exports = router;
