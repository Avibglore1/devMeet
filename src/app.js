import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);

connectDB()
.then(()=>{
    console.log("Database connected");
    app.listen(4000, ()=>{
    console.log(`server is listening at 4000`);
})
})
.catch(err=>{
    console.error("Database not connected");
})
