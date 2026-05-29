// backend/controllers/roadmapController.js
const RoadmapModel = require('../models/roadmapModel');

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapModel.getAllRoadmaps();
    res.json(roadmaps);
  } catch (error) {
    console.error("Error getRoadmaps:", error);
    res.status(500).json({ message: 'Failed to get roadmaps' });
  }
};

exports.toggleProgress = async (req, res) => {
  try {
    const { userId, phaseId, taskId } = req.body;
    const currentUserId = req.session?.userId || userId;
    if (!currentUserId) return res.status(401).json({ message: 'Silakan login terlebih dahulu.' });

    const result = await RoadmapModel.toggleRoadmapProgress(currentUserId, phaseId, taskId);
    
    if (result.status === 'removed') {
      return res.json({ message: 'Task berhasil di-uncheck dan jam belajar dikurangi', status: 'removed' });
    } else {
      return res.json({ message: 'Task berhasil di-check dan jam belajar ditambahkan', status: 'added' });
    }
  } catch (error) {
    console.error("Error toggle roadmap progress:", error);
    res.status(500).json({ message: 'Gagal menyimpan progress roadmap' });
  }
};