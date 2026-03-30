const supabase = require('./supabaseClient');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Kalau tidak ada token
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Access denied. Tokennya mana? Login dulu yh!' 
    });
  }

  try {
    // Verifikasi token ke Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Invalid or expired session. Login lagi bes' 
      });
    }

    // Simpan user ke request biar bisa dipakai di moodController
    req.user = user;
    next();   // Lanjut ke controller

  } catch (err) {
    console.error(err); // Biar kamu bisa liat error di terminal
    res.status(500).json({ 
      status: 'error', 
      message: 'Terjadi kesalahan pada server' 
    });
  }
};

module.exports = authenticateToken;