const supabase = require('./supabaseClient');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access denied. No token provided.' });
  }

  try {
    // Verifikasi token langsung ke Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ status: 'error', message: 'Invalid or expired session.' });
    }

    // Simpan data user ke request agar bisa dipakai di controller Mood kamu
    req.user = user; 
    next();
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = authenticateToken;