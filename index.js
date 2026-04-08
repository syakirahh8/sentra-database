require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// 🔥 1. CORS DULU (BIAR PREFLIGHT GA DIBLOCK)
app.use(cors({
  origin: true, // sementara bebasin dulu biar ga ribet
  credentials: true
}));

// 🔥 2. JSON PARSER
app.use(express.json());

// 🔥 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// 🔥 4. TEST ENDPOINT (BIAR LO TAU SERVER HIDUP)
app.get('/', (req, res) => {
  res.send('API jalan 🔥');
});

// 🔥 5. 404
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// 🔥 6. START SERVER
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Sentra Mood API berhasil jalan di port ${PORT}`);
});