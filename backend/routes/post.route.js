// heard that from web that We should use nouns for routes if we are doing REST api

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getOnePost } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/newpost", protectRoute, createPost);
router.get("/:postid", protectRoute, getOnePost);
export default router;