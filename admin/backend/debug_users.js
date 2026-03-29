const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

mongoose.connect(process.env.DB)
    .then(async () => {
        const users = await User.find({}, 'name email isAdmin');
        console.log("Registered Users:");
        users.forEach(u => console.log(`- ${u.name} | [${u.email}] | Admin: ${u.isAdmin}`));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
