const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const axios = require('axios'); // <-- TAMBAHAN UNTUK GOOGLE OAUTH
const db = require('../config/db'); 

// 1. ENDPOINT REGISTRASI (/register)
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

// 2. ENDPOINT KHUSUS USER BIASA (/login-user)
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

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    if (safeRole === 'admin' || safeRole === 'superadmin') {
      return res.status(403).json({ 
        message: 'Akun ini adalah akun Admin. Silakan login melalui portal Admin Panel.' 
      });
    }

    req.session.userId = user.id; 
    req.session.userRole = safeRole;
    req.session.userEmail = user.email;
    req.session.userName = user.name; 

    console.log(`\n👨‍🎓 [USER LOGIN SUKSES] Session ID: ${req.sessionID} | Email: ${user.email}`);

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyimpan sesi.' });
      
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
// ENDPOINT BARU: GOOGLE AUTH (/google)
// ==========================================
router.post('/google', async (req, res) => {
  const { access_token } = req.body;

  try {
    // 1. Minta data profil user dari Google
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const { email, name } = googleResponse.data;

    // 2. Cek apakah user sudah ada di database kita
    let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    // 3. Jika belum ada (Artinya dia Register via Google)
    if (!user) {
      // Buat password acak karena login google tidak pakai password
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);
      
      const insertResult = await db.query(
        "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
        [name, email, randomPassword]
      );
      user = insertResult.rows[0];
    }

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    // 4. Buat sesi (Session Cookie) persis seperti login manual
    if (safeRole === 'admin' || safeRole === 'superadmin') {
      req.session.adminId = user.id;
    } else {
      req.session.userId = user.id; 
    }
    
    req.session.userRole = safeRole;
    req.session.userEmail = user.email;
    req.session.userName = user.name; 

    console.log(`\n🌍 [GOOGLE AUTH SUKSES] Session ID: ${req.sessionID} | Email: ${user.email}`);

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyimpan sesi.' });
      
      res.json({ 
        message: 'Login Google berhasil', 
        user: { id: user.id, name: user.name, email: user.email, role: safeRole }
      });
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
});

// 3. ENDPOINT KHUSUS ADMIN (/login-admin)
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

    const safeRole = user.role ? user.role.toLowerCase() : 'user';

    if (safeRole !== 'admin' && safeRole !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Akses Ditolak. Anda bukan Admin.' 
      });
    }

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

// 4. ENDPOINT LOGOUT (ANTI-BUG)
router.post('/logout', (req, res) => {
  const sessionID = req.sessionID;
  req.session.destroy((err) => {
    if (err) {
      console.error("Gagal hancurkan sesi:", err);
      return res.status(500).json({ message: 'Logout gagal' });
    }
    
    res.clearCookie('growpath_sid', { path: '/' }); 
    
    console.log(`\n🚪 [LOGOUT BERHASIL] Session ${sessionID} telah dihapus.`);
    res.json({ message: 'Logout berhasil' });
  });
});

// 5. ENDPOINT CEK STATUS AUTH (DIPERKUAT)
router.get('/check-auth', async (req, res) => {
  try {
    const activeId = req.session.userId || req.session.adminId;

    if (!activeId) {
      return res.status(200).json({ 
        authenticated: false, 
        user: null, 
        message: 'Tidak ada sesi aktif.' 
      });
    }

    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', 
      [activeId]
    );

    if (result.rows.length === 0) {
      req.session.destroy();
      res.clearCookie('growpath_sid', { path: '/' });
      return res.status(200).json({ 
        authenticated: false, 
        user: null, 
        message: 'Akun tidak ditemukan.' 
      });
    }

    res.status(200).json({ 
      authenticated: true, 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error("Check Auth Error:", error.message);
    res.status(500).json({ authenticated: false, message: 'Server error saat verifikasi sesi.' });
  }
});

// ==========================================
// 6. ENDPOINT FORGOT PASSWORD (Kirim Email)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Email tidak terdaftar di sistem kami." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 3600000; // 1 Jam

    await db.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetToken, tokenExpiry, email]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password Akun GrowPath',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Reset Password</h2>
          <p>Halo,</p>
          <p>Kami menerima permintaan untuk mereset password akun GrowPath Anda. Silakan klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Buat Password Baru</a>
          <p>Link ini hanya berlaku selama <strong>1 jam</strong>.</p>
          <p>Jika Anda tidak merasa meminta reset password, abaikan saja email ini. Akun Anda tetap aman.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`\n📧 [EMAIL TERKIRIM] Link reset password dikirim ke: ${email}`);
    res.status(200).json({ message: 'Email reset password telah dikirim!' });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// ==========================================
// 7. ENDPOINT RESET PASSWORD (Simpan Sandi)
// ==========================================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const userResult = await db.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, Date.now()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }

    const userEmail = userResult.rows[0].email;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2',
      [hashedPassword, userEmail]
    );

    console.log(`\n🔑 [PASSWORD DIUBAH] User ${userEmail} berhasil mereset password.`);
    res.status(200).json({ message: 'Password berhasil diperbarui!' });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;