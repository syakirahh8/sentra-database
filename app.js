require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Controllers
const auth = require('./authController');
const mood = require('./moodController');

// Import Middleware
const authenticateToken = require('./authMiddleware');

const app = express();

// --- Global Middleware ---
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // tambahin port frontend kamu
  credentials: true
}));
app.use(express.json());

// --- Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Sentra Mood API is active and running ✅' 
  });
});

// --- Authentication Routes ---
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Logged out successfully.' 
  });
});

// --- Protected Mood Routes ---
app.get('/api/moods/stats', authenticateToken, mood.getMoodStats);
app.get('/api/moods', authenticateToken, mood.getUserMoods);

app.post('/api/moods', authenticateToken, mood.saveMood);
app.put('/api/moods/:id', authenticateToken, mood.updateMood);
app.delete('/api/moods/:id', authenticateToken, mood.deleteMood);

// --- 404 Not Found ---
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sentra Mood API berhasil jalan di port ${PORT}`);
});