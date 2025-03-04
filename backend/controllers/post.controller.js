//to do: createPost, getPost(1.multiple for scrolling, 2.one for clicking in 3. mypost),
//  modifyPost, updatePost, deletePost, likePost, comment on Post
// remember to use pagination in this controller with limit and offset

import Post from "../models/post.model.js";


//to do: cleanse the data so it don't include illegal symbol
export const createPost = async (req,res,next) =>{
    try {
        const author = req.user;
        const {content} = req.body;
        //to do: deal with images

        const newPost = new Post({
            author: req.user,
            content
            //image
        });
        // {
        //     //debug
        //     console.log(author);
        //     console.log(author._id);
        //     console.log(content);
        // }
        await newPost.save();
        res.status(201).json({success: true,message: "post created successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Oops something went wrong!"});
        console.log(error.message);
    }
}

export const likePost = async (req,res,next) =>{
    try {
        
    } catch (error) {
        
    }
}

export const commentPost = async (req,res,next) =>{
    try {
        
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
        res.status(500).json({success: false, message: "Oops something went wrong"})
    }
}

export const getMyPost = async(req,res,next) => {
    try {
        
    } catch (error) {
        
    }
}

export const getFivePost = async(req,res,next) =>{
    try {
        
    } catch (error) {
        
    }
}

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

export const deletePost = async (req,res,next) =>{
    try {
        
    } catch (error) {
        
    }
}