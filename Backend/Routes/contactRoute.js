const express = require('express');
const router = express.Router();

const Message = require('../Model/message');
const { validateContact } = require('../middleware/validator');

// @route   POST api/contact
// @desc    Receive contact form messages
// @access  Public
router.post('/', validateContact, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ errors: true, message: "Please provide name, email and message" });
        }

        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        res.status(200).json({ 
            errors: false, 
            message: "Your narrative has been sent successfully! We'll be in touch soon." 
        });
    } catch (error) {
        res.status(500).json({ errors: true, message: "Server error, please try again later." });
    }
});

module.exports = router;
