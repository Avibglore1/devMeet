import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectDB = async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB