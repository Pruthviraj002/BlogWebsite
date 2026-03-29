const Blog = require("../Model/blog");
const User = require("../Model/user");
const Comment = require("../Model/comment");
const Category = require("../Model/category");
const Message = require("../Model/message");

exports.getAnalytics = async (req, res) => {
    try {
        const totalPosts = await Blog.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalComments = await Comment.countDocuments();

        const blogs = await Blog.find();
        const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
        const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes ? blog.likes.length : 0), 0);

        res.json({
            errors: false,
            data: {
                totalPosts,
                totalUsers,
                totalComments,
                totalViews,
                totalLikes
            }
        });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ errors: false, data: users });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        if (user.isAdmin) return res.status(403).json({ errors: true, message: "Cannot block admin" });

        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ errors: false, data: user });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("user", "name").populate("blog", "title");
        res.json({ errors: false, data: comments });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesWithStats = await Promise.all(categories.map(async (cat) => {
            const count = await Blog.countDocuments({ category: cat.name });
            return { ...cat._doc, count };
        }));
        res.json({ errors: false, data: categoriesWithStats });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json({ errors: false, data: category });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort("-createdAt");
        res.json({ errors: false, data: messages });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};
