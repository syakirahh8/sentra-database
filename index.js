require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// 1. MIDDLEWARE WAJIB (Biar bisa baca data JSON dari Frontend)
app.use(express.json());

// 2. KONFIGURASI CORS (Global)
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'http://localhost:3000'
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/** * CATATAN: 
 * Baris app.options('*') atau app.options('.*') DIHAPUS 
 * karena sudah otomatis ditangani oleh app.use(cors()) di atas.
 * Ini untuk menghindari error PathError pada Node.js versi terbaru.
 */

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// 4. 404 NOT FOUND
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// 5. START SERVER
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  // Menggunakan Backtick (tombol sebelah angka 1) untuk template literal
  console.log(`Sentra Mood API berhasil jalan di port ${PORT}`);
});