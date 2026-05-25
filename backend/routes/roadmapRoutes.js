const express = require('express');

const router = express.Router();

const roadmapController =
  require('../controllers/roadmapController');

router.get('/', roadmapController.getRoadmaps);
router.post('/progress', roadmapController.toggleProgress);

module.exports = router;