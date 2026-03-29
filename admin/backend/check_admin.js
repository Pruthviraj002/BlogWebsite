const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

mongoose.connect(process.env.DB)
    .then(async () => {
        const admins = await User.find({ isAdmin: true }, 'name email');
        if (admins.length > 0) {
            console.log("Found Admins:");
            admins.forEach(a => console.log(`- ${a.name} (${a.email})`));
        } else {
            console.log("No admins found in database.");
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
