import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Agent from './models/Agent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aikart';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.log('MongoDB connection note (can run offline with mocks):', err.message));

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'aiKart API', timestamp: new Date() });
});

// Get all agents (with search, category, and pricing filters)
app.get('/api/agents', async (req, res) => {
  try {
    const { category, pricing, search, limit = 20, page = 1 } = req.query;
    let query = {};

    if (category && category !== 'All Categories') {
      query.categories = { $in: [category] };
    }
    if (pricing && pricing !== 'All') {
      query.pricing_model = pricing;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }

    const agents = await Agent.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Agent.countDocuments(query);

    res.json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent by ID
app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    res.json({ success: true, data: agent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new agent listing (Seller onboarding)
app.post('/api/agents', async (req, res) => {
  try {
    const newAgent = new Agent(req.body);
    await newAgent.save();
    res.status(201).json({ success: true, data: newAgent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Contact / Schedule meeting endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, phone, note, type } = req.body;
  console.log(`[Lead received] Type: ${type}, Name: ${name}, Email: ${email}`);
  res.json({ success: true, message: 'Request received successfully!' });
});

// Newsletter subscription endpoint
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  console.log(`[Newsletter signup] Email: ${email}`);
  res.json({ success: true, message: 'Subscribed to aiKart updates!' });
});

app.listen(PORT, () => {
  console.log(`aiKart API server running on port ${PORT}`);
});
