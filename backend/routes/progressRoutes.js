const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Kita akan menggunakan rute ini agar seragam dengan AppContext
router.get('/user/:userId', progressController.getUserProgress);

module.exports = router;