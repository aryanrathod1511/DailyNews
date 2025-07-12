const express = require('express');
const { NewsController } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const newsController = new NewsController();

// Routes
router.get('/', protect, newsController.getNews);
router.get('/search', protect, newsController.searchNews);

module.exports = router; 