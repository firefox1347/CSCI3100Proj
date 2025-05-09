import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { set } from "mongoose";
import EditProfile from "./EditProfile";
import { FollowModal } from '../layout/FollowModal';

const ProfileHeader = (userProfile) => {
  //console.log(userProfile.profileData.profile.username);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { data : connectionStauts, refetch: refetchConnectionStatus } = useQuery({
  //     queryKey: ["connectionStatus", userData._id],
  //     queryFn: () => axiosInstance.get(`/connections/status/${userData._id} `),
  //     enabled: !isSelfProfile,
  // });
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
  const targetId = userProfile.profileData.user._id;
  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", authUser?._id, targetId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/${targetId}/followstatus`);
      return res.data; // Assuming API returns { isFollowing: boolean }
    },
    enabled: !!authUser && !!targetId, // Only run when both users are available

    onError: (error) => {
      console.error("Error checking follow status:", error);
    },
  });

  const follow = useMutation({
    mutationFn: (targetId) => axiosInstance.post(`/user/follow/${targetId}`),
    onSuccess: () => {
      toast.success("Followed successfully");
      queryClient.invalidateQueries(["followStatus", authUser?._id, targetId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const unfollow = useMutation({
    mutationFn: (targetId) => axiosInstance.post(`/user/unfollow/${targetId}`),
    onSuccess: () => {
      toast.success("Unfollowed successfully");
      queryClient.invalidateQueries(["followStatus", authUser?._id, targetId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { data: userPosts } = useQuery({
    queryKey: ["userPostsCount", targetId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/userposts/${targetId}`);
      return res.data;
    },
    enabled: !!targetId,
  });

  const isFollowing = followStatus?.isFollowing;
  const followersList = followStatus?.followersList;
  const followingList = followStatus?.followingList;
  const numberOfFollowers = followStatus?.numberOfFollowers;
  const numberOfFollowing = followStatus?.numberOfFollowing;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('followers');
  const followers = followStatus?.followersList || [];
  const following = followStatus?.followingList || [];

  console.log(following, followers);

  const handleFollow = (targetId) => {
    if (isFollowing) {
      unfollow.mutate(targetId);
    } else {
      follow.mutate(targetId);
    }
  };
  
  const handleFollowersClick = () => {
    setModalType('followers');
    setModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType('following');
    setModalOpen(true);
  };

  const handleEdit = () => {
    if (userProfile.isSelfProfile) {
      navigate(`edit`);
    } else {
      toast.error("You can only edit your own profile");
    }
  };

  return (
    <>
      <div className="flex flex-col border-b-2 border-grey-200 pb-6 text-[1.5vw]">
        <div className="flex items-center justify-center">
          <div className="flex mr-20">
            <img
              src={
                userProfile.profileData.user.avatar_url ||
                "../../../public/default-avatar.jpg"
              }
              alt="Profile avatar"
              className="w-40 h-40 mr-4 rounded-full aspect-square"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="flex flex-col items-start h-40">
            <div className="flex  items-start justify-start">
              <div className="flex text-[1.1vw] font-bold h-10 items-center">
                {userProfile.profileData.profile.username}
              </div>
              {userProfile.isSelfProfile ? (
                <div className="flex items-center justify-center">
                  <button
                    className="flex items-center justify-center text-[1.1vw] w-full bg-white text-black mx-4 py-2 px-10 rounded-full hover:bg-primary-dark border-2 transition duration-300 h-10"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <button
                    className="flex items-center justify-center text-[1.1vw] w-full bg-white text-black mx-4 py-2 px-10 rounded-full hover:bg-primary-dark border-2 transition duration-300 h-10"
                    onClick={() => {
                      handleFollow(targetId);
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start space-between mt-4 w-full">
              <div className="text-center font-bold mr-6 mb-3 text-[1.1vw]">
              {userPosts?.posts?.length || 0} Post{userPosts?.posts?.length !== 1 ? "s" : ""}
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]"
              onClick={handleFollowersClick}>
                {numberOfFollowers} Followers
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]"
              onClick={handleFollowingClick}>
                {numberOfFollowing} Following
              </div>
            </div>
            <div>
              <div className="flex items-start text-[1.1vw] font-bold mb-5">
                {userProfile.profileData.user.display_name}
              </div>
              <div className="flex flex-col max-w-[450px] break-words text-[1.1vw]">
                {userProfile.profileData.profile.bio}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col p-1 sm:p-2 max-w-full mx-auto border-t border-white border-opacity-30"></div>
      </div>
      <FollowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        users={modalType === 'followers' ? followers : following}
      />
    </>
  );
};

export default ProfileHeader;
