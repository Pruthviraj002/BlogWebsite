const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

const check = async () => {
    try {
        await mongoose.connect(process.env.DB);
        
        const user = await User.findOne({ email: 'pruthvi@gmail.com' });
        if (user) {
            console.log("Found User:");
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log("No user found with email pruthvi@gmail.com");
            const all = await User.find({}, 'email');
            console.log("Existing emails:", all.map(a => a.email));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
