import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    token:{
        type: String,
        default: null
    },  
    password:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    Profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        default: null
    },
    suspendedUntil:{
        type: Date,
        default: null
    },
    mutedUntil:{
        type: Date,
        default: null
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        default: null
    },
    phoneVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken:{
        type: String,
    },
    resetPasswordTokenExpiresAt:{
        type: Date,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiresAt:{
        type: Date,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    follower: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    dm: [{type: mongoose.Schema.Types.ObjectId, ref: "Dm"}],
},{timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;