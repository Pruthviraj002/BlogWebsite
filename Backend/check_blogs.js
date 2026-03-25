const mongoose = require('mongoose');
require('dotenv').config();

const Blog = mongoose.model('Blog', new mongoose.Schema({
    title: String,
    status: String
}));

async function checkBlogs() {
    try {
        await mongoose.connect(process.env.DB);
        const count = await Blog.countDocuments();
        const statuses = await Blog.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        console.log(`Total Blogs: ${count}`);
        console.log("Statuses:", JSON.stringify(statuses, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkBlogs();
