import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import PostModal from "../layout/PostModal";


export const ProfilePosts = ({ username }) => {
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { data: userPosts, isLoading } = useQuery({
    queryKey: ["profilePosts", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/mypost`);
      return res.data.posts;
    }
  });

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {userPosts?.map((post) => (
        post.images?.length > 0 && (
          <div 
            key={post._id} 
            className="relative aspect-square cursor-pointer"
            onClick={() => setSelectedPostId(post._id)}
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