const supabase = require('../config/supabaseClient');

// 1. CREATE: Simpan Mood Baru + Anti Double Submit Hari Ini
const saveMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: "Unauthorized: Heyy login dulu yh!" 
    });
  }

  const { mood_level, note } = req.body;
  const userId = req.user.id;

  if (!mood_level) {
    return res.status(400).json({ 
      message: "Mood level wajib diisi!" 
    });
  }

  try {
    // === CEK APAKAH SUDAH SUBMIT HARI INI ===
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);        // Mulai hari ini jam 00:00

    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1); // Besok jam 00:00

    const { data: existingMood, error: checkError } = await supabase
      .from('moods')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())
      .limit(1);

    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ 
        message: "Terjadi kesalahan saat memeriksa mood hari ini" 
      });
    }

    // Kalau sudah ada mood hari ini
    if (existingMood && existingMood.length > 0) {
      return res.status(400).json({
        message: "Kamu sudah submit mood hari ini! Besok lagi ya 😊",
        alreadySubmitted: true
      });
    }

    // === Simpan mood baru ===
    const { data, error } = await supabase
      .from('moods')
      .insert([{ 
        mood_level, 
        note, 
        user_id: userId 
      }])
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

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server"
    });
  }
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