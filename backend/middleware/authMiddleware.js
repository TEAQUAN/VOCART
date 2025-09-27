const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user")
dotenv.config();
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        // Fetch full user details
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        console.log("✅ Authenticated user:", req.user);

        next();
    } catch (error) {
        console.error("❌ Auth Error:", error);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
