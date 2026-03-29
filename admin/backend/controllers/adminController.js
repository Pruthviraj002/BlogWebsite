const mongoose = require('mongoose');
const User = require('../models/user');
const Blog = require('../models/blog');
const Category = require('../models/category');
const Comment = require('../models/comment');
const Message = require('../models/message');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Admin user not found" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access forbidden. Not an admin." });
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

const getStats = async (req, res) => {
    try {
        const [totalUsers, totalBlogs, totalComments, totalCategories] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Comment.countDocuments(),
            Category.countDocuments()
        ]);
        const blogs = await Blog.find({}, 'likes views');
        const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
        const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        res.json({ errors: false, data: { totalUsers, totalBlogs, totalComments, totalCategories, totalLikes, totalViews } });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ errors: false, data: users });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const toggleBlockUser = async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ errors: true, message: "You cannot block/unblock your own account." });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ errors: false, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ errors: true, message: "You cannot delete your own account." });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        await Blog.deleteMany({ userId: req.params.id });
        res.json({ errors: false, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ errors: false, data: blogs });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        await Comment.deleteMany({ blogId: req.params.id });
        res.json({ errors: false, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ errors: false, data: categories });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, color, icon } = req.body;
        const newCategory = new Category({ name, color, icon });
        await newCategory.save();
        res.json({ errors: false, data: newCategory });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ errors: false, data: messages });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const Settings = require('../models/settings');

const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        settings.updatedBy = req.user.id;
        await settings.save();
        res.json({ success: true, data: settings, message: "Settings updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const runDiagnostics = async (req, res) => {
    try {
        const results = {
            database: mongoose.connection.readyState === 1 ? "Healthy" : "Problematic",
            serverTime: new Date().toISOString(),
            uptime: process.uptime(),
            env: {
                cloudinary: !!process.env.CLOUDINARY_API_KEY,
                dbUri: !!process.env.DB,
                secret: !!process.env.SEC
            }
        };
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });

        const blogs = await Blog.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json({ errors: false, data: { user, blogs } });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('userId', 'name email profilePic');
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

module.exports = {
    login,
    getStats,
    getAllUsers,
    getUserDetails,
    toggleBlockUser,
    deleteUser,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    getCategories,
    createCategory,
    deleteCategory,
    getAllMessages,
    deleteMessage,
    getSettings,
    updateSettings,
    runDiagnostics
};
