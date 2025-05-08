import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [resolveData, setResolveData] = useState({
    ban: true,
    mute: false,
    duration: 1,
  });
  const [activeTab, setActiveTab] = useState("pending");

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", activeTab],
    queryFn: async () => {
      const endpoints = {
        pending: "/admin/reportContent",
        resolved: "/admin/resolvedreportContent",
        rejected: "/admin/rejectedreportContent",
      };
      const response = await axiosInstance.get(endpoints[activeTab]);
      return response.data;
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ entry }) => {
      const endpoints = {
        post: `/admin/changeReportPostState/${entry._id}`,
        comment: `/admin/changeReportCommentState/${entry._id}`,
        subcomment: `/admin/changeReportSubCommentState/${entry._id}`
      };
      return axiosInstance.post(endpoints[entry.reportType], { state: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reports", activeTab]);
      toast.success("Report rejected successfully");
    },
    onError: (error) => {
      toast.error(`Error rejecting report: ${error.response?.data?.message || error.message}`);
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ entry, resolveData }) => {
      const reportEndpoints = {
        post: `/admin/changeReportPostState/${entry._id}`,
        comment: `/admin/changeReportCommentState/${entry._id}`,
        subcomment: `/admin/changeReportSubCommentState/${entry._id}`
      };
      await axiosInstance.post(reportEndpoints[entry.reportType], { state: "resolved" });

      if (resolveData.ban) {
        const banEndpoints = {
          post: `/admin/banPost/${entry.contentId._id}`,
          comment: `/admin/banComment/${entry.contentId._id}`,
          subcomment: `/admin/banSubComment/${entry.parentContentId}/${entry.contentId._id}`
        };
        await axiosInstance.post(banEndpoints[entry.reportType]);
      }

      if (resolveData.mute) {
        let userId;
        if (entry.reportType === "subcomment") {
          userId = entry.contentAuthor?._id || entry.contentAuthor;
        } else {
          userId = entry.contentId?.author?._id || entry.contentId?.author;
        }
      
        if (!userId) {
          throw new Error("User ID not found for muting");
        }
      
        await axiosInstance.post(`/admin/muteUser/${userId}`, {
          duration: parseInt(resolveData.duration)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reports", activeTab]);
      toast.success("Report resolved successfully");
    },
    onError: (error) => {
      toast.error(`Error resolving report: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleResolve = (entry) => {
    setSelectedEntry(entry);
    setShowResolveModal(true);
  };

  const handleReject = (entry) => {
    rejectMutation.mutate({ entry });
  };

  const handleResolveConfirm = () => {
    resolveMutation.mutate({ entry: selectedEntry, resolveData });
    setShowResolveModal(false);
  };

  const getEntries = () => {
    if (!data) return [];
    
    const entries = {
      pending: {
        posts: data.reportedPostEntries,
        comments: data.reportedCommentEntries,
        subcomments: data.reportedSubCommentEntries
      },
      resolved: {
        posts: data.ResolvedreportedPostEntries,
        comments: data.ResolvedreportedCommentEntries,
        subcomments: data.ResolvedreportedSubCommentEntries
      },
      rejected: {
        posts: data.RejectedreportedPostEntries,
        comments: data.RejectedreportedCommentEntries,
        subcomments: data.RejectedreportedSubCommentEntries
      }
    };

    return [
      ...(entries[activeTab].posts || []).map(e => ({ ...e, reportType: "post" })),
      ...(entries[activeTab].comments || []).map(e => ({ ...e, reportType: "comment" })),
      ...(entries[activeTab].subcomments || []).map(e => ({ ...e, reportType: "subcomment" }))
    ];
  };

  const entries = getEntries();

  const resolveModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Resolve Options</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={resolveData.ban}
              onChange={(e) => setResolveData({...resolveData, ban: e.target.checked})}
              className="form-checkbox text-indigo-600"
            />
            <span>Ban Content</span>
          </label>

          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={resolveData.mute}
              onChange={(e) => setResolveData({...resolveData, mute: e.target.checked})}
              className="form-checkbox text-indigo-600"
            />
            <span>Mute User</span>
          </label>

          {resolveData.mute && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Mute Duration (days)
              </label>
              <input
                type="number"
                min="1"
                value={resolveData.duration}
                onChange={(e) => setResolveData({...resolveData, duration: e.target.value})}
                className="w-full p-2 border border-gray-400 rounded text-gray-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowResolveModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleResolveConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h1 className="mb-8 text-center text-5xl font-black">
          <span className="text-indigo-700">A</span>
          <span>dmin&nbsp;</span>
          <span className="text-indigo-700">P</span>
          <span>age</span>
        </h1>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl shadow-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex gap-4 mb-6">
              {["pending", "resolved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded capitalize ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-[70vh] overflow-y-auto space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-700">Loading reports...</p>
              ) : error ? (
                <p className="text-center text-red-600">
                  Error loading reports: {error.message}
                </p>
              ) : entries.length === 0 ? (
                <p className="text-center text-gray-600">No {activeTab} reports found</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry._id} className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 bg-white">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">
                            Reason: {entry.reason}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">Type:</span>
                            <span className="capitalize px-2 py-1 bg-gray-100 rounded text-gray-800">
                              {entry.reportType}
                            </span>
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-800">
                              {/* HAVE BUG: Always get content of last comment/subcomment */}
                              Content: {entry.reportType === "subcomment" ? entry.content : entry.contentId?.content}
                            </p>
                            <p className="text-sm text-gray-600">
                              Author: {entry.reportType === "subcomment" 
                                ? entry.contentAuthor || "Unknown" 
                                : entry.contentId?.author}
                            </p>
                          </div>
                        </div>

                        {entry.reportType === "post" && (
                          <div className="flex gap-2 mt-2">
                            {entry.contentId?.images?.map((img, index) => (
                              <img
                                key={index}
                                src={`data:image/jpeg;base64,${img}`}
                                className="w-20 h-20 object-cover rounded"
                                alt="Reported post content"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                        {activeTab === "pending" && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleResolve(entry)}
                              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                            >
                              Resolved Ban
                            </button>
                            <button
                              onClick={() => handleReject(entry)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                            >
                              Reject Ban
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {showResolveModal && resolveModal}
    </div>
  );
};

export default AdminPage;