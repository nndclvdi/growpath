const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db'); 

// ==========================================
// 1. ENDPOINT REGISTRASI (/register)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }

    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// ==========================================
// 2. ENDPOINT KHUSUS USER BIASA (/login-user)
// ==========================================
router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email tidak terdaftar.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah.' });
    }

    // PELINDUNG ROLE KOSONG: Jika null, anggap sebagai 'user'
    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    // PROTEKSI: Jika dia Admin, tolak dan suruh ke halaman login admin
    if (safeRole === 'admin' || safeRole === 'superadmin') {
      return res.status(403).json({ 
        message: 'Akun ini adalah akun Admin. Silakan login melalui portal Admin Panel.' 
      });
    }

    // Set Session khusus User (Tambahkan NAME agar Frontend tidak error)
    req.session.userId = user.id; 
    req.session.userRole = safeRole;
    req.session.userEmail = user.email;
    req.session.userName = user.name; 

    console.log(`\n👨‍🎓 [USER LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${user.email}`);

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyimpan sesi.' });
      
      // Kirim objek user lengkap
      res.json({ 
        message: 'Login berhasil', 
        user: { id: user.id, name: user.name, email: user.email, role: safeRole }
      });
    });

  } catch (error) {
    console.error("Login User Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// ==========================================
// 3. ENDPOINT KHUSUS ADMIN (/login-admin)
// ==========================================
router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email tidak terdaftar.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah.' });
    }

    // PELINDUNG ROLE KOSONG
    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    // PROTEKSI: Jika dia User biasa, tolak masuk ke panel admin
    if (safeRole !== 'admin' && safeRole !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Akses Ditolak. Anda bukan Admin.' 
      });
    }

    // Set Session khusus Admin
    req.session.adminId = user.id;
    req.session.userRole = safeRole;
    req.session.userEmail = user.email;
    req.session.userName = user.name;

    console.log(`\n🛡️ [ADMIN LOGIN SUKSES] Session ID: ${req.sessionID} | Admin: ${user.email}`);

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyimpan sesi.' });
      res.json({ 
        message: 'Login Admin berhasil', 
        user: { id: user.id, name: user.name, email: user.email, role: safeRole }
      });
    });

  } catch (error) {
    console.error("Login Admin Error:", error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// ==========================================
// 4. ENDPOINT LOGOUT (ANTI-BUG)
// ==========================================
router.post('/logout', (req, res) => {
  const sessionID = req.sessionID;
  req.session.destroy((err) => {
    if (err) {
      console.error("Gagal hancurkan sesi:", err);
      return res.status(500).json({ message: 'Logout gagal' });
    }
    
    // Hapus cookie dengan path yang benar agar browser benar-benar membuangnya
    res.clearCookie('growpath_sid', { path: '/' }); 
    
    console.log(`\n🚪 [LOGOUT BERHASIL] Session ${sessionID} telah dihapus.`);
    res.json({ message: 'Logout berhasil' });
  });
});

// ==========================================
// 5. ENDPOINT CEK STATUS AUTH (DIPERKUAT)
// ==========================================
router.get('/check-auth', async (req, res) => {
  try {
    const activeId = req.session.userId || req.session.adminId;

    if (!activeId) {
      return res.status(401).json({ authenticated: false, message: 'Tidak ada sesi aktif.' });
    }

    // Ambil data fresh dari database menggunakan ID yang ada di session
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', 
      [activeId]
    );

    // Proteksi: Jika akun dihapus di DB tapi cookie masih ada di browser
    if (result.rows.length === 0) {
      req.session.destroy();
      res.clearCookie('growpath_sid', { path: '/' });
      return res.status(401).json({ authenticated: false, message: 'Akun tidak ditemukan.' });
    }

    // Kembalikan objek "user" dengan format yang diharapkan oleh frontend
    res.json({ 
      authenticated: true, 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error("Check Auth Error:", error.message);
    res.status(500).json({ authenticated: false, message: 'Server error saat verifikasi sesi.' });
  }
});

module.exports = router;