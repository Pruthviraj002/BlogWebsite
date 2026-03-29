const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: true, message: errors.array()[0].msg });
    }
    next();
};

const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateBlog = [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('content').trim().notEmpty().withMessage('Content is required')
        .isLength({ min: 20 }).withMessage('Content is too short (min 20 characters)'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    handleValidationErrors
];

const validateContact = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message cannot be empty')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    handleValidationErrors
];

const validateComment = [
    body('text').trim().notEmpty().withMessage('Comment text is required')
        .isLength({ max: 500 }).withMessage('Comment is too long'),
    handleValidationErrors
];

module.exports = { validateRegistration, validateLogin, validateBlog, validateComment, validateContact };
