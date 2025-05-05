import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignUpPage from "./pages/authentication/SignUpPage";
import LoginPage from "./pages/authentication/LoginPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import FriendPage from "./pages/FriendPage";
import AdminPage from "./pages/AdminPage";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios";
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "./pages/ProfilePage";
import { useLocation } from "react-router-dom";
import EditProfile from "./components/Profile/EditProfile";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    },
  });


  const location = useLocation();
  console.log("Current Location:", location.pathname);


  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/admin"
          element={authUser?.isAdmin ? <AdminPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path={`/profile/:username`}
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
		    <Route
          path={`/profile/:username/edit`}
          element={authUser ? <EditProfile /> : <Navigate to="/login" />}
        />
		    <Route
          path="/friend"
          element={authUser ? <FriendPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/resetpassword/:reset_pw_token"
          element={<ResetPasswordPage />} />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
