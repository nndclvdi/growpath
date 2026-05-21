const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==========================================
// 1. PENGATURAN CORS
// ==========================================
app.use(cors({
  origin: 'http://localhost:5173', // Alamat Frontend Vite kamu
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // WAJIB TRUE: Agar Cookie Session bisa dikirim/terima
}));

// ==========================================
// 2. MIDDLEWARE DASAR
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. KONFIGURASI SESSION (PURE SESSION)
// ==========================================
app.use(session({
  name: 'growpath_sid', 
  secret: process.env.SESSION_SECRET || 'growpath-super-secret-key', 
  resave: true, // Set ke true agar session tetap hidup saat ada aktivitas
  saveUninitialized: false,
  cookie: {
    secure: false, // Set false karena masih di localhost (HTTP)
    httpOnly: true, 
    sameSite: 'lax', 
    maxAge: 24 * 60 * 60 * 1000 // Berlaku 24 jam
  }
}));

// ==========================================
// 4. ROUTES
// ==========================================
// Rute yang sudah ada
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// TAMBAHKAN RUTE BERIKUT (Penyebab Error 404 sebelumnya)
// Pastikan file-file ini sudah ada di folder backend/routes/
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));

// Root route untuk cek status server
app.get('/', (req, res) => {
  res.json({ 
    status: 'Running',
    mode: 'Session-Based Authentication',
    auth_check: req.session.adminId ? 'Authenticated' : 'Guest'
  });
});

// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("🚨 BACKEND ERROR LOG:");
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Terjadi kesalahan internal pada server',
    error: err.message 
  });
});

// ==========================================
// 6. JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 GrowPath Backend: http://localhost:${PORT}`);
  console.log(`🔒 Mode: Pure Session (No Token)`);
  console.log(`📡 CORS Origin: http://localhost:5173`);
  console.log(`========================================`);
});