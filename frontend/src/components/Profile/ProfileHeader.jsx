import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { set } from "mongoose";
import EditProfile from "./EditProfile";

const ProfileHeader = (userProfile) => {
 
    //console.log(userProfile.profileData.profile.username);
    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const queryClient = useQueryClient();
    const testurl = "https://www.polyu.edu.hk/af/-/media/Department/AF/People/acad_staff/Dr-Chinedu-Increase-ONWACHUKWU/increase_.png?bc=ffffff&h=860&w=560&rev=cf8ede1ea62646d5aceef2c7c2e5304f&hash=4365276A5D977B480CC94487B0008529";
    const navigate = useNavigate();
    // const { data : connectionStauts, refetch: refetchConnectionStatus } = useQuery({ 
    //     queryKey: ["connectionStatus", userData._id],
    //     queryFn: () => axiosInstance.get(`/connections/status/${userData._id} `),
    //     enabled: !isSelfProfile,
    // });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // const { data : connectionStauts, refetch: refetchConnectionStatus } = useQuery({
  //     queryKey: ["connectionStatus", userData._id],
  //     queryFn: () => axiosInstance.get(`/connections/status/${userData._id} `),
  //     enabled: !isSelfProfile,
  // });

  // const isConnected = userData.connections.some((connection) => connection._id === authUser._id);
  // const { mutate: sendConnectionRequest } = useMutation({
  // 	mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
  // 	onSuccess: () => {
  // 		toast.success("Connection request sent");
  // 		refetchConnectionStatus();
  // 		queryClient.invalidateQueries(["connectionRequests"]);
  // 	},
  // 	onError: (error) => {
  // 		toast.error(error.response?.data?.message || "An error occurred");
  // 	},
  // });

  // const { mutate: acceptRequest } = useMutation({
  // 	mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
  // 	onSuccess: () => {
  // 		toast.success("Connection request accepted");
  // 		refetchConnectionStatus();
  // 		queryClient.invalidateQueries(["connectionRequests"]);
  // 	},
  // 	onError: (error) => {
  // 		toast.error(error.response?.data?.message || "An error occurred");
  // 	},
  // });

  // const { mutate: rejectRequest } = useMutation({
  // 	mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
  // 	onSuccess: () => {
  // 		toast.success("Connection request rejected");
  // 		refetchConnectionStatus();
  // 		queryClient.invalidateQueries(["connectionRequests"]);
  // 	},
  // 	onError: (error) => {
  // 		toast.error(error.response?.data?.message || "An error occurred");
  // 	},
  // });

    const handleEdit = () => {
      if (userProfile.isSelfProfile){
        navigate(`edit`);
      }
      else{
        toast.error("You can only edit your own profile");
      }
    }


  return (
    <>
      <div className="flex flex-col border-b-2 border-grey-200 pb-6 text-[1.5vw]">
        <div className="flex items-center justify-center">
          <div className="flex mr-20">
            <img
              src={testurl}
              alt="Rounded avatar"
              className="w-40 h-40 mr-4 rounded-full aspect-square"
              style={{
                width: '200px',
                height: '200px', 
                borderRadius: '50%', 
                objectFit: 'cover', 
              }}
            />
          </div>

          <div className="flex flex-col items-start h-40">
            <div className="flex  items-start justify-start">
              <div className="flex text-[1.1vw] font-bold h-10 items-center">
                {userProfile.profileData.profile.username}
              </div>
              { userProfile.isSelfProfile ? (
                  <div className="flex items-center justify-center">
                  <button
                    className="flex items-center justify-center text-[1.1vw] w-full bg-white text-black mx-4 py-2 px-10 rounded-full hover:bg-primary-dark border-2 transition duration-300 h-10"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : null }
              
            </div>

            <div className="flex items-start space-between mt-4 w-full">
              <div className="text-center font-bold mr-6 mb-3 text-[1.1vw]">
                0 Post
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]">
                158 Followers
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]">
                1964 Following
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
    </>
  );
};

export default ProfileHeader;
