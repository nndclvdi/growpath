const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const axios = require('axios'); // <-- PASTIKAN ANDA SUDAH MENGINSTAL AXIOS (npm install axios)

// 1. REGISTER USER (Tidak berubah)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Semua kolom wajib diisi.' });

    const userExists = await UserModel.findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'Email sudah terdaftar.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.createUser(name, email, hashedPassword);

    return res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. LOGIN USER BIASA (Tidak berubah)
exports.login = async (req, res) => {
  try {
    if (!req.session) return res.status(500).json({ message: 'Konfigurasi session bermasalah.' });

    const { email, password } = req.body;
    const user = await UserModel.findUserByEmailAndRoleCondition(email, false);

    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan.' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: "Gagal membuat sesi login" });
        return res.json({ message: 'Login Berhasil', user: { id: user.id, name: user.name, role: user.role } });
      });
    } else {
      return res.status(401).json({ message: 'Password salah.' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ==========================================
// FUNGSI BARU: GOOGLE AUTH (LOGIN & REGISTER)
// ==========================================
exports.googleLogin = async (req, res) => {
  const { access_token } = req.body;

  try {
    // 1. Verifikasi token ke Google
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const { email, name } = googleResponse.data;

    // 2. Cek apakah user sudah terdaftar
    let user = await UserModel.findUserByEmail(email);

    // 3. Jika belum terdaftar, buat akun baru
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      user = await UserModel.createUser(name, email, randomPassword);
    }

    // 4. Buat sesi (Session Cookie) persis seperti login biasa
    req.session.userId = user.id;
    req.session.role = user.role;

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: "Gagal membuat sesi login" });
      
      console.log(`🌍 [GOOGLE AUTH SUKSES] Email: ${user.email}`);
      return res.json({
        message: 'Login Google berhasil',
        user: { id: user.id, name: user.name, role: user.role }
      });
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
};

// 3. LOGIN ADMIN (Tidak berubah)
exports.loginAdmin = async (req, res) => {
  // ... (Sama seperti kode Anda)
};

// 4. CHECK AUTH (Tidak berubah)
exports.checkAuth = async (req, res) => {
  // ... (Sama seperti kode Anda)
};

// 5. LOGOUT (Tidak berubah)
exports.logout = (req, res) => {
  res.clearCookie('growpath_sid', { path: '/' }); 
  if (!req.session) return res.json({ message: 'Logout berhasil (sesi sudah kosong)' });
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Gagal membersihkan sesi di server' });
    return res.json({ message: 'Logout berhasil' });
  });
};