const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const { validateRegistration, validateLogin } = require('../middleware/validator');

// User CRUD
router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/', validateRegistration, userController.postUser);
router.put('/:id', verifyToken, userController.putUser);
router.delete('/:id', verifyToken, userController.deleteUser);

// Auth
router.post('/login', validateLogin, userController.login);
router.post('/refresh', userController.refreshToken);
router.get('/me', verifyToken, userController.getMyProfile);
router.put('/save/:blogId', verifyToken, userController.toggleSaveBlog);

router.post('/logout', verifyToken, userController.logout);
router.post('/ping', verifyToken, userController.ping);

module.exports = router;
