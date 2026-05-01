const express = require('express');
const router = express.Router();
const { updateAttendanceComplete } = require('../controllers/internalController');

// Internal routes (should ideally be protected by a special token or IP restriction)
router.post('/attendance/complete', updateAttendanceComplete);

module.exports = router;
