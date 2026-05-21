const express = require('express');

const router = express.Router();

const assessmentController = require('../controllers/assessmentController');

const {
  getAssessments,
  createAssessment,
  deleteAssessment,
  submitAssessment,
  getUserResults,
  getResultDetail
} = require('../controllers/assessmentController');

// =========================
// GET ALL ASSESSMENTS
// =========================
router.get('/', getAssessments);

// =========================
// CREATE ASSESSMENT
// =========================
router.post('/', createAssessment);

// =========================
// DELETE ASSESSMENT
// =========================
router.delete('/:id', deleteAssessment);

// =========================
// SUBMIT RESULT
// =========================
router.post('/submit', submitAssessment);

// =========================
// GET DETAIL RESULT BY ID
// =========================
router.get('/results/:id', getResultDetail);

// =========================
// GET ALL USER RESULTS
// =========================
router.get('/results', getUserResults);

// =========================
// DELETE RESULT
// =========================
router.delete(
  '/results/:id',
  assessmentController.deleteResult
);

module.exports = router;