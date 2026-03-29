const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const Settings = require("../Model/settings");

const maintenanceMiddleware = async (req, res, next) => {
    try {
        const settings = await Settings.findOne();
        
        // If maintenance mode is OFF, just proceed
        if (!settings || !settings.maintenanceMode) {
            return next();
        }

        // If maintenance mode is ON, check if user is admin
        const token = req.header("auth-token");
        if (token) {
            try {
                const verified = jwt.verify(token, process.env.SEC);
                const user = await User.findById(verified._id);
                
                // Admins are exempt from maintenance mode
                if (user && user.isAdmin) {
                    return next();
                }
            } catch (error) {
                // Token verification failed, fallback to maintenance block
            }
        }

        // Block all non-admin requests
        res.status(503).json({
            errors: true,
            message: "System Maintenance: CodeStories is temporarily offline for upgrades. Please check back later.",
            maintenanceStatus: true
        });

    } catch (error) {
        console.error("Maintenance Middleware Error:", error);
        next(); // Proceed to avoid breaking the site in case of DB failure
    }
};

module.exports = maintenanceMiddleware;
