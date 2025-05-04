import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const EditProfile = () => {
  const [gender, setGender] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState(null);
const [previewAvatar, setPreviewAvatar] = useState("");
const fileInputRef = useRef(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  console.log(authUser._id);
  const originalName = authUser.username;
  const { mutate: updateProfile, isLoading } = useMutation({
    mutationFn: async (profileData) => {
      await axiosInstance.put(`/profile/${originalName}/edit`, profileData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile"]);
      navigate(`/profile/${originalName}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
  
    setAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let base64Avatar = "";
    if (avatar) {
      base64Avatar = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onload = () => resolve(reader.result.split(",")[1]);
      });
    }

    const originalData = {
      display_name: authUser.display_name,
      // bio: authUser.bio,
      // dob: authUser.dob,
      // gender: authUser.gender,
    };

    const updatedData = {
      display_name: display_name || originalData.display_name,
      bio: bio,
      dob: dob,
      gender: gender,
      user_id: authUser._id,
      avatar: base64Avatar,
    };
    console.log(updatedData);

    const profileData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([key, value]) => value !== originalData[key]
      )
    );

    if (Object.keys(profileData).length > 0) {
      updateProfile(profileData);
    } else {
      toast.info("No changes made");
    }
  };


  const handleResetBio = () => {
    updateProfile({ bio: "^&*" });
  };

  return (
    <>
      <div className="flexitems-center mb-5">
        <button
          type="button" // Change to button to prevent form submission
          onClick={() => navigate(-1)}
          className="btn btn-sm flex flex-col text-white bg-blue-600"
        >
          Back
        </button>
        <div className="text-center text-3xl">Edit Profile</div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
        <div className="relative">
          <img
            src={previewAvatar || authUser.avatar_url || "../../../public/default-avatar.jpg"}
            alt="Avatar preview"
            className="w-32 h-32 rounded-full cursor-pointer mb-2"
            onClick={() => fileInputRef.current.click()}
          />
          {previewAvatar && (
            <button
              type="button"
              onClick={() => {
                setPreviewAvatar("");
                setAvatar(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              ×
            </button>
          )}
        </div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-blue-500 text-sm"
          >
            {avatar ? "Change Avatar" : "Upload Avatar"}
          </button> 
             
      </div>

      

      <div className="relative">
          <input
            type="text"
            placeholder="Display name"
            value={display_name}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input input-bordered w-full pr-16"
          />
      </div>
        <input
          type="date"
          placeholder="Date of birth (YYYY-MM-DD)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="input input-bordered w-full"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="input input-bordered w-full"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div className="relative">
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="textarea textarea-bordered w-full pr-20"
          rows="4"
        />
        <button
          type="button"
          onClick={handleResetBio}
          className="absolute right-2 top-2 btn btn-xs btn-ghost z-10"
        >
          Clear bio
        </button>
      </div>

        <span></span>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-info flex flex-col w-full text-white bg-blue-600"
        >
          {isLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </>
  );
};

export default EditProfile;
