const supabase = require('../config/supabaseClient');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Access denied. Tokennya mana? Login dulu yh!' 
    });
  }

  try {
    // verif token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Invalid or expired session. Login lagi bes' 
      });
    }

    // simpan user ke moodcontroller
    req.user = user;
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Terjadi kesalahan pada server' 
    });
  }
};

module.exports = authenticateToken;