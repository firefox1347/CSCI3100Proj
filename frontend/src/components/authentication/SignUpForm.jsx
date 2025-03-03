import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {axiosInstance} from "../../lib/axios.js";
import toast from "react-hot-toast";
import {Loader} from "lucide-react";


const SignUpForm = () => {
    const [gender, setGender] = useState("");
	const [email, setEmail] = useState("");
	const [display_name , setDisplayName] = useState("");
	const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");

    const {mutate:signupMutation, isLoading} = useMutation({
        mutationFn: async(data) => {
            console.log(data);
            const res = await axiosInstance.post("auth/signup", data);
            return res.data;
        },
        onSuccess:() => {
            toast.success("Account created successfully");
        },
        onError:(err) => {
            toast.error("Something went wrong :\n" + err.response.data.message);
        },
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        signupMutation({display_name , email, password, dob, gender});
    }



  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
				type='text'
				placeholder='Display name'
				value={display_name }
				onChange={(e) => setDisplayName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <input
				type='date'
				placeholder='Date of birth (YYYY-MM-DD)'
				value={dob}
				onChange={(e) => setDob(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className='input input-bordered w-full'>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <button type="submit" disabled={isLoading} className="btn btn-info w-full text-white">
                {isLoading ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
            </button>
    </form>
  )

}
export default SignUpForm