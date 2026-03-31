const Blog = require("../Model/blog");
const User = require("../Model/user");
const Comment = require("../Model/comment");
const Category = require("../Model/category");
const Message = require("../Model/message");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── Admin Login (Public Route) ───────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.trim() });

        if (!user) {
            return res.status(404).json({ success: false, message: "Admin user not found" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access forbidden. Not an admin." });
        }

        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: "This account has been blocked." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SEC, { expiresIn: '24h' });
        res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Analytics / Stats ────────────────────────────────────────────────────────
exports.getAnalytics = async (req, res) => {
    try {
        const totalPosts = await Blog.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalComments = await Comment.countDocuments();
        const totalCategories = await Category.countDocuments();

        const blogs = await Blog.find();
        const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
        const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes ? blog.likes.length : 0), 0);

        res.json({
            errors: false,
            data: { totalPosts, totalUsers, totalComments, totalViews, totalLikes, totalCategories }
        });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

// ─── Users ────────────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
        res.json({ errors: false, data: users });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        const blogs = await Blog.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json({ errors: false, data: { user, blogs } });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        await Blog.deleteMany({ userId: req.params.id });
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
        res.json({ errors: false, data: user, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

// ─── Blogs ────────────────────────────────────────────────────────────────────
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ errors: false, data: blogs });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('userId', 'name email profilePic');
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        await Comment.deleteMany({ blogId: req.params.id });
        res.json({ errors: false, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

// ─── Comments ─────────────────────────────────────────────────────────────────
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

// ─── Categories ───────────────────────────────────────────────────────────────
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

// ─── Messages ─────────────────────────────────────────────────────────────────
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

// ─── Settings ─────────────────────────────────────────────────────────────────
let _settings = { maintenanceMode: false, siteName: "LuminaBlog", allowRegistrations: true };

exports.getSettings = async (req, res) => {
    try {
        // Try to use the SystemConfig model if it exists
        try {
            const SystemConfig = require('../Model/systemConfig');
            let config = await SystemConfig.findOne();
            if (!config) config = await SystemConfig.create({});
            return res.json({ success: true, data: config });
        } catch (_) {
            // If model doesn't exist, return in-memory settings
            return res.json({ success: true, data: _settings });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        try {
            const SystemConfig = require('../Model/systemConfig');
            let config = await SystemConfig.findOne();
            if (!config) {
                config = new SystemConfig(req.body);
            } else {
                Object.assign(config, req.body);
            }
            await config.save();
            return res.json({ success: true, data: config, message: "Settings updated successfully" });
        } catch (_) {
            Object.assign(_settings, req.body);
            return res.json({ success: true, data: _settings, message: "Settings updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
