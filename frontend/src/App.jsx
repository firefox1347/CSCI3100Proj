import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import SignUpPage from "./pages/authentication/SignUpPage";
import LoginPage from "./pages/authentication/LoginPage";
import HomePage from "./pages/HomePage";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios";
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "./pages/ProfilePage";
import { useLocation } from "react-router-dom";
import EditProfile from "./components/Profile/EditProfile";
import { useAuthUser } from "./hooks/useAuthUser"

function App() {
  const { data: authUser, isLoading } = useAuthUser();
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
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
