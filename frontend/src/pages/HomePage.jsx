import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import FaceIcon from "@mui/icons-material/Face";
import Groups2Icon from "@mui/icons-material/Groups2";
import PostCreation from "../components/layout/PostCreation";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import { set } from "mongoose";

import FeedPost from "../components/layout/FeedPost";

const HomePage = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    staleTime: 1000,
  });

  const { data: allPosts, isLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/allpost");
      return res.data;
    },
  });
 
  const displayName = authUser.display_name ? authUser.display_name : authUser.username;

  const recommendedUsers = []; // Empty array to hide the section

  if (isLoading) return null;
  const posts = [
    {
      _id: "post1",
      img: "/img1.png",
      username: "demoUser",
      avatar: "/img2.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center w-70 h-96 sticky">
        <div className="mb-4">
          <FaceIcon
            style={{
              fontSize: "4rem",
              color: "black",
            }}
          />
        </div>
        <p className="font-bold text-center text-gray-800 text-xl">
          {displayName ? displayName : authUser.username}
        </p>
        <div className="flex flex-col space-y-6 w-full">
          <Link 
            to="/" 
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Home"
          >
            <HomeIcon fontSize="large" className="text-gray-700" />
            <span className="text-lg" style={{color: "black"}}>Home</span>
          </Link>

          <Link
            to="/friend"
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Friends"
          >
            <PeopleIcon fontSize="large" className="text-gray-700" />
            <span className="text-lg" style={{color: "black"}}>Friends</span>
          </Link>

          <Link
            to={`/profile/${authUser.username}`}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Profile"
          >
            <AccountBoxIcon fontSize="large" className="text-gray-700" />
            <span className="text-lg" style={{color: "black"}}>Profile</span>
          </Link>
        </div>

      </div>

      {/* to do get icon from user and put above */}

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation />
        {/* Create post above, get post below */}

        {allPosts?.posts.map((post) => (
          // Post placeholder
          <div key={post._id} className="mb-4 p-4 bg-white rounded-lg shadow">
            <FeedPost
              key={post._id}
              postid={post._id}
              img={post.images[0]}
              userid={post.author}
              content={post.content}
            />
          </div>
        ))}

        {allPosts.posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">{/* Placeholder for Users icon */}</div>

            <div className="mb-4">
              <Groups2Icon
                style={{
                  fontSize: "4rem",
                  color: "black",
                }}
              />
            </div>
            <h2 className="font-bold text-gray-800 text-3xl">No Posts Yet</h2>
            <p className="text-gray-800 ">
              Add friends to see their posts here!
            </p>
          </div>
        )}
      </div>

      {/* Removed recommended users section */}
    </div>
  );
};

export default HomePage;
