import { Box, IconButton, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ViewAllComments from "./ViewAllComments";
import { createComment } from "./commentHandle";

const PostFooter = ({ username, content }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1000);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([{ user: username, text: content }]); // thiss should be replaced from test comment to the ORIGINAL comment by the user
  const [viewCommentsOpen, setViewCommentsOpen] = useState(false);

  // Hardcoded current user - replace with actual auth in real app
  const currentUser = "current_user";

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: currentUser, text: newComment.trim() },
      ]);
      setNewComment("");
    }
  };

  return (
    <Box sx={{ mb: 10 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 2 }}>
        <IconButton onClick={handleLike} size="small">
          {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
        </IconButton>
        <IconButton size="small">
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ mb: 1, color: "black" }}
      >
        {likes.toLocaleString()} likes
      </Typography>

      {comments.slice(0, 2).map((comment, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{ mb: 0.5, color: "black" }}
        >
          <span style={{ fontWeight: "bold" }}>{comment.user}</span>{" "}
          <span>{comment.text}</span>
        </Typography>
      ))}

      <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button
          variant="contained"
          size="small"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
        >
          Post
        </Button>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, cursor: "pointer" }}
        onClick={() => setViewCommentsOpen(true)}
      >
        View all {comments.length} comments
      </Typography>

      <ViewAllComments
        open={viewCommentsOpen}
        onClose={() => setViewCommentsOpen(false)}
        comments={comments}
      />
    </Box>
  );
};

export default PostFooter;
