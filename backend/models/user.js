// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  googleId: String,
  username: String,
  password: String,
  isApproved: { type: Boolean, default: false }, // ✅ only allow approved users
  role: { type: String, enum: ['reporter', 'developer', 'admin'], default: 'reporter' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
