import { useState, useRef, useEffect } from 'react';
import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const PostCreation = () => {
    const [input, setInput] = useState("");
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const fileInputRef = useRef(null);
    const [previewUrls, setPreviewUrls] = useState([]);

    const { data: authUser } = useQuery({ queryKey: ["authUser"], staleTime: 1000 }); // get user data from backend\

    useEffect(() => {
        // Clean up object URLs when component unmounts
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Initialize validation variables first
        const validFiles = [];
        const newPreviewUrls = [];

        if (images.length + files.length > 9) {
            setErrorMessage("Maximum 9 images allowed");
            e.target.value = null;
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage("Please upload an image file");
                e.target.value = null;
                return;
            }
            validFiles.push(file);
            newPreviewUrls.push(URL.createObjectURL(file));
        }

        setErrorMessage("");
        setImages(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        e.target.value = null;
    };

    const handleImageRemove = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            const removedUrl = newUrls.splice(index, 1)[0];
            URL.revokeObjectURL(removedUrl);
            return newUrls;
        });
    };

    const QueryClient = useQueryClient();


    const handlePostCreate = () => {
        if (!input.trim() && images.length === 0) {
            setErrorMessage("Please write something or upload images");
            return;
        }

        const formData = new FormData();
        if (input) formData.append('content', input);
        images.forEach(image => formData.append('images', image));
        formData.append('userId', authUser._id);
        createPostMutation(formData);
    };

    const { mutate: createPostMutation, isLoading } = useMutation({
        mutationFn: async (formData) => {
            const res = await axiosInstance.post("/posts/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Post created successfully");
            QueryClient.invalidateQueries({ queryKey: ["posts"] });
            setInput("");
            setImages([]);
            setPreviewUrls([]);
        },
        onError: (err) => {
            toast.error("Something went wrong: " + (err.response?.data?.message || " Failed to create post"));
        },
    });


    return (
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <textarea
                className="w-full p-2 bg-white border border-black rounded placeholder-gray-600"
                placeholder="What's on your mind?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ color: 'black' }}
            />

            <div className="mt-1 flex flex-col gap-2">
                {previewUrls.map((url, index) => (
                    <div key={url} className="relative">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="max-h-48 w-auto rounded"
                        />
                        <button
                            onClick={() => handleImageRemove(index)}
                            className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                        >
                            X
                        </button>
                    </div>
                ))}

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageAdd}
                    className="hidden"
                    multiple
                />

                <div className="flex justify-between mt-1">
                    <button className="mt-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload Images
                    </button>

                    <button 
                        onClick={handlePostCreate}
                        disabled={isLoading}
                        className="mt-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isLoading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="mt-1 text-red-500 text-sm">{errorMessage}</div>
            )}
        </div>
    );
};

export default PostCreation;