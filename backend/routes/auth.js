// routes/auth.js
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Determine role based on email domain or custom logic
function determineUserRole(email) {
  if (email.endsWith('@company.com')) {
    return 'developer';
  }
  return 'reporter';
}

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const role = determineUserRole(email); // logic to assign role
      user = await User.create({ name, email, googleId, role });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Google auth failed", err);
    res.status(401).json({ error: "Authentication failed" });
  }
});

module.exports = router;
