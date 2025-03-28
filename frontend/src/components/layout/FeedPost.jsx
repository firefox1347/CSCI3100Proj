import { Box } from "@mui/material";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

const FeedPost = ({ img, username, avatar }) => {
  return (
    <>
      <PostHeader username={username} avatar={avatar} />
      <Box sx={{ my: 2, borderRadius: 4, overflow: "hidden" }}>
        <img 
          src={img} 
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </Box>
      <PostFooter username={username} />
    </>
  );
};

export default FeedPost;