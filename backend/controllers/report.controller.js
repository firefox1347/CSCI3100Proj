import {ReportComment, ReportPost, ReportSubComment} from "../models/reportEntry.model.js";
import Post from "../models/post.model.js";
import PostComment from "../models/postcomment.model.js";

export const reportPost = async (req, res, next) => {
    try {
        const reporter = req.user;
        const postId = req.params.postid;
        const reason = req.body.reason;
        //console.log(reporter, postId, reason);
        // Check if the post exists
        if(!reason){
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for reporting",
            });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        const newReportEntry = new ReportPost({
            reportedBy: reporter._id,
            contentId: postId,
            reason: reason,
        });
        await newReportEntry.save();

        res.status(200).send({message: "successfully reported post", success: true});

    } catch (error) {
        console.error("Error in reportPost", error.message);
        res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }

    
}

export const reportComment = async (req,res,next) => {
    try {
        const reporter = req.user;
        const commentId = req.params.commentid;
        const reason = req.body.reason;
        if(!reason){
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for reporting",
            });
        }
        //console.log(reporter, commentId, reason);
        const comment = await PostComment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        const newReportEntry = new ReportComment({
            reportedBy: reporter._id,
            contentId: commentId,
            reason: reason,
        });
        await newReportEntry.save();

        res.status(200).send({message: "successfully reported comment", success: true});
    } catch (error) {
        console.error("Error in reportComment", error.message);
        res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }

}

export const reportSubComment = async (req,res,next) => {
    try {
        const reporter = req.user;
        const commentId = req.params.commentid;
        const subCommentId = req.params.subcommentid;
        const reason = req.body.reason;
        if(!reason){
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for reporting",
            });
        }
        // console.log(reporter, reason);
        // console.log(commentId);
        // console.log(subCommentId);
        const comment = await PostComment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        const subcomment = comment.subComment.find(
            sub => sub._id.toString() === subCommentId
        );
        if (!subcomment) {
            return res.status(404).json({
                success: false,
                message: "Sub-comment not found",
            });
        }

        const newReportEntry = new ReportSubComment({
            content: subcomment.content,
            contentAuthor: subcomment.author,
            reportedBy: reporter._id,
            parentContentId: commentId,
            contentId: subCommentId,
            reason: reason,
        });
        await newReportEntry.save();

        res.status(200).send({message: "successfully reported Sub-Comment", success: true});
    } catch (error) {
        console.error("Error in reportSubComment", error.message);
        res
          .status(500)
          .json({ success: false, message: "Oops something went wrong" });
    }
}
