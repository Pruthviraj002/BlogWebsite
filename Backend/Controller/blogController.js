const Blog = require("../Model/blog");
const Comment = require("../Model/comment");
const Category = require("../Model/category");

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ errors: false, data: categories });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } }
            ];
        }
        if (category && category !== "All") {
            query.category = category;
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
        const comments = await Comment.find({ blog: req.params.id }).populate("user", "name").sort("-createdAt");
        res.json({ errors: false, data: comments });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('userId', 'name email');
        if (!blog) return res.status(404).json({ errors: true, message: "Blog not found" });
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const blogData = {
            ...req.body,
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
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ errors: false, data: blog });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ errors: false, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};
