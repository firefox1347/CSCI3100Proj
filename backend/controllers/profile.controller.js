import Profile from "../models/profile.model.js";
import Users from "../models/user.model.js";
export const getProfile = async (req, res, next) => {
  const { username } = req.params;
  const user = await Users.findOne({ username });
  const profile = await Profile.findOne({
    username: username,
  });
  res.status(200).json({profile: profile, user: user});
};

export const updateProfile = async (req, res, next) => {
    const { display_name, dob, gender, bio, user_id } = req.body;
    const { username } = req.params;
    const profile = await Profile.findOne({ username });
    const user = await Users.findOne({ username });

    user.display_name = display_name;
    profile.dob = dob;
    profile.gender = gender;
    profile.bio = bio;
    await user.save();
    await profile.save();

    //console.log(profile);
  res.status(200).json({
    success: true,
    message: "Profile edited successfully",
  });
};
