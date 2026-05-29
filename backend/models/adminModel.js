// backend/models/adminModel.js
const db = require('../config/db');

exports.getTotalUsers = async () => {
  const result = await db.query('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0].count) || 0;
};

exports.getTotalAssessments = async () => {
  const result = await db.query('SELECT COUNT(*) FROM assessments');
  return parseInt(result.rows[0].count) || 0;
};