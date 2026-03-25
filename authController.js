const supabase = require('./supabaseClient');

const register = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "User terdaftar!", user: data.user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: "Login Berhasil!", token: data.session.access_token, user: data.user });
};

module.exports = { register, login };