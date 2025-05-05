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
import UserCard from "../components/layout/UserCard";

import FeedPost from "../components/layout/FeedPost";

const AdminPage = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    staleTime: 1000,
  });



   const displayName = authUser?.display_name ? authUser.display_name : authUser?.username;
  



  return (
    <div>
        {/* ppc help me*/ }
    </div>
  );
};

export default AdminPage;
