const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    // Debug: Cek apakah session terbaca di sini
    console.log("Session Data:", req.session);

    const result = await db.query(
      'SELECT id, name, email, role FROM users ORDER BY id ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error saat mengambil data user' });
  }
};