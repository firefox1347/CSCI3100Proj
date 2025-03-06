import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProfile , updateProfile} from "../controllers/profile.controller.js";
const router = express.Router();

router.get("/:username", getProfile);
router.put("/:username/edit", updateProfile);
export default router;
