const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user');

const fix = async () => {
    try {
        await mongoose.connect(process.env.DB);
        
        // Find the user with the malformed email
        const malformedEmail = 'email pruthvi@gmail.com';
        const salt = await bcrypt.genSalt(10);
        const hashedP = await bcrypt.hash('admin123', salt);

        const result = await User.findOneAndUpdate(
            { email: malformedEmail },
            { 
                email: 'pruthvi@gmail.com',
                password: hashedP,
                isAdmin: true
            },
            { new: true }
        );

        if (result) {
            console.log("Successfully fixed user record:");
            console.log(result.email);
        } else {
            console.log("Malformed record not found. Checking for pruthvi@gmail.com...");
            const exists = await User.findOne({ email: 'pruthvi@gmail.com' });
            if (exists) {
                exists.isAdmin = true;
                exists.password = hashedP;
                await exists.save();
                console.log("Updated existing pruthvi@gmail.com to admin.");
            } else {
                console.log("Creating NEW admin user.");
                await User.create({
                    name: "Pruthviraj",
                    email: 'pruthvi@gmail.com',
                    password: hashedP,
                    isAdmin: true
                });
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
