import React from "react";
import { LogOut } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        //console.log(res.data);
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    },
  });
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => {
      axiosInstance.post("/auth/logout");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      await queryClient.refetchQueries({ queryKey: ["authUser"] });
    },
  });
  if (isLoading) return null;
  return (
    <div className="bg-gray-800 h-10 flex items-center justify-between sticky top-0 z-50">
      {authUser ? (
        <>
          <div className="flex space-x-4">
            <a
              href="https://space.bilibili.com/4176573"
              target="_blank"
              title="Subscribe Akie Meow ><"
            >
              <img
                src="../src/components/picture/bulebird_icon.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="flex space-x-4 mx auto">
            <SearchBar />
            <Link to="/" title="Just go home">
              <HomeIcon
                fontSize="large"
                className="text-white hover:text-blue-500"
              />
            </Link>
            {/* Todo: routing for profile is not done */}
            <Link to="/friend" title="Don't you have friends?">
              <PeopleIcon
                fontSize="large"
                className="text-white hover:text-blue-500"
              />
            </Link>
            {/* Todo: routing for profile is not done */}
            <Link
              to={`/profile/${authUser.username}`}
              title="Check your profile"
            >
              <AccountBoxIcon
                fontSize="large"
                className="text-white hover:text-blue-500"
              />
            </Link>
            {
              authUser?.isAdmin && (
                <Link
                  to={`/admin`}
                  title="Adminpage"
                >
                  <AdminPanelSettingsIcon
                    fontSize="large"
                    className="text-white hover:text-blue-500"
                  />
                </Link>
              )
            }

          </div>
          <div className="flex space-x-4">
            <button
              className="col-start-10 justify-self-end flex items-center space-x-1 text-sm text-gray-000 hover:text-blue-500"
              title="Bye~"
              onClick={() => logout()}
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <Link to="/login" className="btn btn-ghost">
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Join now
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
