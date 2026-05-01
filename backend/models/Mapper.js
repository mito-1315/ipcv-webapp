const mongoose = require('mongoose');

const mapperSchema = mongoose.Schema(
  {
    _id: { type: String, required: true }, // s1, s2
    studentId: { type: String, required: true, unique: true }, // s1, s2
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Mapper = mongoose.model('Mapper', mapperSchema, 'mapper');
module.exports = Mapper;
