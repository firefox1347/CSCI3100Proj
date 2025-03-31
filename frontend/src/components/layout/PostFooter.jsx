import { Box, IconButton, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ViewAllComments from "./ViewAllComments";
import { createComment } from "./commentHandle";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

const PostFooter = ({ username, content, postid }) => {
  const queryClient = useQueryClient();
  const [viewCommentsOpen, setViewCommentsOpen] = useState(false);


  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    }
  });

  const { data: postData } = useQuery({
    queryKey: ['post', postid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/post/${postid}/likes`);
      return res.data.post;
    },
    enabled: !!postid
  });

  // console.log("postData Received!");
  // console.log(postData.likes);

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => axiosInstance.post(`/posts/like/${postid}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postid]);
    },
    onError: (error) => {
      console.error('Like error:', error);
      toast.error(error.response?.data?.message + 'Failed to update like');
    }
  });

  const handleLike = () => {
    toggleLike();
  };

  return (
    <Box sx={{ mb: 1 }}>
      {/* Like and comment button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 2 }}>
        <IconButton onClick={handleLike} size="small">
          {postData?.likes?.some(id => id === currentUser?._id) ? (
            <ThumbUpAltIcon color="primary" />
          ) : (
            <ThumbUpOffAltIcon />
          )}
        </IconButton>
        <IconButton size="small" onClick={() => setViewCommentsOpen(true)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>
        
      {/* Likes count */}
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ mb: 1, color: "black" }}
      >
        {postData?.noOfLikes?.toLocaleString() || 0} likes
      </Typography>
      
      {/* Username and content of post */}
      <Typography variant="body2" sx={{ mb: 0.5, color: "black" }}>
        <span style={{ fontWeight: "bold" }}>{username}</span> {content}
      </Typography>
      
      {/* All comment window */}
      <ViewAllComments
        open={viewCommentsOpen}
        onClose={() => setViewCommentsOpen(false)}
        postid={postid}
      />
    </Box>
  );
};

export default PostFooter;
