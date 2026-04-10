const express = require('express');
const router = express.Router();
const { aiGenerateTasks, aiMotivation, aiAnalyze } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-tasks', protect, aiGenerateTasks);
router.get('/motivation', protect, aiMotivation);
router.post('/analyze', protect, aiAnalyze);

module.exports = router;
