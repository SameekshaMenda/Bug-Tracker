const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Bug = require('./models/bug');
const axios = require('axios');
const { authMiddleware, checkRole } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes: Auth
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ================================
// 🔧 AI Prediction Routes
// ================================

app.post("/ai/predict-priority", (req, res) => {
  const { description } = req.body;

  let priority = "Low";
  if (/crash|fail|error|not working|unable/i.test(description)) {
    priority = "High";
  } else if (/slow|delay|glitch/i.test(description)) {
    priority = "Medium";
  }

  return res.json({ priority });
});

app.post("/ai/predict-type", async (req, res) => {
  const { description } = req.body;
  try {
    const response = await axios.post("http://localhost:5001/predict-type", { description });
    res.json({ type: response.data.type });
  } catch (err) {
    console.error("Type prediction failed:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// ================================
// 🐛 Bug Management Routes
// ================================

// Get bugs (all or by reporter)
app.get("/bugs", async (req, res) => {
  try {
    const { reporter } = req.query;
    const bugs = reporter ? await Bug.find({ reporter }) : await Bug.find();
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bugs" });
  }
});

// Create a new bug
app.post("/bugs", async (req, res) => {
  try {
    const bug = new Bug(req.body);
    await bug.save();
    res.json(bug);
  } catch (err) {
    res.status(500).json({ error: "Failed to create bug" });
  }
});

// Update bug (Developer-only)
// app.put("/bugs/:id", authMiddleware, checkRole("developer"), async (req, res) => {
//   try {
//     const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedBug);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update bug" });
//   }
// });

app.put("/bugs/:id", async (req, res) => {
  const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBug);
});

// Delete bug
app.delete("/bugs/:id", async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bug" });
  }
});


// ================================
// 🚀 Start Server
// ================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
