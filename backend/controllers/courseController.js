const db = require('../config/db');

// 1. GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM courses ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error("Error getCourses:", error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
};

// 2. CREATE NEW COURSE (KHUSUS ADMIN)
exports.createCourse = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang diizinkan.' });
    }

    // [TAMBAHAN SINKRONISASI]: Menangkap variabel kolom baru dari request body frontend
    const { title, description, image, category, duration, lessons } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Course Title wajib diisi.' });
    }

    // Mengintegrasikan kolom category, duration, dan lessons ke dalam query penambahan data
    const result = await db.query(
      `INSERT INTO courses (title, description, image, category, duration, lessons, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [title, description, image, category || 'General', duration || 'Self-paced', lessons || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error createCourse:", error);
    res.status(500).json({ message: 'Gagal membuat course baru.' });
  }
};

// 3. UPDATE COURSE (KHUSUS ADMIN)
exports.updateCourse = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const id = parseInt(req.params.id, 10);
    // [TAMBAHAN SINKRONISASI]: Menangkap variabel kolom baru dari request body edit frontend
    const { title, description, image, category, duration, lessons } = req.body;

    // Mengintegrasikan kolom category, duration, dan lessons ke dalam query pembaruan data
    const result = await db.query(
      `UPDATE courses 
       SET title = $1, description = $2, image = $3, category = $4, duration = $5, lessons = $6 
       WHERE id = $7 RETURNING *`,
      [title, description, image, category, duration, lessons, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updateCourse:", error);
    res.status(500).json({ message: 'Gagal merubah data course.' });
  }
};

// 4. DELETE COURSE (KHUSUS ADMIN)
exports.deleteCourse = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const id = parseInt(req.params.id, 10);
    const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Course tidak ditemukan.' });
    }

    res.json({ message: 'Course berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleteCourse:", error);
    res.status(500).json({ message: 'Gagal menghapus data course.' });
  }
};