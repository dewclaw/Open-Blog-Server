const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../../middleware/auth');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getme);
router.get('/me/posts', authMiddleware, authController.getMyPosts);

module.exports = router; 
