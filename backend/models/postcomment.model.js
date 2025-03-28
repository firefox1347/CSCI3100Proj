import mongoose from "mongoose";
const postCommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required
    },
    content: {
        type: String,
        required
    },
    image: {
        type: String
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    noOfLikes: {
        type: Number,
        default: 0
    },
    subComment: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required
        },
        content: {
            type: String,
            required
        },
        likes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        noOfLikes: {
            type: Number,
            default: 0
        }
    }],
    noOfSubComment: {
        type: Number,
        default: 0
    }
});

const PostComment = mongoose.model("PostComment", postCommentSchema);

export default PostComment;