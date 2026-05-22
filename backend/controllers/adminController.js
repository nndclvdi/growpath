const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Pengecekan sesi dinonaktifkan sementara untuk testing
    // if (!req.session.adminId) return res.status(403).json({ message: 'Unauthorized' });

    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const assessmentCount = await db.query('SELECT COUNT(*) FROM assessments');
    
    // Data dummy untuk melengkapi UI jika database belum penuh
    const recentActivity = [
      { name: 'Emma Stone', action: 'completed the "Tech Core" assessment', time: '2m ago' },
      { name: 'James Wilson', action: 'matched with "AI Product Manager"', time: '15m ago' }
    ];

    const trending = [
      { title: 'AI Product Manager', match: '98%' },
      { title: 'Data Storyteller', match: '94%' },
      { title: 'Cloud Architect', match: '89%' }
    ];

    res.json({
      stats: {
        totalUsers: parseInt(userCount.rows[0].count) || 0,
        activeAssessments: parseInt(assessmentCount.rows[0].count) || 0,
        matches: 8439,
        progress: 92
      },
      recentActivities: recentActivity,
      trendingPaths: trending
    });
  } catch (err) {
    console.error("Error Admin Dashboard:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};