//to do: createPost, getPost(1.multiple for scrolling, 2.one for clicking in 3. mypost),
//  modifyPost, updatePost, deletePost, likePost, comment on Post
// remember to use pagination in this controller with limit and offset

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//to do: cleanse the data so it don't include illegal symbol
export const getPostOwner = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Oops! User not found" });
    }
    const postOwner = {
      username: user.display_name ? user.display_name : user.username,
      avatar: user.avatar_url,
    };
    res.status(200).json({ success: true, postOwner: postOwner });
  } catch (error) {}
};

export const createPost = async (req, res, next) => {
  try {
    const author = req.user;
    const { content, images } = req.body;
    //to do: deal with images (make it data url format?)
    let newPost;
    if (images) {
      newPost = new Post({
        author,
        content,
        images,
      });
    } else {
      newPost = new Post({
        author,
        content,
      });
    }

    // {
    //     //debug
    //     console.log(author);
    //     console.log(author._id);
    //     console.log(content);
    // }
    await newPost.save();
    res
      .status(201)
      .json({ success: true, message: "post created successfully" });
  } catch (error) {
    console.error("Error in createPost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const likePost = async (req, res, next) => {
  try {
    // console.log("Handling likePost");
    const currentUser = req.user._id;
    const postid = req.params.postid;
    const updatedPost = await Post.findByIdAndUpdate(
      postid,
      [
        {
          $set: {
            likes: {
              $cond: [
                { $in: [currentUser, "$likes"] }, //If user in likes
                { $setDifference: ["$likes", [currentUser]] }, // Remove user
                { $concatArrays: ["$likes", [currentUser]] }    // Add user
              ]
            },
            noOfLikes: {
              $cond: [
                { $in: [currentUser, "$likes"] },  //If user in likes
                { $subtract: ["$noOfLikes", 1] },  // Decrement
                { $add: ["$noOfLikes", 1] }        // Increment
              ]
            }
          }
        }
      ],
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      post: updatedPost
    });

  } catch (error) {
    console.error("Error in likePost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postid;
    const author = req.user._id;
    const populatedComment = await PostComment.findById(newComment._id)
      .populate('author', 'username');

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const newComment = await PostComment.create({
      author,
      content,
      post: postId,
    });

    // Update parent post's comment count
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
      $inc: { noOfComments: 1 }
    });

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      comment: populatedComment
    });

  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message + "Failed to post comment"
    });
  }
};

export const getOnePost = async (req, res, next) => {
  try {
    const postid = req.params.postid;
    let onePost = await Post.findById(postid).select("author content images");
    if (!onePost) {
      res
        .status(404)
        .json({ success: false, message: "that page don't exists" });
    }
    res.status(200).json({ success: true, post: onePost });
  } catch (error) {
    console.error("Error in getOnePost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const getMyPost = async (req, res, next) => {
  try {
    //to do: offset and limit
    const userID = req.user._id;
    const myPostList = await Post.find({ author: userID });
    res.status(200).json({ success: true, posts: myPostList });
  } catch (error) {
    console.error("Error in getMyPost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const getAllPost = async (req, res, next) => {
  try {
    const PostList = await Post.find({});
    res.status(200).json({ success: true, posts: PostList });
  } catch (error) {
    console.error("Error in getMyPost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const getSomePost = async (req, res, next) => {
  try {
    //to do: offset and limit
    const userID = req.user._id;
    //to do: filter top limit post for usre using recommedation algo
  } catch (error) {
    console.error("Error in getSomePost", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const user = req.user._id;
    const postId = req.params.postid;
    const post = await Post.findById(postId);

    if (!post) {
      // console.log(post);
      return res
        .status(404)
        .json({ success: false, message: "Oops, Post not found!" });
    }
    // console.log(user.toString());
    // console.log(post.author.toString())
    if (user.toString() !== post.author.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(201).json({ success: true, message: "Post deleted!" });
  } catch (error) {
    console.error("Error in deletePost", error.message);
    res
      .status(500)
      .json({ message: false, message: "Oops something went wrong" });
  }
};

export const getPostLikes = async(req, res, next) => {
  try {
  const postid = req.params.postid;
    let postLikes = await Post.findById(postid).select("likes noOfLikes");
    if (!postLikes) {
      res
        .status(404)
        .json({ success: false, message: "The post don't exists" });
    }
    res.status(200).json({ success: true, post: postLikes });
  } catch (error) {
    console.error("Error in getPostLikes", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops something went wrong" });
  }
}

export const savePost = async (req, res, next) => {
  try {
  } catch (error) {}
};

//to do: this two function can be added later
export const modifyPost = async (req, res, next) => {
  try {
  } catch (error) {}
};

export const updatePost = async (req, res, next) => {
  try {
  } catch (error) {}
};
