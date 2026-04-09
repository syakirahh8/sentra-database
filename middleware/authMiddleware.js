const supabase = require('../config/supabaseClient');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token tidak ditemukan!' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ status: 'error', message: 'Sesi tidak valid/expired!' });
    }

    req.user = user; // Lempar data user ke controller
    next();
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};

module.exports = authenticateToken;