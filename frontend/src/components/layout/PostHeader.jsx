import { Avatar, Box, Typography } from "@mui/material";

const PostHeader = ({ username, avatar }) => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%", 
        my: 2 
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* when click avatar should link to bio */}
        <Avatar 
          src={avatar} 
          alt="user profile pic" 
          sx={{ width: 32, height: 32 }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" fontWeight="bold" color="black">
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 1w
          </Typography>
        </Box>
      </Box>
      <Typography 
        variant="body2" 
        color="primary" 
        fontWeight="bold"
        sx={{ 
          cursor: "pointer",
          "&:hover": { color: "text.primary" },
          transition: "color 0.2s ease-in-out"
        }}
      >
        Unfollow 
        {/* will be replaced with a button to actually unfollow */}
      </Typography>
    </Box>
  );
};

export default PostHeader;