const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. PENGATURAN CORS
// Pastikan origin sesuai dengan port Vite Anda (default 5173)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

// 2. MIDDLEWARE DASAR
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. KONFIGURASI SESSION
app.use(session({
  name: 'growpath_sid', 
  secret: process.env.SESSION_SECRET || 'growpath-super-secret-key', 
  resave: false, // Disarankan false agar tidak membebani server
  saveUninitialized: false,
  cookie: {
    secure: false, // Set ke true jika sudah pakai HTTPS
    httpOnly: true, 
    sameSite: 'lax', 
    maxAge: 24 * 60 * 60 * 1000 // 24 Jam
  }
}));

// 4. ROUTES (Semua rute terhubung di sini)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Integrasi Admin

// Root route untuk cek status server
app.get('/', (req, res) => {
  res.json({ 
    status: 'Running',
    message: 'GrowPath API Service is Active',
    timestamp: new Date().toISOString()
  });
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🚨 BACKEND ERROR LOG:", err.stack);
  res.status(500).json({ 
    message: 'Terjadi kesalahan internal pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 6. JALANKAN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 GrowPath Backend Ready: http://localhost:${PORT}`);
  console.log(`📡 CORS Origin: http://localhost:5173`);
  console.log(`========================================`);
});