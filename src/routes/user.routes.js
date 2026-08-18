import express from "express";
import { getProfile, login, logout, signup, updateProfile } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout)
router.get("/profile", authMiddleware, getProfile);
router.patch("/updateProfile", authMiddleware, updateProfile)

export default router;