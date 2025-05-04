import PostComment from "../models/postcomment.model.js";
import {ReportPost, ReportComment, ReportSubComment} from "../models/reportEntry.model.js"
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
// to do : add the content of the reported content to the respond.
export const getPendingReportEntry = async (req, res, next) => {
    try {
        const reportedPostEntries = await ReportPost.find( {$and: [{status: "pending"}]} ).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content images"
        });
        const reportedCommentEntries = await ReportComment.find({$and: [{status: "pending"}]}).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content image"
        });
        const reportedSubCommentEntries = await ReportSubComment.find({$and: [{status: "pending"}]}).select("_id reportedBy contentId content contentAuthor reason parentContentId");
        // console.log(reportedPostEntries);
        // console.log(reportedCommentEntries);
        // console.log(reportedSubCommentEntries);
        return res.status(200).json({success: true, reportedPostEntries: reportedPostEntries, reportedCommentEntries: reportedCommentEntries, reportedSubCommentEntries: reportedSubCommentEntries});
    } catch (error) {
        console.error("Error in getPendingReportEntry", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    
    }
}
export const getResolvedReportEntry = async (req, res, next) => {
    try {
        const ResolvedreportedPostEntries = await ReportPost.find( {$and: [{status: "resolved"}]} ).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content images"
        });
        const ResolvedreportedCommentEntries = await ReportComment.find({$and: [{status: "resolved"}]}).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content image"
        });
        const ResolvedreportedSubCommentEntries = await ReportSubComment.find({$and: [{status: "resolved"}]}).select("_id reportedBy contentId content contentAuthor reason parentContentId");
        return res.status(200).json({success: true, ResolvedreportedPostEntries: ResolvedreportedPostEntries, ResolvedreportedCommentEntries: ResolvedreportedCommentEntries, ResolvedreportedSubCommentEntries:ResolvedreportedSubCommentEntries});
    } catch (error) {
        console.error("Error in getResolvedReportEntry", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    
    }
}
export const getRejectedReportEntry = async (req, res, next) => {
    try {
        const RejectedreportedPostEntries = await ReportPost.find( {$and: [{status: "rejected"}]} ).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content images"
        });
        const RejectedreportedCommentEntries = await ReportComment.find({$and: [{status: "rejected"}]}).select("_id reportedBy contentId reason")
        .populate({
            path: "reportedBy",
            select: "username"
        }).populate({
            path: "contentId",
            select: "author content image"
        });
        const RejectedreportedSubCommentEntries = await ReportSubComment.find({$and: [{status: "rejected"}]}).select("_id reportedBy contentId content contentAuthor reason parentContentId");
        return res.status(200).json({success: true, RejectedreportedPostEntries, RejectedreportedCommentEntries, RejectedreportedSubCommentEntries});
    } catch (error) {
        console.error("Error in getRejectedReportEntry", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    
    }
}
// export const suspendUser = async (req,res,next) => {
//     const user = req.params.userid;
//     const Duration = req.body.duration; // in days
//     return res.status(200).json({message: "Suspend user"});

// }

