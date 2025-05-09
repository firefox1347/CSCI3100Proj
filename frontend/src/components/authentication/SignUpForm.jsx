import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const SignUpForm = () => {
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

    const {mutate:signupMutation, isLoading} = useMutation({
        mutationFn: async(data) => {
            console.log(data);
            const res = await axiosInstance.post("auth/signup", data);
            return res.data;
        },
        onSuccess:() => {
            toast.success("A verification email has been sent. Please check your inbox to verify your email.", {
                autoClose: 10000
              });
        },
        onError:(err) => {
            toast.error("Something went wrong :\n" + err.response.data.message);
        },
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password.length < 8){
            toast.error("password must be at least 8 characters");
        }
        else if(!(/[A-Z]/.test(password))){
            toast.error("there must be at least one uppercase letter");
        }
        else if(!(/[a-z]/.test(password))){
            toast.error("there must be at least one lowercase letter");
        }
        else if(!(/[0-9]/.test(password))){
            toast.error("there must be at least one number");
        }
        signupMutation({username , email, password, dob, gender});
    }
    signupMutation({ username, email, password, dob, gender });

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="date"
            placeholder="Date of birth (YYYY-MM-DD)"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-info w-full text-white bg-blue-600"
          >
            {isLoading ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              "Agree & Join"
            )}
          </button>
        </form>
      );
  };

export default SignUpForm;
