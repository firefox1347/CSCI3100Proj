import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPostComments,
  createComment,
  likeComment,
  createSubComment,
  likeSubComment,
} from '../controllers/comment.controller.js';
import { muteCheck } from '../middleware/muted.middleware.js';
const router = express.Router();

// GET
router.get('/post/:postid', protectRoute, getPostComments);

// POST
router.post('/post/:postid', protectRoute, muteCheck, createComment);

// POST
router.post('/:commentid/reply', protectRoute, muteCheck, createSubComment);

// PUT
router.put('/:commentid/like', protectRoute, likeComment);
router.put('/:commentid/:subcommentid/like', protectRoute, likeSubComment);

export default router;