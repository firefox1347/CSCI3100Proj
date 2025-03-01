import mongoose from "mongoose";

export const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("dtabase connected");
    } catch (error) {
        console.error("fail to connect to db" + error);
        process.exit(1);
    }
}