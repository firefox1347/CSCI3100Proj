import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import { ProfilePosts } from "../components/Profile/profilePosts";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { username } = useParams();
  // const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });
  const isSelfProfile = username == authUser.username;

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/profile/${username}`);
      return res.data;
    },
  });
  if (isUserProfileLoading) return null;
  // const { mutate: updateProfile } = useMutation({
  // 	mutationFn: async (profileData) => {
  // 		await axiosInstance.put("/users/profile", profileData);
  // 	},
  // 	onSuccess: () => {
  // 		toast.success("Profile updated successfully");
  // 		queryClient.invalidateQueries(["userProfile", username]);
  // 	},
  // });

  // if (isLoading || isUserProfileLoading) return null;

  // const isSelfProfile = authUser.username === userProfile.data.username;
  // const userData = isSelfProfile ? authUser : userProfile.data;

  // const handleSave = (updatedData) => {
  // 	updateProfile(updatedData);
  // };
  return (
    <>
      <div className="p-4 max-w-4xl w-full mx-auto">
        {<ProfileHeader profileData={userProfile} />}
        <ProfileTabs />
        <ProfilePosts />
      </div>
    </>
  );
};

export default ProfilePage;
