import User from"../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passwordCheck from "../utils/passwordCheck.js";
import genderCheck from "../utils/genderCheck.js"
import { protectRoute } from "../middleware/auth.middleware.js";



export const signup = async (req,res,next) =>{
    try {
        //validations
        const {password, dob, gender, email, username} = req.body;
        if(!password || !dob || !gender || !email || !username){
            return res.status(400).json({message: "All information should be filled in"});
        }
        if(!genderCheck(gender)){
            return res.status(400).json({message: "gender is out of enum value"});
        }
        const existingEmail = await User.findOne({email});
        const existingusername = await User.findOne({username});
        if(existingEmail) return res.status(400).json({message: "Email already exists"});
        if(existingusername) return res.status(400).json({message: "username already exists"});
        if(!passwordCheck(password)){
            return res.status(400).json({message: "Not all criteria are met for password"});
        }

        //hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verification_token = Math.floor(100000 + Math.random()*900000).toString();


        //generate user and store to db
        const newUser = new User({
            password: hashedPassword, 
            dob, 
            gender, 
            email, 
            username,
            verification_token,
            verification_token_expires_at: Date.now()+ 60*60*1000,
        });
        await newUser.save();

        //create token and send to client
        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET, {expiresIn: "3d"});
        
        
        //for debugging
        //res.status(200).json({message: "ok", token: token, password: hashedPassword, verification_token:verification_token});
        
        
        res.cookie("bbtoken", token, {
            httpOnly: true,
            maxAge: 3*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        
        res.status(201).json({message: "Register Sucessfully"});
        
        //sending verification email, todo: to be implemented
        // try {
        //     await sendVerificationEmail(user.email, user.name);
        // } catch (emailError) {
        //     console.error("Error sending welcome Email",emailError);
        // }


    } catch (error) {
        console.log(error); // for debugging
        res.status(500).send({message: "Internal Server Error"}); // for production
    }
}
export const login = async (req,res,next) =>{
    try {
        const {username_or_email, password} = req.body;
        if(!password || !username_or_email){
            return res.status(400).json({message: "Invalid credentials"});
        }
        let user = await User.findOne({username: username_or_email});
        if(!user){
            user = await User.findOne({email: username_or_email});
        }
        
        if(!user){
            return res.status(400).json({message: "Wrong Account or Password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Wrong Account or Password"});
        }


        //update last login
        user.last_log_in = new Date();
        await user.save();

        // //debug
        // console.log(username);
        // console.log(email);
        // res.status(200).json({message: "debug check"});



        //create token and send to client
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn: "3d"});
        
        
        res.cookie("bbtoken", token, {
            httpOnly: true,
            maxAge: 3*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        
        res.status(201).json({message: "Logged in Sucessfully", user: user});

    } catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({message: "Internal Server error"});
    }
}
export const logout = async (req,res,next) =>{
    res.clearCookie("bbtoken");
    res.status(200).json({success:true, message: "Logged out successfully"});
}
export const checkAuth = async (req,res,next) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("error in checkAuth", error.message);
        res.status(500).json({message: "Server Error"});
    }
}
  
//to be implement : forgotPassword, resetPassword, deleteAccount