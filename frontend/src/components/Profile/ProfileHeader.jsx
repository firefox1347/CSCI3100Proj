import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const ProfileHeader = (data) => {
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();
  const testurl =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExIVFRUXFxgXGBUYGBcXFxoYFRoXFxgXFxcYHSggGholHRgVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKcBLgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAJxABAQABAgMIAwEAAAAAAAAAAAERAvAhMUESUWFxgaGxwZHh8dH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A4kZLScwa08EtJVBJklOjMBqxFv8AP2lAWb9UlwZAsSRrAAWFSAs37FXDOAW6epCcP0UFsZkXP8W94JEyuEyDWu5rMWoCpYunSlgLCaTC6aCU0zqkmWrMAeHumkniWAVCzuAEFBua72ezm9nOcdMyYl88WsyFTAFMtMgUysIBU3v8qune/IGYthSUEikgCwk8P7gwdrfmDK2mCAYNVJSgS7810phZPEEuEDIFiLlZANOkwIAZACxqafwzhcgZKpMfsGauTK2AnsmprHkkoBp9f0gC5TK2qCFhYtoJSmAAmopATk1Dr3F38AmDVDPwgKsQyBVvgXyL/gJeZkM9ATJatMghWtMZ6gjRdPcUEgpyAQMAL3JAFkJd/aZUBeXgmmrAW/38MZ4tM0DClvLfiQAkLvqlgNXj/nsiLQAt+ygsiYIs5gmCwlXTIBqiLSagT2JA04AXBqqeAGqL2e9JUAXBIsoFnIqc2ppAmfx/UlOvJMALWaoItpSQDVTBgBZw37IRMgpklS0Gql5JxWgILMAmV34+qEBqb9ksW+HL6SAuEyuYkBMrgJ5AumpklQGu0mEbt39AzSE0mQWpYUnUAwVdQJnfNfX1Zw1AWTcZ81t35lBKuCTgZzgEpYumGqgkoWFAt6kIATuZaZwDVmEvkaosoLd7/CWmQEkJBYDLWruEyCyE5AAdBAWVMgC3wRcrjw5gjUnHyn0zaYBWbhvSzjoBkyUsBckQ1AZWGWfUGoYJq+CAmCcA38gQpCgsiVJFt3yAyZ+iUkA9CCy8Ov8AQSRMdVp4ewGroFqZApF7SQDBVTUC47lz8JlYCYSNFvKAyVcLICRcIuATUalKCVGsJKBE1GSgY+15ralA4JFkQFiyZ80x3rv8AnXuXh8ogKW+CGAa01JqFgM2NYQAl4mDBQML2v6zjgAsNVIAkXBkkAwmFkMdwGVmr/C8+CXfiC4TVw4JSgpLSLQMFq7+kwCaqWLAERqoAupKYyCZWkm974kBFJOiQGsJgKC2M1Zw5FAwQANULfEu/kAS1cYIC6TCUBYmTK3xBIhauASRrH6Zq0DtGd8lvJmA1YlJTAIKALhMgCrdJQZw1Kzku/UFm/dbpu/BOqeYLYtiWpKBpq1FBMrEtauQZlajMq9rfqBnCJFA6EgUCLPtIS+IFIsTPADKkvFKDV7vhLzSVb+wQ1au7kuUkATHIi2AkKajIFW9FNQM2Ks+zwzviBd+zLdiT+gmTTpWxAWxn0WoDVSrb474pgDJAoGrhTTMmTAJv5awJOILCxKdAW436Eu/QnumoEs3+FJep6giyexnJbwAi3mkgCRccDqAkIqyAliNRMAX/S0pnu+AME0mFgI1aAE4pIAJ0yaaAEpLve+IAJaoBgwAAAGFsAGWpqv2AJq38FAEpVAL1IAF4lm/yAGqG/cARZwAEUAXCACNVAEy1yqAP//Z";

    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const queryClient = useQueryClient();
    const testurl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExIVFRUXFxgXGBUYGBcXFxoYFRoXFxgXFxcYHSggGholHRgVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKcBLgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAJxABAQABAgMIAwEAAAAAAAAAAAERAvAhMUESUWFxgaGxwZHh8dH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A4kZLScwa08EtJVBJklOjMBqxFv8AP2lAWb9UlwZAsSRrAAWFSAs37FXDOAW6epCcP0UFsZkXP8W94JEyuEyDWu5rMWoCpYunSlgLCaTC6aCU0zqkmWrMAeHumkniWAVCzuAEFBua72ezm9nOcdMyYl88WsyFTAFMtMgUysIBU3v8qune/IGYthSUEikgCwk8P7gwdrfmDK2mCAYNVJSgS7810phZPEEuEDIFiLlZANOkwIAZACxqafwzhcgZKpMfsGauTK2AnsmprHkkoBp9f0gC5TK2qCFhYtoJSmAAmopATk1Dr3F38AmDVDPwgKsQyBVvgXyL/gJeZkM9ATJatMghWtMZ6gjRdPcUEgpyAQMAL3JAFkJd/aZUBeXgmmrAW/38MZ4tM0DClvLfiQAkLvqlgNXj/nsiLQAt+ygsiYIs5gmCwlXTIBqiLSagT2JA04AXBqqeAGqL2e9JUAXBIsoFnIqc2ppAmfx/UlOvJMALWaoItpSQDVTBgBZw37IRMgpklS0Gql5JxWgILMAmV34+qEBqb9ksW+HL6SAuEyuYkBMrgJ5AumpklQGu0mEbt39AzSE0mQWpYUnUAwVdQJnfNfX1Zw1AWTcZ81t35lBKuCTgZzgEpYumGqgkoWFAt6kIATuZaZwDVmEvkaosoLd7/CWmQEkJBYDLWruEyCyE5AAdBAWVMgC3wRcrjw5gjUnHyn0zaYBWbhvSzjoBkyUsBckQ1AZWGWfUGoYJq+CAmCcA38gQpCgsiVJFt3yAyZ+iUkA9CCy8Ov8AQSRMdVp4ewGroFqZApF7SQDBVTUC47lz8JlYCYSNFvKAyVcLICRcIuATUalKCVGsJKBE1GSgY+15ralA4JFkQFiyZ80x3rv8AnXuXh8ogKW+CGAa01JqFgM2NYQAl4mDBQML2v6zjgAsNVIAkXBkkAwmFkMdwGVmr/C8+CXfiC4TVw4JSgpLSLQMFq7+kwCaqWLAERqoAupKYyCZWkm974kBFJOiQGsJgKC2M1Zw5FAwQANULfEu/kAS1cYIC6TCUBYmTK3xBIhauASRrH6Zq0DtGd8lvJmA1YlJTAIKALhMgCrdJQZw1Kzku/UFm/dbpu/BOqeYLYtiWpKBpq1FBMrEtauQZlajMq9rfqBnCJFA6EgUCLPtIS+IFIsTPADKkvFKDV7vhLzSVb+wQ1au7kuUkATHIi2AkKajIFW9FNQM2Ks+zwzviBd+zLdiT+gmTTpWxAWxn0WoDVSrb474pgDJAoGrhTTMmTAJv5awJOILCxKdAW436Eu/QnumoEs3+FJep6giyexnJbwAi3mkgCRccDqAkIqyAliNRMAX/S0pnu+AME0mFgI1aAE4pIAJ0yaaAEpLve+IAJaoBgwAAAGFsAGWpqv2AJq38FAEpVAL1IAF4lm/yAGqG/cARZwAEUAXCACNVAEy1yqAP//Z";
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
        navigate("/editProfile");
    }


  return (
    <>
      <div className="flex flex-col border-b-2 vorder-grey-200 pb-6 text-[1.5vw]">
        <div className="flex items-center justify-center">
          <div className="flex mr-20">
            <img
              src={testurl}
              alt="Rounded avatar"
              className="w-40 h-40 mr-4 rounded-full aspect-square"
              style={{ aspectRatio: 1, maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div className="flex flex-col items-start h-40">
            <div className="flex  items-start justify-start">
              <div className="flex text-[1.1vw] font-bold h-10 items-center">
                {data.profileData.username}
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center justify-center text-[1.1vw] w-full bg-white text-black mx-4 py-2 px-10 rounded-full hover:bg-primary-dark border-2 transition duration-300 h-10"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="flex items-start space-between mt-4 w-full mb-10">
              <div className="text-center font-bold mr-6 mb-3 text-[1.1vw]">
                0 Post
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]">
                0 Followers
              </div>
              <div className="text-center font-bold mx-6 mb-3 text-[1.1vw]">
                0 Following
              </div>
            </div>
            <div className="flex flex-col max-w-[450px] break-words text-[1.1vw]">
              {data.profileData.bio}
            </div>
          </div>
        </div>
        <div class="flex flex-col p-1 sm:p-2 max-w-full mx-auto border-t border-white border-opacity-30"></div>
      </div>
      {editing && <EditProfile />}
    </>
  );
};

export default ProfileHeader;
