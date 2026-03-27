const supabase = require('./supabaseClient');

// --- REGISTER (Daftar Akun Baru) ---
const register = async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    // Fungsi bawaan Supabase untuk mendaftarkan user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name } // Menyimpan nama lengkap ke metadata user
      }
    });

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Check your email for verification (if enabled).',
      user: data.user
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// --- LOGIN (Masuk Akun) ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fungsi bawaan Supabase untuk login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Supabase otomatis memberikan 'access_token' di dalam data.session
    res.status(200).json({
      status: 'success',
      message: 'Login successful!',
      token: data.session.access_token, // Token otomatis dari Supabase
      user: data.user
    });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid login credentials.' });
  }
};

module.exports = { register, login };