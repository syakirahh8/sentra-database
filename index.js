require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Cukup satu aja Bang

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// Konfigurasi CORS
app.use(cors({
  // Tambahin 127.0.0.1 buat jaga-jaga kalau Vite lu lari ke situ
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'http://localhost:3000'
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tambahin ini juga di bawahnya buat nge-handle Preflight request dari browser
app.options('*', cors());

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// 404 not found
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// Start server - Pakai backtick buat template literal
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log("Sentra Mood API berhasil jalan di port ${PORT}");
});