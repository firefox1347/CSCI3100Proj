import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const LoginForm = () => {
    const [username_or_email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const QueryClient = useQueryClient();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const {mutate:loginMutation, isLoading} = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            toast.success("Logged in successfully");
            QueryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => {
            toast.error("Something went wrong :\n" + err.response.data.message);
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: (email) => axiosInstance.post("/auth/forgotpassword", { email }),
        onSuccess: () => {
            toast.success("Password reset email sent!");
            setShowForgotPassword(false);
            setResetEmail("");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Error sending reset email");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation({username_or_email, password});
    }

  return (
    <>
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username_or_email}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>

            <div className="text-center mt-2">
                <button 
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                >
                    Forgot Password?
                </button>
            </div>
		</form>

        <Dialog open={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                <div className="space-y-4 mt-4">
                    <TextField
                        fullWidth
                        label="Enter your registered email"
                        variant="outlined"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={forgotPasswordMutation.isPending}
                        onClick={() => forgotPasswordMutation.mutate(resetEmail)}
                    >
                        {forgotPasswordMutation.isPending ? 
                            <Loader className='size-5 animate-spin' /> : 
                            "Send Reset Email"
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
    
        
        
  )
}

export default LoginForm