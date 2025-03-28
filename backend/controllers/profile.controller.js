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
  try {
    const { display_name, dob, gender, bio, user_id, avatar } = req.body;
    const { username } = req.params;
    const profile = await Profile.findOne({ username });
    const user = await Users.findOne({ username });

    if (avatar) {
      user.avatar_url = `data:image/jpeg;base64,${avatar}`;
    }
    if (display_name) user.display_name = display_name;
    if (dob) profile.dob = dob;
    if (gender) profile.gender = gender;
    if (bio) profile.bio = bio;

    await user.save();
    await profile.save();
    //console.log(user.avatar_url);

    res.status(200).json({
      success: true,
      message: "Profile edited successfully",
      data: {
        avatar_url: user.avatar_url,
        display_name: user.display_name,
        bio: profile.bio,
        dob: profile.dob,
        gender: profile.gender,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update profile' });
  }
};
