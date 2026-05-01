const Counter = require('../models/Counter');

/**
 * Generate a sequential ID using MongoDB counters collection safely.
 * @param {string} sequenceName - The name of the sequence (e.g. 'studentId', 'sessionId')
 * @param {string} prefix - The prefix for the generated ID (e.g. 's', 'att_')
 * @returns {Promise<string>} The generated ID (e.g. 's10', 'att_5')
 */
const generateId = async (sequenceName, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return `${prefix}${counter.seq}`;
};

module.exports = generateId;
