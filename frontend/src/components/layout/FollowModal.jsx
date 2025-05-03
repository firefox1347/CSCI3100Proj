import { Dialog, DialogContent, DialogTitle, List, ListItem, Avatar, Typography } from "@mui/material";

export const FollowModal = ({ open, onClose, title, users }) => {
    console.log(users[0]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List>
          {users?.map((user) => (
            <ListItem key={user._id} button component="a" href={`/profile/${user.username}`}>
              <Avatar src={user.avatar_url} sx={{ mr: 2 }} />
              <Typography variant="body1">
                {user.display_name || user.username}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};