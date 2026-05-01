const History = require('../models/History');
const Mapper = require('../models/Mapper');
const generateId = require('../utils/generateId');
const axios = require('axios');
const path = require('path');

const uploadAttendanceVideo = async (req, res) => {
  try {
    const { subject, date, startTime, endTime } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    // Generate Session ID
    const sessionId = await generateId('sessionId', 'att_');

    // Create history record with processing status
    await History.create({
      _id: sessionId,
      sessionId,
      subject,
      date,
      startTime,
      endTime,
      teacherId: req.user._id,
      status: 'processing',
      presentStudents: [],
    });

    const videoPath = path.resolve(req.file.path);

    // Make async call to Flask (don't await so we can return immediately)
    axios.post(`${process.env.FLASK_API_URL}/flask/process_video`, {
      videoPath,
      sessionId
    }).catch(err => console.error('Flask call failed:', err.message));

    res.status(202).json({ 
      message: 'Video uploaded successfully. Processing started. Please check back later.', 
      sessionId,
      status: 'processing'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecentAttendance = async (req, res) => {
  try {
    const history = await History.find({ teacherId: req.user._id })
                                 .populate('teacherId', 'name')
                                 .sort({ createdAt: -1 })
                                 .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
    const history = await History.find({ teacherId: req.user._id })
                                 .populate('teacherId', 'name')
                                 .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAttendanceSession = async (req, res) => {
  try {
    const session = await History.findOne({ sessionId: req.params.sessionId, teacherId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Populate student data
    const students = await Mapper.find({ studentId: { $in: session.presentStudents } }).lean();

    // Map the faceUrls from the session to the student objects
    const mappedStudents = students.map(student => ({
      ...student,
      image: session.faceUrls && session.faceUrls.get(student.studentId)
        ? `http://localhost:5050${session.faceUrls.get(student.studentId)}`
        : undefined
    }));

    res.json({
      session,
      students: mappedStudents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadAttendanceVideo, getRecentAttendance, getAttendanceHistory, getAttendanceSession };
