require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/outputs', express.static(path.join(__dirname, '../outputs')));

app.get('/', (req, res) => {
  res.send('Smart Attendance Portal API is running');
});

// Routes will be mounted here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/internal', require('./routes/internalRoutes'));

module.exports = app;
