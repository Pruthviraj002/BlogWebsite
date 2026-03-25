const mongoose = require('mongoose');
require('dotenv').config();

const Blog = mongoose.model('Blog', new mongoose.Schema({
    status: String
}));

async function updateBlogs() {
    try {
        await mongoose.connect(process.env.DB);
        const result = await Blog.updateMany({ status: null }, { $set: { status: 'Published' } });
        console.log(`Updated ${result.modifiedCount} blogs to 'Published' status.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateBlogs();
