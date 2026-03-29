const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    image: String,
    category: { type: String, default: 'General' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
    tags: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
