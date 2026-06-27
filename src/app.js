import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.use((req,res)=>{
    res.send("From server to u")
})

connectDB().then(()=>{
    console.log("Database connected");
    app.listen(4000, ()=>{
    console.log(`server is listening at 4000`);
})
}).catch(err=>{
    console.error("Database not connected");
})
