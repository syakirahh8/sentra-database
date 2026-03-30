require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// --- Global Middleware ---
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
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

// --- Gunakan Routes ---
app.use('/api/auth', authRoutes);     // semua auth jadi /api/auth/...
app.use('/api/moods', moodRoutes);    // semua mood jadi /api/moods/...

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