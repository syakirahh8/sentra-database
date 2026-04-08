const supabase = require('../config/supabaseClient');

// REGISTER
const register = async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib diisi'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password minimal 6 karakter'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil! Cek email kamu ya!',
      user: data.user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib diisi'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    // Cek apakah email sudah dikonfirmasi
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({
        status: 'error',
        message: 'Email belum diverifikasi. Cek email dulu ya!'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      token: data.session.access_token,
      user: data.user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server'
    });
  }
};

const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.status(200).json({
      status: 'success',
      message: "Berhasil logout. Sampai jumpa lagi!"
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: "Gagal logout, coba lagi ya!",
      error: error.message
    });
  }
};

module.exports = { 
  register,
  login,
  logout
};