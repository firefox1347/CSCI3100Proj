import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserByName,
  getFollowStatus,
  followUser,
  unfollowUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:username", protectRoute, getUserByName);
router.get("/:target/followstatus", protectRoute, getFollowStatus);
router.post("/follow/:targetId", protectRoute, followUser);
router.post("/unfollow/:targetId", protectRoute, unfollowUser);

export default router;
