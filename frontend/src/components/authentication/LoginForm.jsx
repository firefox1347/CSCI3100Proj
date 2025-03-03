import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
    const [display_name_or_email, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const QueryClient = useQueryClient();

    const {mutate:loginMutation, isLoading} = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            toast.success("Logged in successfully");
            QueryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => {
            toast.error("Something went wrong :\n" + err.response.data.message);
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation({display_name_or_email, password});
    }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={display_name_or_email}
				onChange={(e) => setDisplayName(e.target.value)}
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
		</form>
  )
}

export default LoginForm