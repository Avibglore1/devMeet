import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllFeeds, requestConnection, reviewConnection } from "../controller/connection.controller.js";

const router = express.Router();

router.get("/sendRequest/:status/:toUserId", authMiddleware, requestConnection);
router.get("/reviewConnection/:status/:fromUserId", authMiddleware, reviewConnection)
router.get("/feeds", authMiddleware, getAllFeeds);

export default router;
