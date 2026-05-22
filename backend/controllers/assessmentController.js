const db = require('../config/db');

// ==========================================
// 1. GET ALL ASSESSMENTS (USER & ADMIN)
// ==========================================
exports.getAssessments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM assessments
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getAssessments:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================================
// 2. CREATE ASSESSMENT (KHUSUS ADMIN)
// ==========================================
exports.createAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang bisa membuat soal.' });
    }

    // [DITAMBAHKAN]: description ditangkap dari req.body
    const { title, category, duration, description } = req.body;
    
    // Validasi dasar (description tidak wajib agar fleksibel)
    if (!title || !category || !duration) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    // [DITAMBAHKAN]: description ke dalam Query SQL
    const result = await db.query(
      `INSERT INTO assessments (title, category, duration, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, category, duration, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error createAssessment:", error);
    res.status(500).json({ message: 'Gagal membuat soal kuis.' });
  }
};

// ==========================================
// [FUNGSI BARU]: UPDATE ASSESSMENT (KHUSUS ADMIN)
// ==========================================
exports.updateAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang bisa mengedit soal.' });
    }

    const id = parseInt(req.params.id, 10);
    const { title, category, duration, description } = req.body;

    if (!title || !category || !duration) {
      return res.status(400).json({ message: 'Field title, category, dan duration wajib diisi.' });
    }

    const result = await db.query(
      `UPDATE assessments 
       SET title = $1, category = $2, duration = $3, description = $4 
       WHERE id = $5 RETURNING *`,
      [title, category, duration, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assessment tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updateAssessment:", error);
    res.status(500).json({ message: 'Gagal mengedit soal kuis.' });
  }
};

// ==========================================
// 3. DELETE ASSESSMENT TEMPLATE (KHUSUS ADMIN)
// ==========================================
exports.deleteAssessment = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }
    const id = parseInt(req.params.id, 10);
    await db.query(`DELETE FROM assessments WHERE id = $1`, [id]);
    res.json({ message: 'Assessment template berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteAssessment:", error);
    res.status(500).json({ message: 'Gagal menghapus template.' });
  }
};

// ==========================================
// 4. SUBMIT ASSESSMENT (KHUSUS USER) - TERINTEGRASI DENGAN PROGRESS
// ==========================================
exports.submitAssessment = async (req, res) => {
  try {
    if (req.session.adminId) {
      return res.status(403).json({ message: 'Admin tidak boleh mengerjakan kuis.' });
    }
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Silakan login.' });
    }

    const user_id = parseInt(req.session.userId, 10);
    const { assessment_id, score, timeSpentHours } = req.body;

    // MULAI TRANSAKSI DATABASE
    await db.query('BEGIN');

    // 1. Simpan ke tabel assessment_results
    const result = await db.query(
      `INSERT INTO assessment_results (user_id, assessment_id, score, created_at) 
       VALUES($1, $2, $3, NOW()) RETURNING *`,
      [user_id, assessment_id, score]
    );

    // 2. Ambil kategori untuk Radar Chart
    const assessInfo = await db.query(`SELECT category FROM assessments WHERE id = $1`, [assessment_id]);
    const skillCategory = assessInfo.rows.length > 0 ? assessInfo.rows[0].category : 'General';

    // 3. Tambah jam belajar ke user_activities (Bar Chart)
    const hours = timeSpentHours || 0.5; // Jika tidak dikirim dari FE, set default 30 menit (0.5 jam)
    await db.query(
      `INSERT INTO user_activities (user_id, activity_date, hours_spent) 
       VALUES ($1, CURRENT_DATE, $2)`,
      [user_id, hours]
    );

    // 4. Update/Insert Data Skill (Radar Chart)
    const checkSkill = await db.query(
      `SELECT id, proficiency FROM user_skills WHERE user_id = $1 AND skill_name = $2`,
      [user_id, skillCategory]
    );

    if (checkSkill.rows.length > 0) {
      // Perbarui dengan nilai tertinggi
      await db.query(
        `UPDATE user_skills 
         SET proficiency = GREATEST(proficiency, $3), updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 AND skill_name = $2`,
        [user_id, skillCategory, score]
      );
    } else {
      // Masukkan data skill baru
      await db.query(
        `INSERT INTO user_skills (user_id, skill_name, proficiency) 
         VALUES ($1, $2, $3)`,
        [user_id, skillCategory, score]
      );
    }

    // SIMPAN SEMUA PERUBAHAN
    await db.query('COMMIT');

    res.json({ message: 'Hasil berhasil disimpan dan Progress diperbarui!', data: result.rows[0] });
  } catch (error) {
    // BATALKAN SEMUA PERUBAHAN JIKA ADA ERROR
    await db.query('ROLLBACK');
    console.error("Error submitAssessment:", error);
    res.status(500).json({ message: 'Gagal menyimpan hasil dan progress.' });
  }
};

// ==========================================
// 5. GET ALL USER RESULTS (HISTORY)
// ==========================================
exports.getUserResults = async (req, res) => {
  try {
    if (req.session.adminId) return res.json([]); 
    if (!req.session.userId) return res.status(401).json({ message: 'Silakan login.' });

    const result = await db.query(
      `SELECT ar.id, a.title, a.category, ar.score, ar.created_at
       FROM assessment_results ar
       JOIN assessments a ON a.id = ar.assessment_id
       WHERE ar.user_id = $1 ORDER BY ar.created_at DESC`,
      [req.session.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getUserResults:", error);
    res.status(500).json({ message: 'Gagal mengambil riwayat.' });
  }
};

// ==========================================
// 6. GET SINGLE RESULT DETAIL (FIXED)
// ==========================================
exports.getResultDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'ID tidak valid.' });

    // Cek Session ID yang aktif
    const userId = req.session.userId;
    const adminId = req.session.adminId;

    console.log("🔍 [DEBUG] Mencari detail kuis ID:", id);
    console.log("👤 [DEBUG] Session userId:", userId, "| adminId:", adminId);

    // Jika keduanya kosong, berarti browser tidak kirim cookie (401)
    if (!userId && !adminId) {
      return res.status(401).json({ message: 'Sesi tidak ditemukan. Silakan login ulang.' });
    }

    // Query Fallback: Admin bisa lihat semua, User hanya bisa lihat miliknya
    let query;
    let params;

    if (adminId) {
      query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at
               FROM assessment_results ar
               JOIN assessments a ON a.id = ar.assessment_id
               WHERE ar.id = $1`;
      params = [id];
    } else {
      query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at
               FROM assessment_results ar
               JOIN assessments a ON a.id = ar.assessment_id
               WHERE ar.id = $1 AND ar.user_id = $2`;
      params = [id, userId];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan di database.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("🚨 Error Detail:", error.message);
    res.status(500).json({ message: 'Server error detail.' });
  }
};

// ==========================================
// 7. DELETE ASSESSMENT RESULT (KHUSUS ADMIN)
// ==========================================
exports.deleteResult = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak! Hanya Admin yang boleh menghapus.' });
    }

    const id = parseInt(req.params.id, 10);
    const result = await db.query(`DELETE FROM assessment_results WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }

    res.json({ message: 'Riwayat kuis berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteResult:", error);
    res.status(500).json({ message: 'Gagal menghapus data riwayat.' });
  }
};