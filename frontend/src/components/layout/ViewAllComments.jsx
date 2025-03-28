import {
    Box,
    Modal,
    Typography,
    IconButton
  } from "@mui/material";
  import CloseIcon from '@mui/icons-material/Close';
  
  const ViewAllComments = ({ open, onClose, comments }) => {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">All Comments</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {comments.map((comment, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                <span style={{ fontWeight: "bold" }}>{comment.user}</span>{" "}
                {comment.text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Modal>
    );
  };
  
  export default ViewAllComments;