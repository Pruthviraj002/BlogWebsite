const User = require("../Model/user")
const Blog = require("../Model/blog")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");


const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SEC, { expiresIn: '15m' });
};

const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.SEC, { expiresIn: '7d' });
};

exports.getUser = async (req, res) => {
    try {
        const data = await User.find({ isBlocked: { $ne: true } }).select('-password -refreshToken');
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
        console.log("Diagnostic - Auth User ID:", req.user?._id?.toString());
        console.log("Diagnostic - Target ID:", req.params.id);

        if (req.user._id.toString() !== req.params.id.toString() && !req.user.isAdmin) {
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
        if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
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
        if (!UserExist) return res.status(401).json({ errors: true, message: "email or password is invalid" });

        if (UserExist.isBlocked) {
            return res.status(403).json({ errors: true, message: "Your account is blocked. Please contact support." });
        }

        const comparePassword = await bcrypt.compare(req.body.password, UserExist.password);
        if (!comparePassword) return res.status(401).json({ errors: true, message: "email or password is invalid" });

        if (!process.env.SEC) throw new Error("JWT Secret is undefined");

        const token = generateToken(UserExist._id);
        const refreshToken = generateRefreshToken(UserExist._id);

        // Save refresh token to user and set online status
        UserExist.refreshToken = refreshToken;
        UserExist.isOnline = true;
        UserExist.lastSeen = new Date();
        await UserExist.save();

        return res.json({
            errors: false,
            data: {
                user: {
                    _id: UserExist._id,
                    name: UserExist.name,
                    email: UserExist.email,
                    isAdmin: UserExist.isAdmin,
                    bio: UserExist.bio,
                    profilePic: UserExist.profilePic
                },
                token: token,
                refreshToken: refreshToken
            }
        });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ errors: true, message: "Refresh Token is required" });

    try {
        const payload = jwt.verify(refreshToken, process.env.SEC);
        const user = await User.findById(payload._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ errors: true, message: "Invalid Refresh Token" });
        }

        const newToken = generateToken(user._id);
        return res.json({ errors: false, token: newToken });
    } catch (error) {
        return res.status(403).json({ errors: true, message: "Invalid or Expired Refresh Token" });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ errors: true, message: "Unauthorized" });

        // User is already fetched by verifyToken, we just need to (optionally) populate
        let user = req.user;

        try {
            // Check if we need to re-fetch to ensure we have the most recent document for population
            // but use a very short timeout to avoid hanging
            user = await User.findById(user._id).populate('savedBlogs').maxTimeMS(2000);
        } catch (popError) {
            console.error("Population/Fetch Error:", popError.message);
            // If population fails, we already have the base user from middleware
            user = req.user;
        }

        if (!user) return res.status(404).json({ errors: true, message: "User session lost" });

        return res.json({ errors: false, data: user });
    } catch (error) {
        console.error("Critical Profile Error:", error.message);
        // ABSOLUTE FAILSAFE: return the basic user info from req.user if everything else fails
        if (req.user) {
            return res.json({ errors: false, data: req.user, warning: "Full profile could not be loaded" });
        }
        return res.status(500).json({ errors: true, message: "Fatal error: " + error.message });
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

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        if (user.isBlocked) return res.status(403).json({ errors: true, message: "This account is currently restricted." });
        return res.json({ errors: false, data: user });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

exports.ping = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { 
            lastSeen: new Date(),
            isOnline: true 
        });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { 
            isOnline: false,
            lastSeen: new Date(),
            refreshToken: ""
        });
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message });
    }
};
