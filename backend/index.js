require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moodRoutes = require('./routes/moodRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. CONFIG CORS (Izin untuk Frontend)
app.use(cors({
  origin: 'http://localhost:5173', // Pastikan port ini sesuai dengan Vite kamu
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. MIDDLEWARE
app.use(express.json());

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});