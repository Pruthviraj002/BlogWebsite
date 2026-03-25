const mongoose = require("mongoose");
const Blog = require("../Model/blog");
const Comment = require("../Model/comment");
const Category = require("../Model/category");

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log(`[Backend] Found ${categories.length} categories in DB`);
        res.json({ errors: false, data: categories });
    } catch (error) {
        console.error("[Backend] getCategories Error:", error.message);
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const { search, category, status, authorId } = req.query;
        let query = {};

        // Regular users should only see published blogs by default
        if (status) {
            query.status = status;
        } else {
            query.status = 'Published';
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } }
            ];
        }
        if (category && category !== "All") {
            query.category = category;
        }

        if (authorId) {
            if (mongoose.Types.ObjectId.isValid(authorId)) {
                query.userId = authorId;
                // When fetching specific author's blogs, show all statuses (Draft/Published)
                delete query.status; 
            } else {
                // If invalid ID provided, return empty results instead of crashing
                return res.json({
                    errors: false,
                    data: [],
                    pagination: { currentPage: 1, totalPages: 0, totalBlogs: 0, hasNextPage: false }
                });
            }
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const totalBlogs = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        const blogs = await Blog.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "blog",
                    as: "comments"
                }
            },
            {
                $addFields: {
                    commentCount: { $size: "$comments" },
                    userId: { _id: "$user._id", name: "$user.name", email: "$user.email" }
                }
            },
            { $project: { comments: 0, user: 0 } }
        ]);

        res.json({
            errors: false,
            data: blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                hasNextPage: page < totalPages
            }
        });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });

        const index = blog.likes.indexOf(req.user._id);
        if (index === -1) {
            blog.likes.push(req.user._id);
        } else {
            blog.likes.splice(index, 1);
        }

        await blog.save();
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.create({
            text,
            user: req.user._id,
            blog: req.params.id
        });
        const populatedComment = await Comment.findById(comment._id).populate("user", "name");
        res.json({ errors: false, data: populatedComment });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        if (!require('mongoose').Types.ObjectId.isValid(id)) {
            return res.status(400).json({ errors: true, message: "Invalid Blog ID" });
        }
        const comments = await Comment.find({ blog: id })
            .populate("user", "name profilePic")
            .populate("replies.user", "name profilePic")
            .sort("-createdAt");
        res.json({ errors: false, data: comments });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.replyToComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ errors: true, message: "Comment not found" });

        comment.replies.push({
            text,
            user: req.user._id
        });

        await comment.save();
        const updatedComment = await Comment.findById(comment._id)
            .populate("user", "name profilePic")
            .populate("replies.user", "name profilePic");
        res.json({ errors: false, data: updatedComment });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!require('mongoose').Types.ObjectId.isValid(id)) {
            return res.status(400).json({ errors: true, message: "Invalid Blog ID" });
        }
        const blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('userId', 'name email');
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, image, category, status, tags } = req.body;
        const blogData = {
            title, content, excerpt, image, category, status, tags,
            userId: req.user._id
        };
        const blog = await Blog.create(blogData);
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });

        // Check ownership or admin status
        if (blog.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ errors: true, message: "Unauthorized to update this blog" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ errors: false, data: updatedBlog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });

        // Check ownership or admin status
        if (blog.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ errors: true, message: "Unauthorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};
