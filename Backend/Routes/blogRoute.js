const express = require('express');
const router = express.Router();
const blogController = require('../Controller/blogController');

const { verifyToken } = require('../middleware/authMiddleware');

const { validateBlog } = require('../middleware/validator');

router.get('/categories', blogController.getCategories);

router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', verifyToken, validateBlog, blogController.createBlog);
router.put('/:id', verifyToken, validateBlog, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);

// Interactions
router.post('/:id/like', verifyToken, blogController.likeBlog);
router.get('/:id/comments', blogController.getComments);
router.post('/:id/comments', verifyToken, blogController.addComment);

module.exports = router;
