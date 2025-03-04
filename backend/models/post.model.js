import mongoose from "mongoose";
//structure of Post like post in bilibili. author avatar on top left, then author username/displayname
//text in the middle, can include emoji and url,
// image at the bottom(optional) at most 9 images
// retweet(optional) is below the image
//at the very bottom there is a bar of share, comment, like and save

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        //not sure what type yet. Just put here first
        type: String,
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostComment"
        //should The user have a list of their comment too?
    }],
    share: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

});

const Post = mongoose.model("Post", postSchema);

export default Post;
