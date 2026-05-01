const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
  {
    _id: { type: String, required: true }, // att_1
    sessionId: { type: String, required: true, unique: true }, // att_1
    date: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
    presentStudents: [{ type: String }],
    faceUrls: { type: Map, of: String },
  },
  { timestamps: true }
);

const History = mongoose.model('History', historySchema, 'history');
module.exports = History;
