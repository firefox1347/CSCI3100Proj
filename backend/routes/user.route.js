import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserByName } from "../controllers/user.controller.js";
import { get } from "mongoose";
const router = express.Router();

router.get("/:username", protectRoute, getUserByName);

export default router;
