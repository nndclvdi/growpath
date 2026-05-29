// backend/controllers/adminController.js
const AdminModel = require('../models/adminModel');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await AdminModel.getTotalUsers();
    const activeAssessments = await AdminModel.getTotalAssessments();
    
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
      stats: { totalUsers, activeAssessments, matches: 8439, progress: 92 },
      recentActivities: recentActivity,
      trendingPaths: trending
    });
  } catch (err) {
    console.error("Error Admin Dashboard:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};