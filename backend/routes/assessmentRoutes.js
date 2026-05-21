const express = require('express');

const router = express.Router();

const assessmentController = require('../controllers/assessmentController');

const {
  getAssessments,
  createAssessment,
  deleteAssessment,
  submitAssessment,
  getUserResults,
  getResultDetail,
  updateAssessment // [DITAMBAHKAN]: Destructure fungsi updateAssessment dari controller
} = require('../controllers/assessmentController');

// =========================
// GET ALL ASSESSMENTS
// =========================
router.get('/', getAssessments);

// =========================
// CREATE ASSESSMENT
// =========================
router.post('/', createAssessment);

// ==========================================
// UPDATE ASSESSMENT (KHUSUS ADMIN) [DITAMBAHKAN]
// ==========================================
// Menggunakan rute PUT /:id agar menangani request edit dari frontend tanpa merusak kode lama
router.put('/:id', updateAssessment);

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