import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from '../../lib/axios';


const PostModal = ({ postId, onClose }) => {
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/post/${postId}`);
      return res.data.post;
    }
  });

  if (isLoading || !post) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg flex max-w-4xl max-h-[90vh] w-full">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          &times;
        </button>

        {/* Image Section */}
        <div className="w-1/2 bg-gray-100 p-4 flex items-center justify-center">
          <img
            src={`data:image/jpeg;base64,${post.images[0]}`}
            className="max-h-[80vh] object-contain"
            alt="Post content"
          />
        </div>

        {/* Content Section */}
        <div className="w-1/2 flex flex-col p-4 text-black">
          {/* Post Header */}
          <div className="border-b pb-2 mb-4">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar_url}
                className="w-8 h-8 rounded-full"
                alt="Author avatar"
              />
              <span className="font-bold">{post.author.username}</span>
            </div>
            <p className="mt-2">{post.content}</p>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-bold mb-4">Comments</h3>
                Comment section - TODO
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;