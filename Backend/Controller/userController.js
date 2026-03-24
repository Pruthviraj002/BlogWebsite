const User = require("../Model/user")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res) => {
    try {
        const data = await User.find()
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

exports.postUser = async (req, res) => {
    try {
        const uSerExits = await User.findOne({ email: req.body.email })
        if (uSerExits) return res.status(500).json({ errors: true, message: "user Already Exist" })

        const salt = await bcrypt.genSalt(10)

        req.body.password = await bcrypt.hash(req.body.password, salt)


        const data = await User.create(req.body)
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

exports.putUser = async (req, res) => {
    try {
        if (req.user._id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ errors: true, message: "You can only update your own account" });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ errors: false, data: data });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        if (req.user._id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ errors: true, message: "You can only delete your own account" });
        }
        const data = await User.findByIdAndDelete(req.params.id);
        return res.json({ errors: false, data: data });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
}
exports.login = async (req, res) => {
    try {
        const UserExist = await User.findOne({ email: req.body.email });
        if (!UserExist) return res.status(500).json({ errors: true, message: "email or password is invalid" });

        const comparePassword = await bcrypt.compare(req.body.password, UserExist.password);
        if (!comparePassword) return res.status(500).json({ errors: true, message: "email or password is invalid" });

        // Debug logs to check for undefined values
        console.log("JWT Secret:", process.env.SEC);
        console.log("User ID:", UserExist._id);

        if (!process.env.SEC) throw new Error("JWT Secret is undefined");
        if (!UserExist._id) throw new Error("User ID is undefined");

        const token = await jwt.sign({ _id: UserExist._id }, process.env.SEC);
        return res.json({ errors: false, data: { user: UserExist, token: token } });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedBlogs');
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        return res.json({ errors: false, data: user });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

exports.toggleSaveBlog = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });

        const blogId = req.params.blogId;
        const index = user.savedBlogs.indexOf(blogId);

        if (index === -1) {
            user.savedBlogs.push(blogId);
        } else {
            user.savedBlogs.splice(index, 1);
        }

        await user.save();
        // Return updated user without password
        const updatedUser = await User.findById(req.user._id).populate('savedBlogs').select('-password');

        return res.json({ errors: false, data: updatedUser });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};
