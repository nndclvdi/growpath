// backend/controllers/assessmentController.js
const AssessmentModel = require('../models/assessmentModel');

exports.getAssessments = async (req, res) => {
  try {
    const data = await AssessmentModel.getAllAssessments();
    res.json(data);
  } catch (error) {
    console.error("Error getAssessments:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang bisa membuat soal.' });
    const { title, category, duration, description } = req.body;
    if (!title || !category || !duration) return res.status(400).json({ message: 'Semua field wajib diisi.' });

    const newAsm = await AssessmentModel.createAssessment(title, category, duration, description);
    res.status(201).json(newAsm);
  } catch (error) {
    console.error("Error createAssessment:", error);
    res.status(500).json({ message: 'Gagal membuat soal kuis.' });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang bisa mengedit soal.' });
    const id = parseInt(req.params.id, 10);
    const { title, category, duration, description } = req.body;
    if (!title || !category || !duration) return res.status(400).json({ message: 'Field wajib diisi.' });

    const rows = await AssessmentModel.updateAssessment(id, title, category, duration, description);
    if (rows.length === 0) return res.status(404).json({ message: 'Assessment tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updateAssessment:", error);
    res.status(500).json({ message: 'Gagal mengedit soal kuis.' });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) return res.status(403).json({ message: 'Akses ditolak.' });
    const id = parseInt(req.params.id, 10);
    await AssessmentModel.deleteAssessment(id);
    res.json({ message: 'Assessment template berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteAssessment:", error);
    res.status(500).json({ message: 'Gagal menghapus template.' });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    if (req.session.adminId) return res.status(403).json({ message: 'Admin tidak boleh mengerjakan kuis.' });
    if (!req.session.userId) return res.status(401).json({ message: 'Silakan login.' });

    const userId = parseInt(req.session.userId, 10);
    const { assessment_id, score, timeSpentHours } = req.body;
    const hours = timeSpentHours || 0.5;

    const skillCategory = await AssessmentModel.getAssessmentCategory(assessment_id);
    const result = await AssessmentModel.submitAssessmentResult(userId, assessment_id, score, hours, skillCategory);
    
    res.json({ message: 'Hasil berhasil disimpan dan Progress diperbarui!', data: result });
  } catch (error) {
    console.error("Error submitAssessment:", error);
    res.status(500).json({ message: 'Gagal menyimpan hasil dan progress.' });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    if (req.session.adminId) return res.json([]); 
    if (!req.session.userId) return res.status(401).json({ message: 'Silakan login.' });

    const data = await AssessmentModel.getUserResultsHistory(req.session.userId);
    res.json(data);
  } catch (error) {
    console.error("Error getUserResults:", error);
    res.status(500).json({ message: 'Gagal mengambil riwayat.' });
  }
};

exports.getResultDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid.' });

    const userId = req.session.userId;
    const adminId = req.session.adminId;
    if (!userId && !adminId) return res.status(401).json({ message: 'Sesi tidak ditemukan.' });

    const rows = await AssessmentModel.getResultDetail(id, userId, adminId);
    if (rows.length === 0) return res.status(404).json({ message: 'Data tidak ditemukan di database.' });
    
    res.json(rows[0]);
  } catch (error) {
    console.error("🚨 Error Detail:", error.message);
    res.status(500).json({ message: 'Server error detail.' });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    if (!req.session.adminId) return res.status(403).json({ message: 'Akses ditolak!' });
    const id = parseInt(req.params.id, 10);
    
    const rowCount = await AssessmentModel.deleteResult(id);
    if (rowCount === 0) return res.status(404).json({ message: 'Data tidak ditemukan.' });
    
    res.json({ message: 'Riwayat kuis berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteResult:", error);
    res.status(500).json({ message: 'Gagal menghapus data riwayat.' });
  }
};