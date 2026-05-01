const express = require('express');
const router = express.Router();
const { uploadAttendanceVideo, getRecentAttendance, getAttendanceHistory, getAttendanceSession } = require('../controllers/teacherController');
const { protect, teacherOnly } = require('../middlewares/authMiddleware');
const { uploadVideo } = require('../utils/upload');

router.use(protect, teacherOnly);

// POST /api/teacher/attendance/upload
router.post('/attendance/upload', uploadVideo.single('video'), uploadAttendanceVideo);

// GET /api/teacher/attendance
router.get('/attendance', getRecentAttendance);

// GET /api/teacher/attendance/history
router.get('/attendance/history', getAttendanceHistory);

// GET /api/teacher/attendance/:sessionId
router.get('/attendance/:sessionId', getAttendanceSession);

module.exports = router;
