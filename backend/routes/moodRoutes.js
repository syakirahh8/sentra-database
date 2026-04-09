const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/stats', authenticateToken, moodController.getMoodStats);
router.get('/calendar', authenticateToken, moodController.getCalendarMoods);
router.post('/', authenticateToken, moodController.saveMood);
router.put('/:id', authenticateToken, moodController.updateMood);
router.delete('/:id', authenticateToken, moodController.deleteMood);

module.exports = router;