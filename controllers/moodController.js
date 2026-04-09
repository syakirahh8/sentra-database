const supabase = require('../config/supabaseClient');

const saveMood = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      status: 'error',
      message: "Akses ditolak. Login dulu yuk!" 
    });
  }

  const { mood_level, note } = req.body;
  const userId = req.user.id;

  if (!mood_level || mood_level < 1 || mood_level > 5) {
    return res.status(400).json({ 
      status: 'error',
      message: "Pilih salah satu mood yang tersedia ya (1-5)!" 
    });
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const { data: existingMood, error: checkError } = await supabase
      .from('moods')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())
      .limit(1);

    if (checkError) throw checkError;

    if (existingMood && existingMood.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: "Kamu sudah mencatat mood hari ini. Sampai jumpa besok! 😊",
        alreadySubmitted: true
      });
    }

    // 4. Simpan ke Database
    const { data, error } = await supabase
      .from('moods')
      .insert([{ 
        mood_level: Number(mood_level),
        note: note || "",
        user_id: userId 
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      message: "Mood kamu sudah tersimpan! Semangat ya hari ini!",
      data: data[0]
    });

  } catch (error) {
    console.error("Error di saveMood:", error.message);
    res.status(500).json({
      status: 'error',
      message: "Waduh, ada kendala di server. Coba lagi nanti ya!"
    });
  }
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

const getMoodStats = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;

  // ambil bulan & tahun sekarang
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // awal bulan
  const startOfMonth = new Date(year, month, 1);

  // akhir bulan (otomatis handle 28/30/31)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const { data, error } = await supabase
    .from('moods')
    .select('mood_level')
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) return res.status(400).json({ error: error.message });

  const stats = data.reduce((acc, curr) => {
    acc[curr.mood_level] = (acc[curr.mood_level] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json(stats);
};
// 6. CALENDAR
const getCalendarMoods = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;

  const { data, error } = await supabase
    .from('moods')
    .select('id, mood_level, note, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }); // biar rapi

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const result = {};

  data.forEach(item => {
    const localDate = new Date(item.created_at);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    const date = `${year}-${month}-${day}`;

    result[date] = {
      mood_level: item.mood_level,
      note: item.note
    };
  });

  res.status(200).json(result);
};
module.exports = {
  saveMood,
  getMoodStats,
  updateMood,
  deleteMood,
  getCalendarMoods
};