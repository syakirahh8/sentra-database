require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Cukup satu aja Bang

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// Konfigurasi CORS
app.use(cors({
  // Izinkan React (5173) tembus ke Node.js
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Sentra Mood API is active and running' 
  });
});

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