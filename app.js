require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// 1. Hubungkan ke Supabase (Kunci diambil dari file .env kamu)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2. Endpoint Test (Cek apakah server nyala)
app.get('/', (req, res) => {
  res.send('Server Sentra Mood sudah jalan! 🚀');
});

// --- FITUR KAMU: SIMPAN MOOD (Gambar 2 Dashboard) ---
app.post('/api/moods', async (req, res) => {
  const { mood_level, note, user_id } = req.body;

  const { data, error } = await supabase
    .from('moods') // Nama tabel di Supabase temanmu
    .insert([{ mood_level, note, user_id }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Mood berhasil disimpan!', data });
});

// --- FITUR TEMANMU: REGISTER (Gambar 1 Create Account) ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User berhasil terdaftar!', user: data.user });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Server Berhasil Jalan!`);
  console.log(`🔗 Link: http://localhost:${PORT}`);
});