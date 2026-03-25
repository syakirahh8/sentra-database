require('dotenv').config(); // Ini wajib di baris pertama
const { createClient } = require('@supabase/supabase-js');

// Ambil data dari file .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Buat koneksinya
const supabase = createClient(supabaseUrl, supabaseKey);

// "Expor" agar bisa dipakai di file moodController.js dan authController.js
module.exports = supabase;