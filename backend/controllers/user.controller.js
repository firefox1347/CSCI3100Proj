import Users from "../models/user.model.js";
export const getUserByName = async (req, res, next) => {
  try {
    const { username } = req.params;
    const users = await Users.find({
      username: { $regex: new RegExp(username, "i") },
    }).select("username avatar_url");

    if (users.length === 0) {
      return res.status(200).json({ user: [] });
    }

    res.status(200).json({ user: users });
  } catch (error) {
    next(error);
  }
};
