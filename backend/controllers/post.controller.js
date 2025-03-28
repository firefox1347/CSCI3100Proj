//to do: createPost, getPost(1.multiple for scrolling, 2.one for clicking in 3. mypost),
//  modifyPost, updatePost, deletePost, likePost, comment on Post
// remember to use pagination in this controller with limit and offset

import Post from "../models/post.model.js";
import User from "../models/user.model.js";


//to do: cleanse the data so it don't include illegal symbol
export const createPost = async (req,res,next) =>{
    try {
        const author = req.user;
        const {content, image} = req.body;
        //to do: deal with images (make it data url format?)
        let newPost;
        if(image){
            newPost = new Post({
                author,
                content,
                image
            });    
        }else{
            newPost = new Post({
                author,
                content
            });    
        }
        
        // {
        //     //debug
        //     console.log(author);
        //     console.log(author._id);
        //     console.log(content);
        // }
        await newPost.save();
        res.status(201).json({success: true,message: "post created successfully"});
    } catch (error) {
        console.error("Error in createPost", error.message);
        res.status(500).json({success: false, message: "Oops something went wrong"});
    }
}

export const likePost = async (req,res,next) =>{
    //have bug
    try {
        const postId = req.params.postid;
        const userId = req.user._id;
        
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if(!post){
            return res.status(404).json({success: false, message: "Oops! page not found"});
        }
        if(user.likePost.includes(postId)){
            //handle unlike logic
            post.noOfLikes = post.noOfLikes - 1;
            post.likes = post.likes.filter((uid) => uid.toString !== userId);
            user.likePost = user.likePost.filter((pid) => pid.toString !== postId);
            res.status(200).json({success: true, message: "Unliked Post Successfully"});
        }
        else{
            //handle like logic
            post.noOfLikes = post.noOfLikes + 1;
            post.likes = post.likes.push(userId);
            user.likePost = user.likePost.push(postId);

            // to do: give notification to author of post? used message queue?
            res.status(200).json({success: true, message: "Liked Post Successfully"});
        }
        user.save();
        post.save()

    } catch (error) {
        console.error("Error in likePost", error.message);
        res.status(500).json({success: false, message: "Oops something went wrong"});
    }
}

export const commentPost = async (req,res,next) =>{
    try {
        const postid = req.params.postid;
    } catch (error) {
        
    }
}

export const getOnePost  = async(req,res,next) =>{
    try {
        const postid = req.params.postid;
        let onePost = await Post.findById(postid).select("author content images");
        if(!onePost){
            res.status(404).json({success: false, message: "that page don't exists"});
        }
        res.status(200).json({success: true , post: onePost});
    } catch (error) {
        console.error("Error in getOnePost", error.message);
        res.status(500).json({success: false, message: "Oops something went wrong"});
    }
}

export const getMyPost = async(req,res,next) => {
    try {
        //to do: offset and limit
        const userID = req.user._id;
        //console.log(userID);
        const myPostList = await Post.find({author: userID});
        //console.log(myPostList);


        res.status(200).json({success: true, post: myPostList});
    } catch (error) {
        console.error("Error in getMyPost", error.message);
        res.status(500).json({success: false, message: "Oops something went wrong"});
    }
}

export const getSomePost = async(req,res,next) =>{
    try {
        //to do: offset and limit
        const userID = req.user._id;
        //to do: filter top limit post for usre using recommedation algo
        

    } catch (error) {
        console.error("Error in getSomePost", error.message);
        res.status(500).json({success: false, message: "Oops something went wrong"});    }
}

export const deletePost = async (req,res,next) =>{
    try {
        const user = req.user._id;
        const postId = req.params.postid;
        const post = await Post.findById(postId);

        if(!post){
            // console.log(post);
            return res.status(404).json({success: false, message: "Oops, Post not found!"});
        }
        // console.log(user.toString());
        // console.log(post.author.toString())
        if(user.toString()!==post.author.toString()){
            return res.status(403).json({success: false, message: "Not authorized"});
        }

        await Post.findByIdAndDelete(postId);

        res.status(201).json({success: true, message: "Post deleted!"});
    } catch (error) {
        console.error("Error in deletePost", error.message);
        res.status(500).json({message: false, message: "Oops something went wrong"});
    }
}

export const savePost = async (req,res,next) => {
    try {
    
    } catch (error) {
        
    }

}

//to do: this two function can be added later
export const modifyPost = async(req,res,next) =>{
    try {
        
    } catch (error) {
        
    }
}

export const updatePost = async(req,res,next) =>{
    try {
        
    } catch (error) {
        
    }
}
