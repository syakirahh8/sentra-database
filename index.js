require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Sentra Mood API is active and running' 
  });
});

// gunain routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

// 404 not found
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sentra Mood API berhasil jalan di port ${PORT}`);
});