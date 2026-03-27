const supabase = require('./supabaseClient');

// 1. CREATE: Simpan Mood Baru
const saveMood = async (req, res) => {
  // Cek apakah user sudah login lewat middleware
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Silakan login dulu!" });
  }

  const { mood_level, note } = req.body;
  const user = req.user; // Diambil dari token oleh Satpam

  if (!mood_level) {
    return res.status(400).json({ message: "Mood level wajib diisi!" });
  }

  const { data, error } = await supabase
    .from('moods')
    .insert([
      {
        mood_level,
        note,
        user_id: user.id
      }
    ])
    .select();

  if (error) {
    return res.status(400).json({ message: "Gagal simpan mood", error: error.message });
  }

  res.status(201).json({
    message: "Mood berhasil disimpan! Semangat ya! ✨",
    data: data[0]
  });
};

// 2. READ: Ambil Mood milik user login (PENTING untuk Kalender)
const getUserMoods = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
};

// 3. UPDATE: Edit Mood
const updateMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const { mood_level, note } = req.body;

  const { data, error } = await supabase
    .from('moods')
    .update({ mood_level, note })
    .eq('id', id)
    .eq('user_id', req.user.id) // Pastikan hanya bisa edit mood milik sendiri
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({
    message: "Mood berhasil diperbarui!",
    data: data[0]
  });
};

// 4. DELETE: Hapus Mood
const deleteMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  const { error } = await supabase
    .from('moods')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id); // Pastikan hanya bisa hapus mood milik sendiri

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Mood berhasil dihapus!" });
};

// 5. STATS: Data untuk Bar Chart (Hitung jumlah mood)
const getMoodStats = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;

  const { data, error } = await supabase
    .from('moods')
    .select('mood_level')
    .eq('user_id', user.id);

  if (error) return res.status(400).json({ error: error.message });

  // Logic hitung jumlah: { "Happy": 5, "Sad": 2 }
  const stats = data.reduce((acc, curr) => {
    acc[curr.mood_level] = (acc[curr.mood_level] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json(stats);
};

module.exports = {
  saveMood,
  getUserMoods,
  updateMood,
  deleteMood,
  getMoodStats
};