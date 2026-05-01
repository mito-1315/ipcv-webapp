const Mapper = require('../models/Mapper');
const generateId = require('../utils/generateId');
const axios = require('axios');
const path = require('path');

const addStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, department, year, section } = req.body;
    
    // Check if student exists
    const studentExists = await Mapper.findOne({ rollNumber });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    // 1. Generate ID
    const studentId = await generateId('studentId', 's');

    // 2. Save metadata
    const student = await Mapper.create({
      _id: studentId,
      studentId,
      name,
      rollNumber,
      email,
      department,
      year,
      section,
    });

    // 3. Delegate image processing to Flask if images exist
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(f => path.resolve(f.path));
      
      try {
        await axios.post(`${process.env.FLASK_API_URL}/flask/convert_images`, {
          student_id: studentId,
          image_paths: imagePaths
        });
      } catch (err) {
        console.error('Flask image conversion failed:', err.message);
        // We might still return 201 but log the error
      }
    }

    res.status(201).json({ message: 'Student created successfully', studentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Mapper.find({}).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const trainModel = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_API_URL}/flask/train`);
    res.json(response.data);
  } catch (error) {
    console.error('Flask training failed:', error.message);
    res.status(500).json({ message: 'Training failed' });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await require('../models/History').find({})
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addStudent, getStudents, trainModel, getHistory };
