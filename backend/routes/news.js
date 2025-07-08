const express = require('express');
const { protect } = require('../middleware/auth');
const { getNews, searchNews } = require('../controllers/newsController');

const router = express.Router();

// Routes
router.get('/', protect, getNews);
router.get('/search', protect, searchNews);

module.exports = router; 