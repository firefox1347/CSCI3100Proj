import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { reportPost, reportComment,reportSubComment } from "../controllers/report.controller.js";
const router = express.Router();
router.post("/reportPost/:postid", protectRoute, reportPost);
router.post("/reportComment/:commentid", protectRoute, reportComment);
router.post("/reportSubComment/:commentid/:subcommentid", protectRoute, reportSubComment);
export default router;
