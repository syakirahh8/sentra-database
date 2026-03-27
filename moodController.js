// Kita panggil "Supir" (koneksi) dari supabaseClient.js
const supabase = require('./supabaseClient');

// 1. Fungsi untuk SIMPAN MOOD (Tugas Utama Kamu)
const saveMood = async (req, res) => {
  // Ambil data yang dikirim dari Front-End (Dashboard)
  const { mood_level, note, user_id } = req.body;

  // Masukkan ke tabel 'moods' di Supabase
  const { data, error } = await supabase
    .from('moods') 
    .insert([
      { 
        mood_level: mood_level, 
        note: note, 
        user_id: user_id 
      }
    ])
    .select(); // Ambil data yang baru saja masuk untuk konfirmasi

  // Jika ada error (misal: tabel ga ketemu atau koneksi putus)
  if (error) {
    return res.status(400).json({ 
      message: "Yah gagal bes simpan moodnya", 
      error: error.message 
    });
  }

  // Jika berhasil
  res.status(201).json({
    message: "Mood berhasil disimpa yeyeyeyyeye!!!, semangat hidup yh",
    data: data
  });
};

// 2. Fungsi untuk AMBIL MOOD (Untuk nampilin di Kalender/Chart)
const getAllMoods = async (req, res) => {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};

// Ekspor fungsinya agar bisa dipanggil di app.js
module.exports = { saveMood, getAllMoods };