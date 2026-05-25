const express = require('express');
const router = express.Router();

// Import controller yang sudah kita buat sebelumnya
const progressController = require('../controllers/progressController');

// Definisikan method GET dengan parameter userId
// Karena nanti di server.js kita akan pasang prefix '/api/progress', 
// maka di sini kita cukup menuliskan '/:userId'
router.get('/:userId', progressController.getUserProgress);

module.exports = router;