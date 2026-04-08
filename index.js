require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();

// 🔥 INI PALING AMAN (NO CONFIG RIBET)
app.use(cors());

// 🔥 WAJIB ADA
app.use(express.json());

// 🔥 HANDLE PREFLIGHT MANUAL (INI YANG NOLONG LO)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

app.listen(5000, () => {
  console.log("Server jalan di 5000 🔥");
});