import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import passwordCheck from "../utils/passwordCheck.js";
import genderCheck from "../utils/genderCheck.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import sendEmail from "../utils/emailSender.js";

export const signup = async (req, res, next) => {
  try {
    //validations
    const { password, dob, gender, email, username } = req.body;
    if (!password || !email || !username) {
      return res.status(400).json({
        success: false,
        message: "All information should be filled in",
      });
    }

    if (!genderCheck(gender)) {
      return res
        .status(400)
        .json({ success: false, message: "gender is out of enum value" });
    }
    const existingEmail = await User.findOne({ email });
    const existingusername = await User.findOne({ username });
    if (existingEmail)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    if (existingusername)
      return res
        .status(400)
        .json({ success: false, message: "username already exists" });
    if (!passwordCheck(password)) {
      return res.status(400).json({
        success: false,
        message: "Not all criteria are met for password",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verification_token = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    //generate user and store to db
    const newUser = new User({
      password: hashedPassword,
      dob,
      gender,
      email,
      username,
      verification_token,
      verification_token_expires_at: Date.now() + 60 * 60 * 1000,
    });
    await newUser.save();

    //generate profile for created user
    const newProfile = new Profile({
      username,
      bio: "",
      dob,
      gender,
    });
    await newProfile.save();

    //create token and send to client
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    //for debugging
    //res.status(200).json({message: "ok", token: token, password: hashedPassword, verification_token:verification_token});

    res.cookie("bbtoken", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, message: "Register Sucessfully" });

    //sending verification email, todo: to be implemented @ppc
    try {
      await sendEmail(newUser.email, newUser.name, token, "verify");
    } catch (error) {
      console.error("Error sending verification email", error);
    }
  } catch (error) {
    console.log(error); // for debugging
    res.status(500).send({ success: false, message: "Internal Server Error" }); // for production
  }
};
export const login = async (req, res, next) => {
  try {
    const { username_or_email, password } = req.body;
    if (!password || !username_or_email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    let user = await User.findOne({ username: username_or_email });
    if (!user) {
      user = await User.findOne({ email: username_or_email });
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Account or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Account or Password" });
    }

    //update last login
    user.last_log_in = new Date();
    await user.save();

    // //debug
    // console.log(username);
    // console.log(email);
    // res.status(200).json({message: "debug check"});

    //create token and send to client
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("bbtoken", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, message: "Logged in Sucessfully" });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
export const logout = async (req, res, next) => {
  res.clearCookie("bbtoken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
export const checkAuth = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("error in checkAuth", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const reset_pw_token = crypto.randomBytes(20).toString("hex");
    const reset_pw_token_expires_at = Date.now() + 26 * 60 * 60 * 1000;
    user.reset_pw_token = reset_pw_token;
    user.reset_pw_token_expires_at = reset_pw_token_expires_at;
    await user.save();
    {
      //debugging block(to get token without email sending service)
      console.log(reset_pw_token);
      console.log(reset_pw_token_expires_at);
    }

    res.status(200).json({
      success: true,
      message: "Password reset email is sent to your email",
    });
    try {
      //URL is not functioning
      const URL = process.env.FRONTEND + "/resetpassword/" + reset_pw_token;
      await sendEmail(user.email, user.username, URL, "forgotPW");
      // console.log("Sent email" + user.email + " " + user.username + " " + URL);
    } catch (error) {
      console.error("Error in forgotPassword sending email", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (error) {
    console.error("error in forgotPassword", error.message);
    res
      .status(500)
      .json({ success: false, message: "Oops! something went wrong" });
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    {
      console.log(user._id);
    }
    await User.deleteOne({ _id: userId });
    res.clearCookie("bbtoken");
    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount", error.message);
    res
      .status(400)
      .json({ success: false, message: "Oops something went wrong" });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    if (!passwordCheck(password)) {
      return res.status(400).json({
        success: false,
        message: "Not all criteria are met for password",
      });
    }

    const user = await User.findOne({
      reset_pw_token: token,
      reset_pw_token_expires_at: { $gt: Date.now() },
    });

    //console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.reset_pw_token = null;
    user.reset_pw_token_expires_at = null;
    await user.save();
    await sendEmail(user.email, user.username, "", "resetSuccess");
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword");
    res
      .status(500)
      .json({ success: false, message: "Oops! something went wrong" });
  }
};
