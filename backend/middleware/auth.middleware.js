import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        // to watch before doing route
        //this function will be in between client request and controller action. So if the user is not authorized
        //It won't go to controller action. Also, this function check the user information from database and 
        // put it in the request for controller in the later layer to use it(
        //I am not sure should we do this or should we take it from database when needed
        //  But I will just leave it here first, maybe will change later)
        const token = req.cookies["bbtoken"];
        
        if(!token) {
            return res.status(401).json({messsage: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            res.status(401).message({message: "Unauthorized"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectedroute", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}