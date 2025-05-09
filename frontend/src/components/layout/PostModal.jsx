import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from '../../lib/axios';
import { Button, Grid2, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import toast from 'react-hot-toast';
import { ReplyIcon } from 'lucide-react';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import Grid from '@mui/material/Grid';

const PostModal = ({ postId, onClose }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Fetch post data with comments
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/post/${postId}`);
      return res.data?.post || null;
    },
    enabled: !!postId 
  });

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  // Like mutation
  const { mutate: toggleLike } = useMutation({
    mutationFn: () => axiosInstance.post(`/posts/like/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
    },
    onError: (error) => {
      console.error("Like error:", error);
    },
  });


  //comment mutation
  const { mutate: postComment } = useMutation({
    mutationFn: (content) => 
      axiosInstance.post(`/comments/post/${postId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      toast.success("Comment posted!");
      setNewComment('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  });

  // Reply mutation
  const { mutate: postReply } = useMutation({
    mutationFn: ({ commentId, content }) => 
      axiosInstance.post(`/comments/${commentId}/reply`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      toast.success("Reply posted!");
      setNewComment('');
      setReplyingTo(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post reply");
    }
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: () => axiosInstance.delete(`/posts/post/${postId}`),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries(["posts"]); // Invalidate relevant queries
      onClose(); // Close the modal
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  });

  const handleLike = () => {
    toggleLike();
  };

  const handleCommentSubmit = () => {
    const trimmed_comment = newComment.trim();
    if (!trimmed_comment) return;

    if (replyingTo) {
      postReply({
        commentId: replyingTo.commentId,
        content: trimmed_comment
      });
    } else {
      postComment(trimmed_comment);
    }
  };

  const handleReplyClick = (commentId, username) => {
    setReplyingTo({ commentId, username });
  };

  if (isLoading) return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-1/2 h-64 flex items-center justify-center">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
    </div>
  );

  if (isError || !post) return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-red-500">Failed to load post</p>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

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
          {post?.images?.length > 0 ? (
            <img
              src={`data:image/jpeg;base64,${post.images[0]}`}
              className="max-h-[80vh] object-contain"
              alt="Post content"
            />
          ) : (
            <div className="text-gray-500">No image available</div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-1/2 flex flex-col p-4 text-black">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            {post?.author ? (
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar_url || "/default-avatar.jpg"}
                  className="w-8 h-8 rounded-full"
                  alt="Author avatar"
                />
                <span className="font-bold">
                  {post.author.username}
                </span>
              </div>
            ) : (
              <div className="text-red-500">
                Could not load author information
              </div>
            )}
            
            {/* Like Button */}
            <div className="flex items-center gap-2">
              <IconButton onClick={handleLike} size="small">
                {post.likes?.some(id => id === currentUser?._id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2">
                {post.noOfLikes?.toLocaleString() || 0}
              </Typography>
            </div>
          </div>

          {/* Post Content */}
          <Typography variant="body1" className="mb-4">
            {post.content}
          </Typography>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-bold mb-4">Comments ({post.comments?.length || 0})</h3>
            
            {post.comments?.map((comment) => (
              <div key={comment._id} className="mb-4">
                <div className="flex items-start gap-2">
                  <img
                    src={comment.author?.avatar_url || "/default-avatar.jpg"}
                    className="w-6 h-6 rounded-full mt-1"
                    alt="Comment author"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Typography variant="body2" className="font-bold">
                        {comment.author?.username || "Unknown User"}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => handleReplyClick(comment._id, comment.author?.username)}
                      >
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    </div>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                    
                    {/* Subcomments */}
                    {comment.subComment?.map((sub) => (
                      <div key={sub._id} className="ml-4 mt-2 border-l-2 pl-2">
                        <div className="flex items-start gap-2">
                          <img
                            src={sub.author?.avatar_url || "/default-avatar.jpg"}
                            className="w-5 h-5 rounded-full mt-1"
                            alt="Subcomment author"
                          />
                          <div>
                            <Typography variant="body2" className="font-bold">
                              {sub.author?.username || "Unknown User"}
                            </Typography>
                            <Typography variant="body2">
                              {sub.content}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {post.comments?.length === 0 && (
              <Typography variant="body2" className="text-gray-500">
                No comments yet
              </Typography>
            )}
          </div>
        {/* Comment Input */}
        <div className="mt-4">
            <div className="flex gap-2">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyingTo 
                    ? `Replying to ${replyingTo.username}...`
                    : "Add a comment..."
                }
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
              >
                {replyingTo ? 'Reply' : 'Post'}
              </Button>
              {replyingTo && (
                <Button
                  size="small"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              )}
                <Grid2 size={8} className="mt-1">
                  {currentUser?._id === post.author?._id && (
                    <IconButton 
                      onClick={() => deletePost()}
                      aria-label="Delete post"
                      color="error"
                    >
                      <DeleteForeverSharpIcon fontSize="large" />
                    </IconButton>
                  )}
                </Grid2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;