const db = require('../config/db');

// ==========================================
// 1. GET ALL ROADMAPS
// ==========================================
exports.getRoadmaps = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM roadmaps ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error("Error getRoadmaps:", error);
    res.status(500).json({ message: 'Failed to get roadmaps' });
  }
};

// ==========================================
// 2. TOGGLE ROADMAP PROGRESS (TERHUBUNG KE ACTIVITIES)
// ==========================================
exports.toggleProgress = async (req, res) => {
  try {
    // Menangkap data yang dikirim dari Frontend (Roadmap.jsx)
    const { userId, phaseId, taskId } = req.body;

    // Proteksi keamanan ganda: Pastikan ada ID User (baik dari body atau session)
    const currentUserId = req.session?.userId || userId;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Silakan login terlebih dahulu.' });
    }

    // MULAI TRANSAKSI: Kunci database agar operasi aman
    await db.query('BEGIN');

    // 1. Cek apakah task ini sudah pernah dicentang oleh user ini
    const checkExist = await db.query(
      `SELECT id FROM user_roadmap_progress 
       WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
      [currentUserId, phaseId, taskId]
    );

    if (checkExist.rows.length > 0) {
      // 2A. JIKA UNCHECK: Hapus dari tabel roadmap
      await db.query(
        `DELETE FROM user_roadmap_progress 
         WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
        [currentUserId, phaseId, taskId]
      );

      // Kurangi jam belajar di Bar Chart (Hapus 1 log berdurasi 0.17 jam / 10 menit untuk hari ini)
      await db.query(
        `DELETE FROM user_activities 
         WHERE id IN (
           SELECT id FROM user_activities 
           WHERE user_id = $1 AND activity_date = CURRENT_DATE AND hours_spent = 0.17 
           LIMIT 1
         )`,
        [currentUserId]
      );

      // SIMPAN PERUBAHAN
      await db.query('COMMIT');
      return res.json({ message: 'Task berhasil di-uncheck dan jam belajar dikurangi', status: 'removed' });
      
    } else {
      // 2B. JIKA CHECK: Tambahkan ke tabel roadmap
      await db.query(
        `INSERT INTO user_roadmap_progress (user_id, phase_id, task_id, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [currentUserId, phaseId, taskId]
      );

      // OTOMATISASI: Tambahkan jam belajar ke Bar Chart (0.17 jam / 10 menit)
      await db.query(
        `INSERT INTO user_activities (user_id, activity_date, hours_spent) 
         VALUES ($1, CURRENT_DATE, 0.17)`,
        [currentUserId]
      );

      // SIMPAN PERUBAHAN
      await db.query('COMMIT');
      return res.json({ message: 'Task berhasil di-check dan jam belajar ditambahkan', status: 'added' });
    }

  } catch (error) {
    // JIKA GAGAL: Batalkan semua perubahan di database
    await db.query('ROLLBACK');
    console.error("Error toggle roadmap progress:", error);
    res.status(500).json({ message: 'Gagal menyimpan progress roadmap' });
  }
};