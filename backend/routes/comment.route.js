import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPostComments,
  createComment,
  likeComment,
  createSubComment,
  likeSubComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

// GET
router.get('/post/:postid', protectRoute, getPostComments);

// POST
router.post('/post/:postid', protectRoute, createComment);

// POST
router.post('/:commentid/reply', protectRoute, createSubComment);

// PUT
router.put('/:commentid/like', protectRoute, likeComment);
router.put('/:commentid/:subcommentid/like', protectRoute, likeSubComment);

export default router;