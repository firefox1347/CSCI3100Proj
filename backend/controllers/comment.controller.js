import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import PostComment from "../models/postcomment.model.js";

export const getPostComments = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postid)
        .populate({
            path: 'comments',
            populate: [
              {
                path: 'author',
                select: 'username',
              },
              {
                path: 'subComment.author',
                select: 'username',
              },
            ],
          });
    
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }
  
      res.status(200).json({
        success: true,
        comments: post.comments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch comments: " + error.message
      });
    }
};

export const createComment = async (req, res) => {
    try {
      // Create new postcomment
      const newComment = await PostComment.create({
        content: req.body.content,
        author: req.user._id
      });
  
      // Update the Post to include this comment in its comments array
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postid,
        {
          $push: { comments: newComment._id },
          $inc: { noOfComments: 1 }
        },
        { new: true }
      );
  
      res.status(201).json({
        success: true,
        comment: newComment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create comment: " + error.message
      });
    }
};

export const createSubComment = async (req, res) => {
    try {
      const commendid = req.params.commentid;
      const text = req.body.content;
      
      const comment = await PostComment.findById(req.params.commentid);
      if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found",
        });
      }

      const newSubComment = {
        author: {
            _id: req.user._id,
            username: req.user.username,
          },        
        content: text,
      };
      comment.subComment.push(newSubComment);
      comment.noOfSubComment += 1;
      const savedComment = await comment.save();
      const createdSubComment = savedComment.subComment[savedComment.subComment.length - 1];

      res.status(201).json({
        success: true,
        subComment: createdSubComment,
      });
  
    } catch (error) {
      console.error("Error creating sub-comment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create sub-comment"
      });
    }
  };

export const likeComment = async (req, res) => {
    try {  
      const comment = await PostComment.findById(req.params.commentid);
      console.log(comment)
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found"
        });
      }
      // Check if like already
      const userId = req.user._id;
      const isLiked = comment.likes.some(id => id.equals(userId));
  
      if (isLiked) {
        comment.likes.pull(userId);
        comment.noOfLikes = Math.max(0, comment.noOfLikes - 1);
      } else {
        comment.likes.push(userId);
        comment.noOfLikes += 1;
      }

    //   console.log(isLiked)
      const savedComment = await comment.save();
  
      res.status(200).json({
        success: true,
        noOfLikes: savedComment.noOfLikes,
        isLiked: !isLiked
      });
  
    } catch (error) {
      console.error("[LIKE ERROR]", error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

export const likeSubComment = async (req,res) => {
    try {  
        const comment = await PostComment.findById(req.params.commentid);
        const subcommentid = req.params.subcommentid;
        const userId = req.user._id;
        const subcomment = comment.subComment.find(
            sub => sub._id.toString() === subcommentid
          );
          
        if (!subcomment) {
            return res.status(404).json({
                success: false,
                message: "Sub-comment not found",
            });
        }

        const isLiked = subcomment.likes.some(id => id.equals(userId));
        // console.log(isLiked);
        if (isLiked) {
            subcomment.likes.pull(userId);
            subcomment.noOfLikes = Math.max(0, subcomment.noOfLikes - 1);
          } else {
            subcomment.likes.push(userId);
            subcomment.noOfLikes += 1;
          }
        
        const savedComment = await comment.save();
        
        res.status(200).json({
            success: true,
            noOfLikes: subcomment.noOfLikes,
            isLiked: !isLiked
        });
    
      } catch (error) {
        console.error("[LIKE ERROR]", error);
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
}

export const editComment = async (req,res,next) => {

}

export const editSubComment = async (req,res,next) => {

}

export const deleteComment = async (req,res,next) => {

}

export const deleteSubComment = async (req,res,next) => {

}