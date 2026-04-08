require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// 🔥 CORS SUPER TERBUKA
app.use(cors());
app.use(express.json());

// 🔥 TEST ROUTE (WAJIB ADA)
app.post('/test', (req, res) => {
  console.log("KENA HIT 🔥");
  res.json({ success: true });
});

// 🔥 TEST MOODS (PASTI JALAN)
app.post('/api/moods', (req, res) => {
  console.log("BODY:", req.body);
  res.json({
    status: "success",
    data: req.body
  });
});

// 🔥 TEST CALENDAR
app.get('/api/moods/calendar', (req, res) => {
  res.json({
    "2026-03-17": { mood_level: 5, note: "test" }
  });
});

app.listen(5000, () => {
  console.log("SERVER HIDUP DI 5000 🔥");
});