import { Avatar, Box, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const PostHeader = ({ name, username, avatar, userid }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Fetch follow status and counts
  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", authUser?._id, userid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/${userid}/followstatus`);
      return res.data;
    },
    enabled: !!authUser && !!userid,
    onError: (error) => {
      console.error("Error checking follow status:", error);
    },
  });

  const isFollowing = followStatus?.isFollowing || false;
  const numberOfFollowers = followStatus?.numberOfFollowers || 0;
  const numberOfFollowing = followStatus?.numberOfFollowing || 0;

  // Follow/Unfollow mutations
  const followMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/user/follow/${userid}`),
    onSuccess: () => {
      toast.success("Followed successfully");
      queryClient.invalidateQueries(["followStatus", authUser?._id, userid]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => axiosInstance.post(`/user/unfollow/${userid}`),
    onSuccess: () => {
      toast.success("Unfollowed successfully");
      queryClient.invalidateQueries(["followStatus", authUser?._id, userid]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });
  const handleFollow = () => {
    if (!authUser) {
      toast.error("You need to log in to follow users");
      return;
    }
    isFollowing ? unfollowMutation.mutate() : followMutation.mutate();
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%", 
        my: 2 
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Link to profile */}
        <Link to={`/profile/${name}`}>
          <Avatar 
            src={avatar} 
            alt="Profile" 
            sx={{ width: 32, height: 32, cursor: "pointer" }}
          />
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Username link */}
          <Link to={`/profile/${name}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="body2" fontWeight="bold" color="black">
              {username}
            </Typography>
          </Link>
          {/* <Typography variant="body2" color="text.secondary">
            • 1w
          </Typography> */}
        </Box>
      </Box>

      {/* Follow button and counts */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {numberOfFollowers} followers
        </Typography>
        {authUser && authUser._id !== userid && (
          <Typography
            variant="body2"
            color={isFollowing ? "text.primary" : "primary"}
            fontWeight="bold"
            sx={{ 
              cursor: "pointer",
              "&:hover": { color: "text.primary" },
              transition: "color 0.2s"
            }}
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PostHeader;