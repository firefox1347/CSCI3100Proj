import Profile from "../models/profile.model.js";
export const getProfile = async (req, res, next) => {
  const { username } = req.params;
  const profile = await Profile.findOne({
    username: username,
  });
  res.status(200).json(profile);
};
