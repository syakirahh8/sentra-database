require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Controllers
const auth = require('./authController'); 
const mood = require('./moodController');

// Import Middleware (Satpam Token)
const authenticateToken = require('./authMiddleware'); 

const app = express();

// --- Global Middleware ---
app.use(cors()); // Mengizinkan akses dari Frontend (React)
app.use(express.json()); // Parsing data JSON dari body request

// --- 1. Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Sentra Mood API is active and running.' 
  });
});

// --- 2. Authentication Routes ---
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);

// Logout (Frontend clears token, but we provide this for API compliance)
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Logged out successfully.' 
  });
});

// --- 3. Protected Mood Tracker Routes ---
// Semua rute di bawah ini wajib membawa "Bearer Token" di Header Authorization

// Create: Save new mood
app.post('/api/moods', authenticateToken, mood.saveMood);

// Read: Get mood history for specific user (Calendar feature)
app.get('/api/moods/user/:userId', authenticateToken, mood.getUserMoods);

// Read: Get mood statistics (Bar Chart feature)
app.get('/api/moods/stats/:userId', authenticateToken, mood.getMoodStats);

// Update & Delete: Edit or remove mood entries
app.put('/api/moods/:id', authenticateToken, mood.updateMood);
app.delete('/api/moods/:id', authenticateToken, mood.deleteMood);

// Extra: Get all moods for debugging/admin
app.get('/api/moods', authenticateToken, mood.getAllMoods);

// --- 4. 404 Error Handling ---
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'API endpoint not found.' 
  });
});

// --- 5. Server Initialization ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[INFO] Sentra Mood API server successfully started on port ${PORT}`);
});