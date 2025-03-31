import { Box } from "@mui/material";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { axiosInstance } from "../../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FeedPost = ({ postid, img, userid, content }) => {
  const { data: postOwner, isLoading } = useQuery({
    queryKey: ["postOwner", userid],  // Add userid to query key
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/postowner/${userid}`);
      return res.data.postOwner;
    },
  });
  console.log(postOwner);
  if (isLoading) return null;

  return (
    <>
      <PostHeader username={postOwner.username} avatar={postOwner.avatar} />
      <Box sx={{ my: 2, borderRadius: 4, overflow: "hidden" }}>
        {img && (
          <img
            src={`data:image/jpeg;base64,${img}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}
      </Box>
      <PostFooter username={postOwner.username} content={content} postid={postid}/>
    </>
  );
};

export default FeedPost;
