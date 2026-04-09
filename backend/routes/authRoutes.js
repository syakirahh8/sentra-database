const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Daftar User Baru
router.post('/register', authController.register);

// Login (Dapetin Token)
router.post('/login', authController.login);

// Logout (Matiin Sesi di Supabase)
router.post('/logout', authController.logout);

module.exports = router;