export const muteUser = async (req,res,next) => {
    try {
        const user = req.params.userid;
        const Duration = req.body.duration; // in days
        if(!Duration){
            return res.status(400).json({success: false, message: "Please provide a duration"});
        }
        const userdata = await User.findByIdAndUpdate(user, {muted_until: Date.now() + Duration*24*60*60*1000}, {new: true});
        if(!userdata){
            return res.status(400).json({success: false, message: "User Not Found"});

        }
        return res.status(200).json({message: "Muted user", success: true});
    
    } catch (error) {
        console.error("Error in muteUser", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
    
}

export const banPost = async (req,res,next) => {
    try {
        const postId = req.params.postid;
        const post = await Post.findById(postId);

        if (!post) {
        // console.log(post);
        return res
            .status(404)
            .json({ success: false, message: "Oops, Post not found!" });
        }
        await Post.findByIdAndUpdate(postId, {deleted: true}, {new: true});

        return res.status(201).json({message: "Banned post"}); 
    
    } catch (error) {
        console.error("Error in banPost", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
}

export const banComment = async (req,res,next) => {
    try{
        const commentId = req.params.commentid;
        const comment = await PostComment.findById(commentId);

        if (!comment) {
        // console.log(post);
        return res
            .status(404)
            .json({ success: false, message: "Oops, Comment not found!" });
        }
        await PostComment.findByIdAndUpdate(commentId, {deleted: true}, {new: true});
        return res.status(201).json({message: "Banned comment"});
    } catch (error) {
        console.error("Error in banComment", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }

}

export const banSubComment = async (req,res,next) => {
    try{
        const subCommentId = req.params.subcommentid;
        const commentId = req.params.commentid;
        const comment = await PostComment.findById(commentId);

        if (!comment) {
        // console.log(post);
        return res
            .status(404)
            .json({ success: false, message: "Oops, Comment not found!" });
        }
        console.log(comment);
        const subComment = comment.subComment.id(subCommentId);
        if (!subComment) {
            return res.status(404).json({ success: false, message: "Sub-comment not found" });
        }
        subComment.deleted = true; // Remove the sub-comment from the array
        comment.noOfSubComment -= 1; // Decrement the count of sub-comments
        await comment.save(); // Save the updated comment

        
        return res.status(201).json({message: "Banned sub-comment"});
    } catch (error) {
        console.error("Error in banSubComment", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }

}

export const changeReportPostState = async (req,res,next) => {
    try {
        const reportId = req.params.id;
        const state = req.body.state;
        if(!reportId || !state){
            return res.status(400).json({success: false, message: "Please provide all fields"});
        }
        if(state!=="rejected" && state!=="resolved"){
            return res.status(400).json({success: false, message: "Invalid state"});
        }
        const reportEntry = await ReportPost.findByIdAndUpdate(reportId, {status: state, resolvedBy: req.user._id}, {new: true});
        if(!reportEntry){
            return res.status(404).json({success: false, message: "Report entry not found"});
        }
        //console.log(reportEntry);

        return res.status(200).json({message: "changeReportPostState", success:true});    
    } catch (error) {
        console.error("Error in changeReportState", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
}
export const changeReportCommentState = async (req,res,next) => {
    try {
        const reportId = req.params.id;
        const state = req.body.state;
        if(!reportId || !state){
            return res.status(400).json({success: false, message: "Please provide all fields"});
        }
        if(state!=="rejected" && state!=="resolved"){
            return res.status(400).json({success: false, message: "Invalid state"});
        }
        const reportEntry = await ReportComment.findByIdAndUpdate(reportId, {status: state, resolvedBy: req.user._id}, {new: true});
        if(!reportEntry){
            return res.status(404).json({success: false, message: "Report entry not found"});
        }
        //console.log(reportEntry);

        return res.status(200).json({message: "changeReportCommentState", success:true});    
    } catch (error) {
        console.error("Error in changeReportState", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
}
export const changeReportSubCommentState = async (req,res,next) => {
    try {
        const reportId = req.params.id;
        const state = req.body.state;
        if(!reportId || !state){
            return res.status(400).json({success: false, message: "Please provide all fields"});
        }
        if(state!=="rejected" && state!=="resolved"){
            return res.status(400).json({success: false, message: "Invalid state"});
        }
        const reportEntry = await ReportSubComment.findByIdAndUpdate(reportId, {status: state, resolvedBy: req.user._id}, {new: true});
        if(!reportEntry){
            return res.status(404).json({success: false, message: "Report entry not found"});
        }
        //console.log(reportEntry);

        return res.status(200).json({message: "changeReportSubCommentState", success:true});    
    } catch (error) {
        console.error("Error in changeReportState", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
}