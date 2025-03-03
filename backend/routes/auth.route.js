import express from "express";
import { checkAuth, deleteAccount, forgotPassword, login, logout, resetPassword, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();



router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

router.post("/deleteacc", protectRoute, deleteAccount);
router.get("/me", protectRoute, checkAuth);
export default router;