const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("auth-token");
        if (!token) return res.status(401).json({ errors: true, message: "Access Denied" });

        const verified = jwt.verify(token, process.env.SEC);
        const user = await User.findById(verified._id);

        if (!user) return res.status(404).json({ errors: true, message: "User not found" });
        if (user.isBlocked) return res.status(403).json({ errors: true, message: "Your account is blocked" });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ errors: true, message: "Invalid or Expired Token" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ errors: true, message: "Access Denied: Admins Only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
};

module.exports = { verifyToken, isAdmin };
