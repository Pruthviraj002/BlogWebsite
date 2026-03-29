const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user');

const resetPassword = async (email, newPassword) => {
    try {
        await mongoose.connect(process.env.DB);
        
        const salt = await bcrypt.genSalt(10);
        const hashedP = await bcrypt.hash(newPassword, salt);
        
        const user = await User.findOneAndUpdate(
            { email: email },
            { password: hashedP },
            { new: true }
        );
        
        if (user) {
            console.log(`Successfully reset password for: ${email}`);
            console.log(`New password: ${newPassword}`);
        } else {
            console.log(`User ${email} not found.`);
        }
        
        process.exit();
    } catch (err) {
        console.error("Error resetting password:", err.message);
        process.exit(1);
    }
};

resetPassword('pruthvi@gmail.com', 'admin123');
