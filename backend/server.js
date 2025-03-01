import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on potr ${PORT}`);
    connectDB();
})