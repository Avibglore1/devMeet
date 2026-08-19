import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "Invalid token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(403).json({ message: "User do not exist" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}