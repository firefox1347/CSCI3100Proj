import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar_url: {
      type: String,
      default: null,
    },
    display_name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
    suspended_until: {
      type: Date,
      default: null,
    },
    muted_until: {
      type: Date,
      default: null,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: null,
    },
    phone_verified: {
      type: Boolean,
      default: false,
    },
    reset_pw_token: {
      type: String,
    },
    reset_pw_token_expires_at: {
      type: Date,
    },
    verification_token: {
      type: String,
    },
    verification_token_expires_at: {
      type: Date,
    },
    last_log_in: {
      type: Date,
      default: Date.now,
    },
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dm" }],
    collection: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    likePost: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
