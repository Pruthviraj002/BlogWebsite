const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ errors: true, message: "Access Denied. No token provided." });
        }

        const verified = jwt.verify(token, process.env.SEC);
        
        // Check for both 'id' and '_id' for compatibility across apps
        const userId = verified.id || verified._id;
        
        if (!userId) {
            console.error("Auth Failure: Token payload missing ID", verified);
            return res.status(400).json({ errors: true, message: "Invalid Token: Missing ID" });
        }

        const user = await User.findById(userId);

        if (!user || !user.isAdmin) {
            console.warn(`Auth Forbidden: User ${userId} is not an admin`);
            return res.status(403).json({ errors: true, message: "Access Forbidden. Admins only." });
        }

        if (user.isBlocked) {
            console.warn(`Auth Blocked: Admin user ${userId} is currently blocked`);
            return res.status(403).json({ errors: true, message: "Your account is blocked." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        const status = error.name === 'TokenExpiredError' ? 401 : 400;
        const message = error.name === 'TokenExpiredError' ? "Session Expired. Please login again." : "Invalid Token: Sign-in required.";
        res.status(status).json({ errors: true, message });
    }
};

module.exports = adminAuth;
