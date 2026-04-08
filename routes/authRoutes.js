const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Route Autentikasi ---

// 1. Pendaftaran User Baru
router.post('/register', authController.register);

// 2. Login (Dapetin Token)
router.post('/login', authController.login);

// 3. Logout (Matiin Sesi di Supabase)
// Kita ganti (req, res) tadi dengan memanggil fungsi dari controller
router.post('/logout', authController.logout);

module.exports = router;