import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
const [gender, setGender] = useState("");
const [display_name , setDisplayName] = useState("");
const [bio, setBio] = useState("");
const [dob, setDob] = useState("");

const queryClient = useQueryClient();
const navigate = useNavigate();

const { data: authUser } = useQuery({
  queryKey: ['authUser'],
});
console.log(authUser._id);
const originalName = authUser.username;
  const { mutate: updateProfile, isLoading } = useMutation({
    mutationFn: async (profileData) => {
      await axiosInstance.put(`/profile/${originalName}/edit`, profileData);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries(['userProfile']);
      navigate(`/profile/${originalName}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      display_name,
      bio,
      dob,
      gender,
      user_id: authUser._id
    };

    updateProfile(profileData);

  };


  return (
    <>
      <div className="text-center text-3xl">Edit Profile</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
          type='text'
          placeholder='Display name'
          value={ display_name }
          onChange={(e) => setDisplayName(e.target.value)}
          className='input input-bordered w-full'
          required
        />
        <input
          type='date'
          placeholder='Date of birth (YYYY-MM-DD)'
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className='input input-bordered w-full'
          required
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className='input input-bordered w-full'>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
        </select>
        <input
          type='text'
          placeholder='Bio'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className='input input-bordered w-full'
          required
        />
        <button type="submit" disabled={isLoading} className="btn btn-info w-full text-white bg-blue-600">
                  {isLoading ? <Loader className="size-5 animate-spin" /> : "Save Changes"}
        </button>
      </form>
    </>
    
  )
}

export default EditProfile