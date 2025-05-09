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
import { set } from "mongoose";

const ReportCard = ({ open, onClose, postid }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reason.length == 0) {
      toast.error("reason must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const body = {
        reason: reason,
      };
      const response = await axiosInstance.post(`/report/reportPost/${postid}`, body);

      if (response.data.success) {
        setSuccess(true);
        toast.success("Reported successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Report failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form 
        onSubmit={(e) => {
          handleSubmit(e);
          setReason("");
          onClose();
        }} 
        className="space-y-6"
      >
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Report Reason
            </label>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <div className="mt-1">
            <input
              id="reason"
              name="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
            />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Reporting..." : "Report"}
          </button>
        </div>
      </form>
      </Box>
    </Modal>
  );
};

export default ReportCard;
