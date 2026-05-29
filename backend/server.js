const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. PENGATURAN CORS
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware manual untuk menangani Preflight Request (OPTIONS)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
});

//TAMBAHAN BARU: Header Keamanan untuk mengizinkan popup Google OAuth di backend
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// 2. MIDDLEWARE DASAR
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. KONFIGURASI SESSION
app.use(session({
  name: 'growpath_sid', 
  secret: process.env.SESSION_SECRET || 'growpath-super-secret-key', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false, // Set ke true jika sudah pakai HTTPS
    httpOnly: true, 
    sameSite: 'lax', 
    maxAge: 24 * 60 * 60 * 1000 // 24 Jam
  }
}));

// 4. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
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