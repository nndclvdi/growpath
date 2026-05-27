const db = require('../config/db');
const bcrypt = require('bcrypt');


// 1. REGISTER USER
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

    return res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. LOGIN USER BIASA
exports.login = async (req, res) => {
  try {
    // Sabuk pengaman: pastikan middleware session berjalan di server.js/app.js
    if (!req.session) {
      return res.status(500).json({ message: 'Konfigurasi session server bermasalah.' });
    }

    const { email, password } = req.body;
    
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
      req.session.userId = user.id;
      req.session.role = user.role;

      req.session.save((err) => {
        if (err) {
          console.error("Session Save Error:", err);
          return res.status(500).json({ message: "Gagal membuat sesi login" });
        }
        
        console.log(`👨‍🎓 [USER LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${user.email}`);
        return res.json({
          message: 'Login Berhasil',
          user: { id: user.id, name: user.name, role: user.role }
        });
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


// 3. LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(500).json({ message: 'Konfigurasi session server bermasalah.' });
    }

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
      req.session.adminId = admin.id;
      req.session.adminRole = admin.role;

      req.session.save((err) => {
        if (err) {
          console.error("Session Save Error:", err);
          return res.status(500).json({ message: "Gagal membuat sesi login" });
        }
        
        console.log(`🛡️ [ADMIN LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${admin.email}`);
        return res.json({
          message: 'Login Berhasil',
          admin: { id: admin.id, name: admin.name, role: admin.role }
        });
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Admin Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


// 4. CHECK AUTH 
exports.checkAuth = async (req, res) => {
  try {
    // Sabuk pengaman: jika session tidak ada sama sekali
    if (!req.session) {
      return res.status(200).json({ 
        isAuthenticated: false,
        user: null,
        message: 'Tidak ada sesi aktif.' 
      });
    }

    // Cek apakah ada userId ATAU adminId di dalam cookie session
    if (req.session.userId) {
      const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.session.userId]);
      if(result.rows.length > 0) {
         return res.json({ isAuthenticated: true, user: result.rows[0] });
      }
    } 
    
    if (req.session.adminId) {
      const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.session.adminId]);
      if(result.rows.length > 0) {
         return res.json({ isAuthenticated: true, user: result.rows[0] });
      }
    }

    // Jika masuk ke sini, artinya tidak ada cookie atau cookie kedaluwarsa
    return res.status(200).json({ 
      isAuthenticated: false,
      user: null,
      message: 'Sesi tidak ditemukan atau kedaluwarsa.' 
    });
  } catch (error) {
    console.error("Check Auth Error:", error);
    return res.status(500).json({ message: 'Server error saat memeriksa sesi.' });
  }
};

// 5. LOGOUT
exports.logout = (req, res) => {
  // Hapus cookie secara paksa terlebih dahulu untuk keamanan
  res.clearCookie('growpath_sid', { path: '/' }); 

  // Jika req.session tidak ada, langsung kembalikan sukses (jangan panggil destroy agar tidak crash)
  if (!req.session) {
    return res.json({ message: 'Logout berhasil (sesi sudah kosong)' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      // Meskipun gagal destroy di server, cookie di browser sudah kita hapus di atas
      return res.status(500).json({ message: 'Gagal membersihkan sesi di server' });
    }
    return res.json({ message: 'Logout berhasil' });
  });
};