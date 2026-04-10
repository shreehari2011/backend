const express = require('express');
const router = express.Router();
const { getTodayXP, getAllTimeXP, getProgress } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today-xp', protect, getTodayXP);
router.get('/all-time-xp', protect, getAllTimeXP);
router.get('/progress', protect, getProgress);

module.exports = router;
