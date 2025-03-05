import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const PostCreation = ({ authUser }) => {
    const [input, setInput] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        // Clean up object URL when component unmounts or image changes
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleImageAdd = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrorMessage("Please upload an image file");
            return;
        }

        setErrorMessage("");
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleImageRemove = () => {
        setImage(null);
        setPreviewUrl("");
    };

    const QueryClient = useQueryClient();


    const handlePostCreate = async () => {
        if (!input.trim() && !image) {
            setErrorMessage("Please write something or upload an image");
            return;
        }
    
        setErrorMessage("");
    
        try {
            const formData = new FormData();
            
            if (input) {
                formData.append('content', input);
            }
            
            if (image) {
                formData.append('image', image);
            }

            console.log(formData);
            createPostMutation(formData);

            // Reset form after successful post
            console.log("resetted");
            setInput("");
            handleImageRemove();
    
        } catch (error) {
            
            setErrorMessage("Failed to create post. Please try again.");
        }
    };

    const { mutate: createPostMutation, isLoading } = useMutation({
        mutationFn: async (formData) => {
            const res = await axiosInstance.post("/posts/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Post created successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
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
                {previewUrl && (
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-48 w-auto rounded"
                        />

                        <button
                            onClick={handleImageRemove}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                        >
                            X
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageAdd}
                    className="hidden"
                />

                <div className="flex justify-between mt-1">
                    <button className="mt-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload Image
                    </button>

                    <button
                        onClick={handlePostCreate}
                        className="mt-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Post
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