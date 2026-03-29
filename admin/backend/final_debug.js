const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');

mongoose.connect(process.env.DB)
    .then(async () => {
        const users = await User.find({});
        console.log(`Total Users found: ${users.length}`);
        users.forEach(u => {
            console.log(`- ID: ${u._id} | Name: [${u.name}] | Email: [${u.email}] | Admin: ${u.isAdmin}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
