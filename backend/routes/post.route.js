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
  getPostOwner,
  getPostLikes,
  getTargetPost,
} from "../controllers/post.controller.js";
import { muteCheck } from "../middleware/muted.middleware.js";
const router = express.Router();

router.post("/newpost", protectRoute,muteCheck, createPost);
router.get("/post/:postid", protectRoute, getOnePost);
router.delete("/post/:postid", protectRoute, deletePost);
router.get("/mypost", protectRoute, getMyPost);
router.get("/postowner/:userid", protectRoute, getPostOwner);
router.get("/allpost", protectRoute, getAllPost);
router.get("/somepost/:offset/:limit", protectRoute, getSomePost);
router.post("/like/:postid", protectRoute, likePost);
router.post("/comment/:postid", protectRoute, muteCheck, commentPost);
router.get("/post/:postid/likes", protectRoute, getPostLikes);
router.get("/userposts/:userid", protectRoute, getTargetPost);

export default router;
