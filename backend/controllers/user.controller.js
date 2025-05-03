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

export const followUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id; // Assuming authentication middleware sets req.user
    const targetUserId = req.params.targetId; // Assuming target user ID is passed in the URL

    // Prevent self-follow
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    // Check if target user exists
    const targetUser = await Users.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found.",
      });
    }

    // Get current user with necessary fields
    const currentUser = await Users.findById(currentUserId).select("following");
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check existing follow status
    if (currentUser.following.some((id) => id.equals(targetUserId))) {
      return res.status(409).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    // Update following/follower relationships
    await Users.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });

    await Users.findByIdAndUpdate(targetUserId, {
      $addToSet: { follower: currentUserId },
    });

    res.status(200).json({
      success: true,
      message: "Successfully followed the user.",
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while trying to follow the user.",
    });
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.targetId;

    // Prevent self-unfollow
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself.",
      });
    }

    // Check if target user exists
    const targetUser = await Users.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found.",
      });
    }

    // Get current user with necessary fields
    const currentUser = await Users.findById(currentUserId).select("following");
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check if not following
    if (!currentUser.following.some((id) => id.equals(targetUserId))) {
      return res.status(409).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    // Update following/follower relationships
    await Users.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    await Users.findByIdAndUpdate(targetUserId, {
      $pull: { follower: currentUserId },
    });

    res.status(200).json({
      success: true,
      message: "Successfully unfollowed the user.",
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while trying to unfollow the user.",
    });
  }
};

export const getFollowStatus = async (req, res, next) => {
  try {
    const { target } = req.params;
    const userId = req.user.id;

    // Check if target user exists
    const targetUser = await Users.findById(target);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Check if current user exists
    const currentUser = await Users.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert to string comparison for safety
    const isFollowing = currentUser.following.some((id) =>
      id.equals(targetUser._id)
    );

    const followersList = targetUser.follower;
    const followingList = targetUser.following;

    res.status(200).json({
      success: true,
      isFollowing,
      followersList,
      followingList,
      numberOfFollowers: followersList.length,
      numberOfFollowing: followingList.length,
    });
  } catch (error) {
    console.error("Error fetching follow status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching follow status",
    });
  }
};

export const getFollowStatusById = async (req, res, next) => {
  try {
    const { target } = req.params;

    // Check if target user exists
    const targetUser = await Users.findById(target);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    const followersList = targetUser.follower;
    const followingList = targetUser.following;

    const followingListForSave = targetUser.following;

    const getRandomSubset = (array, n) => {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    };

    const randomFollowers = getRandomSubset(followersList, 5);

    // Function to process followers and get their followings
    async function processFollowers(followersList) {
      try {
        const followerFollowings = await Promise.all(
          followersList.map((id) => getFollowListForLoopId(id))
        );
        return followerFollowings;
      } catch (error) {
        console.error("Error fetching follow lists:", error);
        return [];
      }
    }

    const followerFollowings = await processFollowers(randomFollowers);

    // console.log(followerFollowings); This ok

    // Delete the ones user already following (including user)

    const followerFollowingsIds = [];

    followerFollowings.forEach(id => {
      const idStr = id.toString();
      // console.log(idStr);
      idStr.split(',').forEach(singleId => {
        followerFollowingsIds.push(singleId.trim());
      });

    }) // IMPORTANT : Make them into id form.

    const resultFromEliminate = [];

    followerFollowingsIds.forEach(id => {
      // console.log("id is" + id);
      let found = false;
      followingList.forEach(followingId => {
        if (followingId === id) {
          found = true;
        }
      });

      if (!found && id !== target) {
        resultFromEliminate.push(id);
        // console.log("Pushed");
      }
    });

    const eliminatedfollowerFollowings = resultFromEliminate;

    // console.log(eliminatedfollowerFollowings);  DONE DONE DONE

    const count = {};

    // const testarrayformany = ["a", "a", "d", "d", "d", "b", "c", "a"]

    eliminatedfollowerFollowings.forEach(id => {
      count[id] = (count[id] || 0) + 1;
    });

    const largestThree = Object.keys(count)
    .sort((a, b) => count[b] - count[a])
    .slice(0, 3);

    res.status(200).json({
      success: true,
      largestThree: largestThree,
      followingList: followingListForSave
    });
  } catch (error) {
    console.error("Error fetching follow status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching follow status",
    });
  }
};

const getFollowListForLoopId = async (id) => {
  try {
    const targetUser = await Users.findById(id);

    if (!targetUser) {
      console.log("Target user not found.")
    }

    return targetUser.following;
  } catch (error) {
    console.error("Error in get follow list:", error.message);
    return;
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Oops! User not found" });
    }
    const userInfo = {
      username: user.display_name ? user.display_name : user.username,
      avatar: user.avatar_url,
      name: user.username
    };
    
    res.status(200).json({ success: true, userInfo: userInfo });
  } catch (error) {}
};




