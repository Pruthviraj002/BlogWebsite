const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const { validateRegistration } = require('../middleware/validator');

// User CRUD
router.get('/', userController.getUser);
router.post('/', validateRegistration, userController.postUser);
router.put('/:id', verifyToken, userController.putUser);
router.delete('/:id', verifyToken, userController.deleteUser);

// Auth
router.post('/login', userController.login);
router.get('/me', verifyToken, userController.getMyProfile);
router.put('/save/:blogId', verifyToken, userController.toggleSaveBlog);

module.exports = router;
