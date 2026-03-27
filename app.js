const express = require('express');
const auth = require('./authController'); // Tugas temanmu
const mood = require('./moodController'); // Tugas kamu

const app = express();
app.use(express.json());

// 1. Endpoint Test
app.get('/', (req, res) => {
  res.send('ANJAY JALAN');
});

// 2. Rute Auth (Hubungkan ke file temanmu)
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login); // Pastikan temanmu sudah buat fungsi login ya!

// 3. Rute Mood (Hubungkan ke file kamu)
app.post('/api/moods', mood.saveMood);
app.get('/api/moods', mood.getAllMoods);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\nYAYYYEYEYE JALAN`);
  console.log(`Link: http://localhost:${PORT}`);
});