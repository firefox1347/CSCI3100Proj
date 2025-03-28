import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [gender, setGender] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");

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
  console.log(authUser);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <input
          type="text"
          placeholder={"display name"}
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input input-bordered w-full"
        />
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
        <textarea
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="input input-bordered w-full"
          style={{ display: "block" }}
        />
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
