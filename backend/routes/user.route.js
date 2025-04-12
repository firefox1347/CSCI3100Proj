import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserByName,
  getFollowStatus,
  followUser,
  unfollowUser,
  getFollowStatusById,
  getUserInfo,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:username", protectRoute, getUserByName);
router.get("/:target/followstatus", protectRoute, getFollowStatus);
router.post("/follow/:targetId", protectRoute, followUser);
router.post("/unfollow/:targetId", protectRoute, unfollowUser);
router.get("/:target/followstatusbyId", protectRoute, getFollowStatusById);
router.get("/userinfo/:userid", protectRoute, getUserInfo);

export default router;
