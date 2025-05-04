import User from '../models/user.model.js';
export const muteCheck = async (req, res, next) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        if(user.muted_until === null){
            next();
        }else
        if(user.muted_until > Date.now()){ //is this valid date check?
            return res.status(403).json({success: false, message: "You are muted", until: user.muted_until});
        }else{
            await User.findByIdAndUpdate(userId, {muted_until: null});
            next();
        }
    }catch(error){
        console.error("Error in muteCheck", error.message);
        return res.status(500).json({ success: false, message: "Oops something went wrong" });
    }
}