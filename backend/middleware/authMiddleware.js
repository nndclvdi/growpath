module.exports = (req, res, next) => {
  // DEBUG: Cek di terminal backend apakah session terbaca
  console.log("--- Pengecekan Session ---");
  console.log("Session ID:", req.sessionID);
  console.log("Data AdminId:", req.session.adminId);

  if (req.session && req.session.adminId) {
    // Jika ada adminId di session, izinkan lanjut
    next();
  } else {
    // Jika kosong, tolak akses
    res.status(401).json({ 
      message: 'Akses Ditolak: Sesi Anda telah berakhir atau Anda belum login sebagai Admin.' 
    });
  }
};