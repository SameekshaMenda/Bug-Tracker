const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true, sparse: true }, // Optional if using Google
  email: { type: String, unique: true, sparse: true },     // Optional if using manual
  password: { type: String },  // Hashed password
  googleId: { type: String },  // Only for Google OAuth
  role: { type: String, enum: ['reporter', 'developer', 'admin'], default: 'reporter' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
