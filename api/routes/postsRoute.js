const express = require('express');
let router = express.Router();
const postController = require('../controllers/postsController');
const authMiddleware = require('../../middleware/auth');


router.get('/', authMiddleware, postController.getAll);
router.post('/newpost', authMiddleware, postController.newPost);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, postController.editPostById);
router.delete('/:id', authMiddleware, postController.deletePostById);
router.post(':id/newcomment',authMiddleware, postController.addComment);

module.exports = router;
