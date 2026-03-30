const supabase = require('./supabaseClient');

// 1. CREATE: Simpan Mood Baru
const saveMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Heyy login dulu yh!" });
  }

  const { mood_level, note } = req.body;
  const user = req.user;

  if (!mood_level) {
    return res.status(400).json({ message: "Mood level wajib diisi!" });
  }

  const { data, error } = await supabase
    .from('moods')
    .insert([{ mood_level, note, user_id: user.id }])
    .select();

  if (error) {
    return res.status(400).json({ 
      message: "Gagal simpan mood kamu", 
      error: error.message 
    });
  }

  res.status(201).json({
    message: "Mood udh disimpan!! Semangat idup yh!",
    data: data[0]
  });
};

// 2. READ: Ambil Mood milik user login
const getUserMoods = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', req.user.id)
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
    .eq('user_id', req.user.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      message: "Mood tidak ditemukan atau bukan punya kamu 😛😛😛"
    });
  }

  res.status(200).json({
    message: "Mood berhasil diupdate!",
    data: data[0]
  });
};

// 4. DELETE Mood
const deleteMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  const { data, error } = await supabase
    .from('moods')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      message: "Mood tidak ditemukan atau bukan punya kamu 😛😛😛"
    });
  }

  res.status(200).json({
    message: "Mood berhasil dihapus!"
  });
};

// 5. STATS: Data untuk Bar Chart
const getMoodStats = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from('moods')
    .select('mood_level')
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });

  const stats = data.reduce((acc, curr) => {
    acc[curr.mood_level] = (acc[curr.mood_level] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json(stats);
};

module.exports = {
  saveMood,
  getUserMoods,
  getMoodStats,
  updateMood,
  deleteMood,
};