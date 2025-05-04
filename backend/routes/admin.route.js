import express from "express";
import { adminProtectRoute } from "../middleware/auth.middleware.js";
import { muteUser, banPost, banComment,banSubComment, getPendingReportEntry, getResolvedReportEntry, getRejectedReportEntry, changeReportPostState,changeReportCommentState, changeReportSubCommentState, } from "../controllers/admin.controller.js"
const router = express.Router();
router.get("/reportContent", adminProtectRoute, getPendingReportEntry);
router.get("/resolvedreportContent", adminProtectRoute, getResolvedReportEntry);
router.get("/rejectedreportContent", adminProtectRoute, getRejectedReportEntry);
router.post("/muteUser/:userid", adminProtectRoute, muteUser);
// router.post("/suspendUser/:userid", adminProtectRoute, suspendUser);
router.post("/banPost/:postid", adminProtectRoute, banPost);
router.post("/banComment/:commentid", adminProtectRoute, banComment);
router.post("/banSubComment/:commentid/:subcommentid", adminProtectRoute, banSubComment);
router.post("/changeReportPostState/:id", adminProtectRoute, changeReportPostState);
router.post("/changeReportCommentState/:id", adminProtectRoute, changeReportCommentState);
router.post("/changeReportSubCommentState/:id", adminProtectRoute, changeReportSubCommentState);

export default router;
