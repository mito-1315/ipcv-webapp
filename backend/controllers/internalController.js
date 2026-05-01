const History = require('../models/History');

const updateAttendanceComplete = async (req, res) => {
  try {
    const { sessionId, presentStudents, status, faceUrls } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    await History.findOneAndUpdate(
      { sessionId },
      { status, presentStudents, faceUrls },
      { returnDocument: 'after' }
    );

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateAttendanceComplete };
