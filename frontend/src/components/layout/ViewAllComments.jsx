import {
  Box,
  Modal,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReplyIcon from "@mui/icons-material/Reply";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import ReportCommentCard from "./ReportCommentCard";
import ReportSubCommentCard from "./ReportSubCommentCard";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

const ViewAllComments = ({ open, onClose, postid }) => {
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentReportOpen, setCommentReportOpen] = useState(false);
  const [subCommentReportOpen, setSubCommentReportOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedSubCommentId, setSelectedSubCommentId] = useState(null);

  const queryClient = useQueryClient();

  // Fetch user
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    enabled: open,
  });

  // Fetch Comments
  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", postid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/comments/post/${postid}`);
      return res.data.comments;
    },
    enabled: open,
  });

  // Debug Function
  const debugFetchComments = async () => {
    try {
      console.log(comments[0].subComment[0].author);
      console.log("[DEBUG] Fetching comments for post:", postid);
      const response = await axiosInstance.get(`/comments/post/${postid}`);
      // console.log("Frontend received:", response.data);

      console.log("[DEBUG] API Response:", {
        status: response.status,
        data: response.data,
      });

      if (response.data.success) {
        toast.success(`Fetched ${response.data.comments.length} comments`);
        return response.data.comments;
      }
      toast.error("API Error: " + (response.data.message || "Unknown error"));
    } catch (error) {
      console.error("[DEBUG] Fetch Error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      toast.error(
        "Fetch Failed: " + (error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

  // Comment posting mutation
  const { mutate: postComment } = useMutation({
    mutationFn: (content) =>
      axiosInstance.post(`/comments/post/${postid}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postid]);
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      toast.error(
        "Failed to post comment: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const { mutate: postSubComment } = useMutation({
    mutationFn: ({ content, commentid }) =>
      axiosInstance.post(`/comments/${commentid}/reply`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postid]);
      toast.success("Reply posted successfully!");
    },
    onError: (error) => {
      toast.error(
        "Failed to post reply: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  // Like handler
  const handleLike = async (commentId) => {
    try {
      console.log("Attempting to like comment:", commentId);

      const response = await axiosInstance.put(`/comments/${commentId}/like`);
      console.log("Like response:", response.data);

      if (response.data.success) {
        queryClient.invalidateQueries(["comments", postid]);
      }
    } catch (error) {
      console.error("Like error details:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Like action failed");
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyClick = (commentId, username) => {
    if (replyingTo) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ commentId, username });
    }
  };

  const handlePostComment = () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    if (replyingTo) {
      postSubComment({
        content: trimmedComment,
        commentid: replyingTo.commentId,
      });
    } else {
      postComment(trimmedComment);
    }
    setNewComment("");
    setReplyingTo(null);
  };

  const handleSubCommentLike = async (commentid, subcommentid) => {
    try {
      console.log("Attempting to like subcomment:", subcommentid);
      console.log("Parent comment: ", commentid);

      const response = await axiosInstance.put(
        `/comments/${commentid}/${subcommentid}/like`
      );
      console.log("Like response:", response.data);

      if (response.data.success) {
        queryClient.invalidateQueries(["comments", postid]);
      }
    } catch (error) {
      console.error("Like error details:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Like action failed");
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          color: "black",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">All Comments</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Debug Button */}
        {/* <Button 
            variant="outlined" 
            onClick={debugFetchComments}
            sx={{ mb: 2 }}
          >
            Debug Fetch Comments
          </Button> */}

        {/* Comment List */}
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", mb: 2 }}>
          {comments.map((comment) => (
            <Box key={comment._id} sx={{ mb: 2 }}>
              <Stack spacing={0.5}>
                {/* Username */}
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {comment.author?.username || "Unknown User"}
                </Typography>

                {/* Comment content */}
                <Typography variant="body2">{comment.content}</Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 0.5,
                  }}
                >
                  {/* Like button */}
                  <IconButton
                    size="small"
                    onClick={() => handleLike(comment._id)}
                  >
                    {comment.likes?.some((id) => id === currentUser?._id) ? (
                      <FavoriteIcon fontSize="small" sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>

                  {/* Like count */}
                  <Typography variant="caption">{comment.noOfLikes}</Typography>
                  
                  {/* Reply button */}
                  <IconButton size="small">
                    <ReplyIcon
                      fontSize="small"
                      onClick={() =>
                        handleReplyClick(comment._id, comment.author.username)
                      }
                    />
                  </IconButton>
                  
                  {comment.noOfSubComment > 0 && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleReplies(comment._id)}
                      sx={{ textTransform: "none" }}
                    >
                      View {comment.noOfSubComment}{" "}
                      {comment.noOfSubComment === 1 ? "reply" : "replies"}
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                      setCommentReportOpen(true);
                      setSelectedCommentId(comment._id);
                    }}
                  >
                    <OutlinedFlagIcon />
                  </IconButton>
                  

                </Box>

                {/* Subcomments */}
                {showReplies[comment._id] &&
                  comment.subComment?.map((sub) => (
                    <Box
                      key={sub._id}
                      sx={{
                        ml: 3,
                        mt: 1,
                        borderLeft: "2px solid #ddd",
                        pl: 1.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {sub.author?.username || "Unknown User"}
                        {/* {console.log("sub_author = ", sub.author)} */}
                      </Typography>
                      <Typography variant="body2">{sub.content}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mt: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleSubCommentLike(comment._id, sub._id)
                          }
                        >
                          {sub.likes?.some((id) => id === currentUser?._id) ? (
                            <FavoriteIcon
                              fontSize="small"
                              sx={{ color: "red" }}
                            />
                          ) : (
                            <FavoriteBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                        <Typography variant="caption">
                          {sub.noOfLikes}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ marginLeft: "auto" }}
                          onClick={() => {
                            setSubCommentReportOpen(true);
                            setSelectedCommentId(comment._id);
                            setSelectedSubCommentId(sub._id);
                          }}
                        >
                          <OutlinedFlagIcon />
                        </IconButton>
                        
                      </Box>
                    </Box>
                  ))}
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
          <ReportCommentCard
                    open={commentReportOpen}
                    onClose={() => setCommentReportOpen(false)}
                    commentid={selectedCommentId}
                  />
          <ReportSubCommentCard
                          open={subCommentReportOpen}
                          onClose={() => setSubCommentReportOpen(false)}
                          commentid={selectedCommentId}
                          subcommentid={selectedSubCommentId}
                        />
        </Box>

        {/* Comment Input */}
        <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              replyingTo
                ? `Replying to ${replyingTo.username}`
                : "Add a comment..."
            }
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => handlePostComment()}
            disabled={!newComment.trim()}
          >
            {replyingTo ? "Reply" : "Post"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewAllComments;
