import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import PostModal from "../layout/PostModal";


export const ProfilePosts = ({ username, isSelfProfile }) => {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: targetUser } = useQuery({
    queryKey: ["targetUser", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/profile/${username}`);
      return res.data.user;
    },
    enabled: !isSelfProfile
  });

  const { data: userPosts, isLoading } = useQuery({
    queryKey: ["profilePosts", isSelfProfile ? authUser?._id : targetUser?._id],
    queryFn: async () => {
      const endpoint = isSelfProfile 
        ? "/posts/mypost"
        : `/posts/userposts/${targetUser._id}`;
      
      const res = await axiosInstance.get(endpoint);
      return res.data.posts;
    },
    enabled: isSelfProfile || !!targetUser?._id
  });

  const handlePostClick = (postId) => {
    if (postId) setSelectedPostId(postId);
  };


  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-1 p-4">
      {userPosts?.map((post) => (
        post.images?.length > 0 && (
          <div 
            key={post._id} 
            className="relative aspect-square cursor-pointer"
            onClick={() => handlePostClick(post?._id)}
          >
            <img
              src={`data:image/jpeg;base64,${post.images[0]}`}
              className="w-full h-full object-cover rounded-md"
              alt="Post thumbnail"
            />
          </div>
        )
      ))}

      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};