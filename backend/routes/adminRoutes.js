const express = require('express');
const router = express.Router();
const { addStudent, getStudents, trainModel, getHistory } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { uploadImages } = require('../utils/upload');

// All routes require admin auth
router.use(protect, adminOnly);

// POST /api/admin/students
// GET /api/admin/students
router.route('/students')
  .post(uploadImages.array('images', 10), addStudent)
  .get(getStudents);

// POST /api/admin/train
router.post('/train', trainModel);

// GET /api/admin/history
router.get('/history', getHistory);

module.exports = router;
