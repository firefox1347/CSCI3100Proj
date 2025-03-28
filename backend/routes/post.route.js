// heard that from web that We should use nouns for routes if we are doing REST api

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  commentPost,
  createPost,
  deletePost,
  getMyPost,
  getOnePost,
  getSomePost,
  likePost,
  getAllPost,
} from "../controllers/post.controller.js";
const router = express.Router();

router.post("/newpost", protectRoute, createPost);
router.get("/post/:postid", protectRoute, getOnePost);
router.delete("/post/:postid", protectRoute, deletePost);
router.get("/mypost", protectRoute, getMyPost);
router.get("/allpost", protectRoute, getAllPost);
router.get("/somepost/:offset/:limit", protectRoute, getSomePost);
router.post("/like/:postid", protectRoute, likePost);
router.post("/comment/:postid", protectRoute, commentPost);
export default router;
