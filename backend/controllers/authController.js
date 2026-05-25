const db = require('../config/db');
const bcrypt = require('bcrypt');

// ==========================================
// 1. REGISTER USER
// ==========================================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user baru (default role: 'user')
    const result = await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ==========================================
// 2. LOGIN USER BIASA (Perbaikan Bug Session)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Cari user biasa (bukan admin)
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND role = 'user'",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Akun tidak ditemukan atau Anda mencoba login via jalur User.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // 1. Simpan ke session
      req.session.userId = user.id;
      req.session.role = user.role;

      // 2. PAKSA SIMPAN (Sangat Penting untuk fix 401)
      req.session.save((err) => {
        if (err) {
          console.error("Session Save Error:", err);
          return res.status(500).json({ message: "Gagal membuat sesi login" });
        }
        
        console.log(`👨‍🎓 [USER LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${user.email}`);
        res.json({
          message: 'Login Berhasil',
          user: { id: user.id, name: user.name, role: user.role }
        });
      });
    } else {
      res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ==========================================
// 3. LOGIN ADMIN (Sudah Aman)
// ==========================================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND LOWER(role) IN ('admin', 'superadmin')",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Akun Admin tidak ditemukan.' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      // 1. Simpan ke session
      req.session.adminId = admin.id;
      req.session.adminRole = admin.role;

      // 2. PAKSA SIMPAN
      req.session.save((err) => {
        if (err) {
          console.error("Session Save Error:", err);
          return res.status(500).json({ message: "Gagal membuat sesi login" });
        }
        
        console.log(`🛡️ [ADMIN LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${admin.email}`);
        res.json({
          message: 'Login Berhasil',
          admin: { id: admin.id, name: admin.name, role: admin.role }
        });
      });
    } else {
      res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ==========================================
// 4. CHECK AUTH (PENYEBAB ERROR 401 SEBELUMNYA)
// ==========================================
exports.checkAuth = async (req, res) => {
  try {
    // Cek apakah ada userId ATAU adminId di dalam cookie session
    if (req.session.userId) {
      const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.session.userId]);
      if(result.rows.length > 0) {
         return res.json({ user: result.rows[0] });
      }
    } 
    
    if (req.session.adminId) {
      const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.session.adminId]);
      if(result.rows.length > 0) {
         return res.json({ user: result.rows[0] });
      }
    }

    // Jika masuk ke sini, artinya tidak ada cookie atau cookie kedaluwarsa
    res.status(401).json({ message: 'Sesi tidak ditemukan atau kedaluwarsa.' });
  } catch (error) {
    console.error("Check Auth Error:", error);
    res.status(500).json({ message: 'Server error saat memeriksa sesi.' });
  }
};

// ==========================================
// 5. LOGOUT
// ==========================================
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: 'Gagal logout' });
    }
    // Tambahkan opsi path '/' agar cookie benar-benar terhapus di seluruh rute
    res.clearCookie('growpath_sid', { path: '/' }); 
    res.json({ message: 'Logout berhasil' });
  });
};