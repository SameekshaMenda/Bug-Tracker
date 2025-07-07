const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Bug = require('./models/bug');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Routes
// backend/routes/bugs.js or similar

app.get("/bugs", async (req, res) => {
  try {
    const { reporter } = req.query;

    let bugs;
    if (reporter) {
      bugs = await Bug.find({ reporter });
    } else {
      bugs = await Bug.find();
    }

    res.json(bugs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bugs" });
  }
});

app.post("/bugs", async (req, res) => {
  const bug = new Bug(req.body);
  await bug.save();
  res.json(bug);
});

app.put("/bugs/:id", async (req, res) => {
  const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBug);
});

app.delete("/bugs/:id", async (req, res) => {
  await Bug.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


app.post("/ai/predict-priority", async (req, res) => {
  const { description } = req.body;

  let priority = "Low";
  if (description.match(/crash|fail|error|not working|unable/i)) {
    priority = "High";
  } else if (description.match(/slow|delay|glitch/i)) {
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
