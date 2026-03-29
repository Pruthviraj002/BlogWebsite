const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const adminAuth = require('../middleware/auth');

router.post('/login', controller.login);

router.use(adminAuth);

router.get('/stats', controller.getStats);
router.get('/users', controller.getAllUsers);
router.get('/users/:id', controller.getUserDetails);
router.patch('/users/block/:id', controller.toggleBlockUser);
router.delete('/users/:id', controller.deleteUser);

router.get('/blogs', controller.getAllBlogs);
router.get('/blogs/:id', controller.getBlogById);
router.delete('/blogs/:id', controller.deleteBlog);

router.get('/categories', controller.getCategories);
router.post('/categories', controller.createCategory);
router.delete('/categories/:id', controller.deleteCategory);

router.get('/messages', controller.getAllMessages);
router.delete('/messages/:id', controller.deleteMessage);

router.get('/settings', controller.getSettings);
router.patch('/settings', controller.updateSettings);
router.get('/diagnostics', controller.runDiagnostics);

module.exports = router;
