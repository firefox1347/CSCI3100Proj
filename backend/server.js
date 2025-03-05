import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on potr ${PORT}`);
  connectDB();
});
