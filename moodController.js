const supabase = require('./supabaseClient');

// 1. CREATE: Simpan Mood Baru
const saveMood = async (req, res) => {
  const { mood_level, note, user_id } = req.body;

  // Validasi input sederhana biar gak ada data kosong
  if (!mood_level || !user_id) {
    return res.status(400).json({ message: "Mood level dan User ID wajib diisi ya!" });
  }

  const { data, error } = await supabase
    .from('moods')
    .insert([{ mood_level, note, user_id }])
    .select();

  if (error) {
    return res.status(400).json({ message: "Gagal simpan mood", error: error.message });
  }

  res.status(201).json({
    message: "Mood berhasil disimpan! Semangat terus ya! ✨",
    data: data[0]
  });
};

// 2. READ: Ambil Semua Mood (Bisa untuk Admin/Debug)
const getAllMoods = async (req, res) => {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

// 3. READ: Ambil Mood Per User (PENTING untuk Kalender & Chart)
const getUserMoods = async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

// 4. UPDATE: Edit Mood (Jika user salah input)
const updateMood = async (req, res) => {
  const { id } = req.params; // ID unik baris mood
  const { mood_level, note } = req.body;

  const { data, error } = await supabase
    .from('moods')
    .update({ mood_level, note })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Mood berhasil diperbarui!", data: data[0] });
};

// 5. DELETE: Hapus Mood
const deleteMood = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('moods')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Mood berhasil dihapus!" });
};

// 6. STATS: Data untuk Bar Chart (Menghitung jumlah mood)
const getMoodStats = async (req, res) => {
  const { userId } = req.params;
  
  const { data, error } = await supabase
    .from('moods')
    .select('mood_level')
    .eq('user_id', userId);

  if (error) return res.status(400).json({ error: error.message });

  // Logic simpel hitung jumlah: { "Happy": 5, "Sad": 2 }
  const stats = data.reduce((acc, curr) => {
    acc[curr.mood_level] = (acc[curr.mood_level] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json(stats);
};

module.exports = { 
  saveMood, 
  getAllMoods, 
  getUserMoods, 
  updateMood, 
  deleteMood,
  getMoodStats 
};