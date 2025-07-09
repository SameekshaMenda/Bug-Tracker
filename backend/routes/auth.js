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
// routes/auth.js or controllers/auth.js
router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload;

  // ✅ Check if the user exists and is approved
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(403).json({ message: "Access Denied: You are not an approved user." });
  }

  if (!user.isApproved) {
    return res.status(403).json({ message: "Access Denied: You are not approved by admin." });
  }

  // ✅ Update googleId if not already stored
  if (!user.googleId) {
    user.googleId = sub;
    await user.save();
  }

  // generate JWT or return session
  const tokenToSend = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token: tokenToSend, user });
});


module.exports = router;
