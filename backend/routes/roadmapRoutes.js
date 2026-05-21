const express = require('express');

const router = express.Router();

const roadmapController =
  require(
    '../controllers/roadmapController'
  );

router.get(
  '/',
  roadmapController.getRoadmaps
);

module.exports = router;