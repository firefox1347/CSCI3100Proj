import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";


const UserCard = ({ userid }) => {

    console.log(userid);
    const { data: userInfo, isLoading } = useQuery({
      queryKey: ["userInfo", userid],
      queryFn: async () => {
        const res = await axiosInstance.get(`/user/userinfo/${userid}`);
        return res.data.userInfo;
      },
    });

    if (isLoading) return <div className="animate-pulse">Loading...</div>;
    if (!userInfo) return null;
  
    const displayName = userInfo.username;
    const profileName = userInfo.name;
    console.log(displayName);
  
    return (
      <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Link 
          to={`/profile/${displayName}`}
          className="flex items-center space-x-3 w-full"
        >
          <img
            src={userInfo.avatar || "/default-avatar.png"}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-800 hover:underline">
              {profileName}
            </p>
            <p className="text-sm text-gray-500">@{userInfo.username}</p>
          </div>
        </Link>
      </div>
    );
  };
  
export default UserCard;