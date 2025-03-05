import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";
const router = express.Router();

router.get("/:username", getProfile);
export default router;
