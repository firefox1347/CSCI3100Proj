import mongoose from "mongoose";
const reportPostSchema = new mongoose.Schema(
  {
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post", 
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
  },
  { timestamps: true }
);

export const ReportPost = mongoose.model("ReportPost", reportPostSchema);

const reportCommentSchema = new mongoose.Schema(
  {
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PostComment",
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
  },
  { timestamps: true }
);

export const ReportComment = mongoose.model("ReportComment", reportCommentSchema);


const reportSubCommentSchema = new mongoose.Schema(
  {
    contentAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    parentContentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
  },
  { timestamps: true }
);

export const ReportSubComment = mongoose.model("ReportSubComment", reportSubCommentSchema);

