const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Endpoint: GET /api/users
router.get('/', async (req, res) => {
    try {
        // 👇 CCTV KITA SAAT BUKA USER INSIGHTS 👇
        console.log(`\n📡 [REQUEST MASUK] Session ID: ${req.sessionID}`);
        console.log(`📦 Isi req.session.adminId:`, req.session.adminId);

        // Proteksi Session
        if (!req.session || !req.session.adminId) {
            return res.status(401).json({ message: "Akses ditolak. Silakan login." });
        }

        // ==========================================
        // PERBAIKAN: Hapus 'created_at' dari query
        // ==========================================
        const result = await db.query(
            'SELECT id, name, email, role FROM users ORDER BY id DESC'
        );

        res.json(result.rows); 

    } catch (error) {
        console.error("Database Error di UserRoutes:", error.message);
        res.status(500).json({ message: "Gagal mengambil data dari database." });
    }
});

module.exports = router;